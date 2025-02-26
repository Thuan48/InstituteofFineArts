using System;
using System.ComponentModel.DataAnnotations;

namespace demo.Model
{
    public class Exhibitions
    {
        [Key]
        public int ExhibitionId { get; set; }

        [Required, MaxLength(255)]
        public string? Name { get; set; }

        public DateTime Date { get; set; }

        [Required]
        public string? Status { get; set; } 

        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}