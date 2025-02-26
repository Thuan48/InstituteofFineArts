using Microsoft.AspNetCore.Http;

namespace demo.Dto
{
    public class SubmissionDto
    {
        public int UserId { get; set; }
        public int CompetitionId { get; set; }
        public IFormFile? UploadImage { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime SubmitDate { get; set; }
        public string? Status { get; set; }
    }
}
