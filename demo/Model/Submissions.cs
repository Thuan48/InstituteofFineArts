using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace demo.Model
{
    public class Submissions
    {
        [Key]
        public int SubmissionId { get; set; }

        [ForeignKey("Users")]
        public int UserId { get; set; }
        public Users? User { get; set; }

        [ForeignKey("Competitions")]
        public int CompetitionId { get; set; }
        public Competitions? Competition { get; set; }

        [Required, MaxLength(255)]
        public string? FilePath { get; set; }

        [Required, MaxLength(255)]
        public string? Title { get; set; }

        public string? Description { get; set; }
        public DateTime SubmitDate { get; set; }

        [Required]
        public string? Status { get; set; } 

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}