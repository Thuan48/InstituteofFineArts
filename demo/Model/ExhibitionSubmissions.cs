using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace demo.Model
{
    public class ExhibitionSubmissions
    {
        [Key]
        public int ExhibitionSubmissionId { get; set; }

        [ForeignKey("Exhibitions")]
        public int ExhibitionId { get; set; }
        public Exhibitions? Exhibition { get; set; }

        [ForeignKey("Submissions")]
        public int SubmissionId { get; set; }
        public Submissions? Submission { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public string Status { get; set; } = "Available";
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}