using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace demo.Model
{
    public class Users
    {
        [Key]
        public int UserId { get; set; }

        [MaxLength(255)]
        public string? Name { get; set; }

        [MaxLength(255)]
        public string? Email { get; set; }

        [Required]
        public string? Role { get; set; }

        [MaxLength(255)]
        public string? Password { get; set; }

        [MaxLength(255)]
        public string? ProfileImage { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
