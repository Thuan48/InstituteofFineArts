using demo.Dto;
using demo.Interfaces;
using demo.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.IO;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Http;

namespace demo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepo _userRepo;

        public UserController(IUserRepo userRepo)
        {
            _userRepo = userRepo;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Users>> GetAll()
        {
            return Ok(_userRepo.GetAll());
        }

        [HttpGet("{id}")]
        public ActionResult<Users> GetById(int id)
        {
            var user = _userRepo.GetById(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult> Add(Register register)
        {
            var result = await _userRepo.AddUsers(register);
            if (result.Status == 404)
            {
                return NotFound(result.Message);
            }
            else if (result.Status == 400)
            {
                return BadRequest(result.Message);
            }
            else
            {
                return Ok(result.Data);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromForm] UpdateUserDto updateUserDto)
        {
            var existingUser = _userRepo.GetById(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            var result = await _userRepo.UpdateUser(existingUser.UserId, updateUserDto);
            if (result.Status == 404)
            {
                return NotFound(result.Message);
            }
            return Ok(result.Data);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _userRepo.DeleteUser(id);
            if (result.Status == 404)
            {
                return NotFound(result.Message);
            }
            return NoContent();
        }

        [HttpGet("search")]
        public ActionResult<IEnumerable<Users>> Search(string keyword)
        {
            return Ok(_userRepo.Search(keyword));
        }

        [HttpPost("{id}/change-password")]
        public async Task<ActionResult> ChangePassword(int id, [FromBody] string newPassword)
        {
            var result = await _userRepo.ChangePassword(id, newPassword);
            if (result.Status == 404)
            {
                return NotFound(result.Message);
            }
            else if (result.Status == 400)
            {
                return BadRequest(result.Message);
            }
            return Ok(result.Data);
        }

        [HttpPost("{id}/reset-password")]
        public async Task<ActionResult> ResetPassword(int id)
        {
            var result = await _userRepo.ResetPassword(id);
            if (result.Status == 404)
            {
                return NotFound(result.Message);
            }
            return Ok(result.Data);
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult> ForgotPassword([FromBody] string email)
        {
            var result = await _userRepo.ForgotPassword(email);
            if (result.Status == 404)
            {
                return NotFound(result.Message);
            }
            return Ok(result.Data);
        }

        [HttpPost("{id}/update-role")]
        [Authorize(Roles = "ADMIN,MANAGER")]
        public async Task<ActionResult> UpdateRole(int id, [FromBody] string newRole)
        {
            var result = await _userRepo.UpdateRole(id, newRole);
            if (result.Status == 404)
            {
                return NotFound(result.Message);
            }
            else if (result.Status == 400)
            {
                return BadRequest(result.Message);
            }
            return Ok(result.Data);
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<Users>> GetUserProfile()
        {
            string token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            try
            {
                Users user = await _userRepo.FindUserProfile(token);
                return Ok(user);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("export-pdf")]
        public ActionResult ExportPdf()
        {
            var users = _userRepo.GetAll();

            using (var ms = new MemoryStream())
            {
                Document doc = new Document();
                PdfWriter.GetInstance(doc, ms);
                doc.Open();

                var fontPath = "C:\\Windows\\Fonts\\arial.ttf";
                var baseFont = BaseFont.CreateFont(fontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                var titleFont = new Font(baseFont, 16, Font.BOLD);

                doc.Add(new Paragraph("User List", titleFont));
                doc.Add(new Paragraph(" "));

                foreach (var user in users)
                {
                    string userInfo = $"ID: {user.UserId} | Name: {user.Name} | Email: {user.Email} | Role: {user.Role}";
                    doc.Add(new Paragraph(userInfo, new Font(baseFont, 12)));
                }

                doc.Close();
                return File(ms.ToArray(), "application/pdf", "users.pdf");
            }
        }

        [HttpGet("export-excel")]
        public ActionResult ExportExcel()
        {
            var users = _userRepo.GetAll();
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Users");
                worksheet.Cell(1, 1).Value = "UserId";
                worksheet.Cell(1, 2).Value = "Name";
                worksheet.Cell(1, 3).Value = "Email";
                worksheet.Cell(1, 4).Value = "Role";
                int row = 2;
                foreach (var user in users)
                {
                    worksheet.Cell(row, 1).Value = user.UserId;
                    worksheet.Cell(row, 2).Value = user.Name;
                    worksheet.Cell(row, 3).Value = user.Email;
                    worksheet.Cell(row, 4).Value = user.Role;
                    row++;
                }
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return File(stream.ToArray(),
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                "users.xlsx");
                }
            }
        }

        [HttpPost("import-excel")]
        [Authorize(Roles = "ADMIN,STAFF,MANAGER")]
        public async Task<ActionResult> ImportExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file was uploaded.");
            }

            if (!file.FileName.EndsWith(".xlsx", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Only Excel (.xlsx) files are accepted.");
            }

            int successCount = 0;
            var errors = new List<string>();

            using (var stream = file.OpenReadStream())
            using (var workbook = new XLWorkbook(stream))
            {
                var worksheet = workbook.Worksheets.First();

                var header1 = worksheet.Cell(1, 1).GetValue<string>().Trim().ToLower();
                var header2 = worksheet.Cell(1, 2).GetValue<string>().Trim().ToLower();
                var header3 = worksheet.Cell(1, 3).GetValue<string>().Trim().ToLower();

                if (header1 != "name" || header2 != "email" || header3 != "password")
                {
                    return BadRequest("Excel file format is invalid. The first row must contain: Name, Email, Password.");
                }

                int row = 2;
                while (!worksheet.Cell(row, 1).IsEmpty())
                {
                    try
                    {
                        var name = worksheet.Cell(row, 1).GetValue<string>();
                        var email = worksheet.Cell(row, 2).GetValue<string>();
                        var password = worksheet.Cell(row, 3).GetValue<string>();
                        var role = "STUDENT";

                        var register = new demo.Dto.Register
                        {
                            Name = name,
                            Email = email,
                            Password = password,
                            Role = role
                        };

                        var result = await _userRepo.AddUsers(register);
                        if (result.Status == 200)
                        {
                            successCount++;
                        }
                        else
                        {
                            errors.Add($"Row {row}: " + result.Message);
                        }
                    }
                    catch (Exception ex)
                    {
                        errors.Add($"Row {row}: {ex.Message}");
                    }
                    row++;
                }
            }

            return Ok(new { Success = successCount, Errors = errors });
        }
    }
}
