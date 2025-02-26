using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace demo.Model
{
    public class Evaluations
    {
        [Key]
        public int EvaluationId { get; set; }

        [ForeignKey("Submissions")]
        public int SubmissionId { get; set; }
        public Submissions? Submission { get; set; }

        [ForeignKey("Users")]
        public int StaffId { get; set; }
        public Users? Staff { get; set; }

        public int Score { get; set; }

        [Required]
        public string? Status { get; set; }

        public string? Remarks { get; set; }
        public DateTime EvaluationDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}