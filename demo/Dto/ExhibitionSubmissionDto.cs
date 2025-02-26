using System;

namespace demo.Dto
{
    public class ExhibitionSubmissionDto
    {
        public int ExhibitionId { get; set; }
        public int SubmissionId { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; } = "Available";
    }
}
