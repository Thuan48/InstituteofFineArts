using demo.Model;
using demo.Interfaces;
using demo.Dto;
using System.Collections.Generic;
using System.Linq;
using demo.Response;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using demo.Service;

namespace demo.Repository
{
    public class UserRepo : IUserRepo
    {
        private readonly DatabaseContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IMailService _mailService;
        private readonly IConfiguration _configuration;

        public UserRepo(DatabaseContext context, IWebHostEnvironment env, IMailService mailService, IConfiguration configuration)
        {
            _context = context;
            _env = env;
            _mailService = mailService;
            _configuration = configuration;
        }

        public IEnumerable<Users> GetAll()
        {
            return _context.Users.ToList();
        }

        public Users GetById(int id)
        {
            return _context.Users.Find(id)!;
        }

        public async Task<CustomResult> AddUsers(Register register)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(register.Password);
            var user = new Users
            {
                Name = register.Name,
                Email = register.Email,
                Password = hashedPassword,
                Role = register.Role,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "User updated successfully", user);
        }

        public async Task<CustomResult> UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return new CustomResult(404, "User not found", 0);
            }

            user.Name = updateUserDto.Name;
            user.Email = updateUserDto.Email;

            if (updateUserDto.UploadImage != null)
            {
                if (string.IsNullOrEmpty(_env.WebRootPath))
                {
                    throw new Exception("WebRootPath is not set");
                }

                var fileName = GenerateUniqueName(updateUserDto.UploadImage.FileName);
                var uploadPath = Path.Combine(_env.WebRootPath, "images");
                Directory.CreateDirectory(uploadPath);
                var filePath = Path.Combine(uploadPath, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await updateUserDto.UploadImage.CopyToAsync(fileStream);
                }

                user.ProfileImage = fileName;
            }

            user.UpdatedAt = DateTime.Now;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "User updated successfully", user);
        }

        public async Task<CustomResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return new CustomResult(200, "User updated successfully", user);
            }
            return new CustomResult(404, "User update not found", 0);
        }

        public IEnumerable<Users> Search(string keyword)
        {
            return _context.Users
                .Where(u => (u.Name != null && u.Name.Contains(keyword)) || (u.Email != null && u.Email.Contains(keyword)))
                .ToList();
        }

        public async Task<CustomResult> ChangePassword(int id, string newPassword)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return new CustomResult(404, "User not found", 0);
            }
            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Password changed successfully", user);
        }

        public async Task<CustomResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var user = await _context.Users.FindAsync(resetPasswordDto.UserId);
            if (user == null)
            {
                return new CustomResult(404, "User not found", 0);
            }

            var temporaryCode = await _context.TemporaryCodes
                .FirstOrDefaultAsync(tc => tc.UserId == resetPasswordDto.UserId && tc.Code == resetPasswordDto.Code);

            if (temporaryCode == null || temporaryCode.ExpiryTime < DateTime.Now)
            {
                return new CustomResult(400, "Invalid or expired code", 0);
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);
            user.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();

            _context.TemporaryCodes.Remove(temporaryCode);
            await _context.SaveChangesAsync();

            return new CustomResult(200, "Password reset successfully", user);
        }

        public async Task<CustomResult> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);
            if (user == null)
            {
                return new CustomResult(404, "User not found", 0);
            }

            var temporaryCode = await _context.TemporaryCodes.FirstOrDefaultAsync(tc => tc.UserId == user.UserId);
            if (temporaryCode == null)
            {
                temporaryCode = new TemporaryCode
                {
                    UserId = user.UserId,
                    Code = new Random().Next(100000, 999999).ToString(),
                    ExpiryTime = DateTime.Now.AddMinutes(10)
                };
                _context.TemporaryCodes.Add(temporaryCode);
            }
            else
            {
                temporaryCode.Code = new Random().Next(100000, 999999).ToString();
                temporaryCode.ExpiryTime = DateTime.Now.AddMinutes(10);
                _context.TemporaryCodes.Update(temporaryCode);
            }

            await _context.SaveChangesAsync();

            var url = $"{_configuration["ClientInfo:Url"]}/reset-password?code={temporaryCode.Code}&userid={user.UserId}";

            await _mailService.SendMailAsync(new MailRequest()
            {
                ToEmail = forgotPasswordDto.Email,
                Body = GenerateEmailBody(url, "reset your password", temporaryCode.Code),
                Subject = "Password Reset Confirmation",
                Attachments = null
            });

            return new CustomResult(200, "Reset password email sent", temporaryCode);
        }

        public async Task<CustomResult> UpdateRole(int id, string newRole)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return new CustomResult(404, "User not found", 00);
            }
            user.Role = newRole;
            user.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Role updated successfully", user);
        }

        public async Task<Users> FindUserProfile(string jwt)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(jwt) as JwtSecurityToken;

            if (jsonToken == null)
            {
                throw new Exception("Invalid token");
            }

            var email = jsonToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Email)?.Value;

            if (email == null)
            {
                throw new Exception("Email claim not found in token");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                throw new Exception($"User not found with email: {email}");
            }

            return user;
        }

        private string GenerateUniqueName(string originalName)
        {
            string ext = Path.GetExtension(originalName);
            return $"{Guid.NewGuid()}{ext}";
        }

        private string GenerateEmailBody(string url, string action, string code)
        {
            return $"Please click <a href=\"{url}\">here</a> to {action}. Your code is {code}";
        }
    }
}
