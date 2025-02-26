using demo.Dto;
using demo.Interfaces;
using demo.Model;
using demo.Response;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace demo.Repository
{
    public class AuthRepo : IAuthRepo
    {
        private readonly IConfiguration _config;
        private readonly DatabaseContext _context;

        public AuthRepo(IConfiguration config, DatabaseContext context)
        {
            _config = config;
            _context = context;
        }

        public async Task<Users> Authenticate(Login userLogin)
        {
            var verified = await _context.Users.SingleOrDefaultAsync(u => u.Email == userLogin.Email);

            if (verified != null)
            {
                if (BCrypt.Net.BCrypt.Verify(userLogin.Password, verified.Password))
                {
                    return verified;
                }
            }

            return null;
        }

        public string CreateToken(Users user, DateTime expire)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim("UserId", user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Name ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role ?? string.Empty)
            };

            var token = new JwtSecurityToken(
                    issuer: _config["JwtSettings:Issuer"],
                    audience: _config["JwtSettings:Audience"],
                    signingCredentials: credentials,
                    claims: claims,
                    expires: expire
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<CustomResult> Login(Login userLogin)
        {
            var user = await Authenticate(userLogin);

            if (user == null)
            {
                return new CustomResult(400, "Wrong email or password", 00);
            }

            var token = CreateToken(user, DateTime.Now.AddDays(5));

            return new CustomResult(200, "Token created", token);
        }

        public async Task<CustomResult> Logout(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);

            var userId = int.Parse(jwtToken.Claims.FirstOrDefault(c => c.Type == "UserId").Value!);

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return new CustomResult(404, "User not found", 00);
            }
            return new CustomResult(200, "Logout successful", 00);
        }

        public async Task<CustomResult> Register(Register userRegister)
        {
            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Email == userRegister.Email);
            if (existingUser != null)
            {
                return new CustomResult(400, "Email already in use", 00);
            }

            var user = new Users
            {
                Name = userRegister.Name,
                Email = userRegister.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(userRegister.Password),
                Role = userRegister.Role,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new CustomResult(200, "User registered successfully", 00);
        }
        public async Task<CustomResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return new CustomResult(404, "User not found", 00);
            }
            return new CustomResult(200, "User retrieved successfully", user);
        }
    }
}