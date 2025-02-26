using Microsoft.AspNetCore.Http;

namespace demo.Dto
{
    public class UpdateUserDto
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public IFormFile? UploadImage { get; set; } 
    }
}