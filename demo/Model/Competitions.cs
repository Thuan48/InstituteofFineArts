using System;
using System.ComponentModel.DataAnnotations;

namespace demo.Model
{
    public class Competitions
    {
        [Key]
        public int CompetitionId { get; set; }
        [Required, MaxLength(255)]
        public string? Title { get; set; }
        public string? Description { get; set; }
        [Required]
        public string? Status { get; set; } 
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Rules { get; set; }
        public string? AwardsDescription { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int CreatedBy { get; set; }
        [MaxLength(255)]
        public string? Image { get; set; }
    }
}