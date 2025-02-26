using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace demo.Model
{
    public class Awards
    {
        [Key]
        public int AwardId { get; set; }

        [ForeignKey("Competitions")]
        public int CompetitionId { get; set; }
        public Competitions? Competition { get; set; }

        [ForeignKey("Users")]
        public int UserId { get; set; }
        public Users? User { get; set; }

        [Required, MaxLength(255)]
        public string? AwardTitle { get; set; }

        public string? AwardDescription { get; set; }
        public DateTime DateAwarded { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal PrizeMoney { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}