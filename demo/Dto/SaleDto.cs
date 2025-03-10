using System.ComponentModel.DataAnnotations;

namespace demo.Dto
{
    public class SaleDto
    {
        [Required]
        public int ExhibitionSubmissionId { get; set; }

        [Required]
        [MaxLength(255)]
        public string? Buyer { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Sold price must be greater than zero.")]
        public decimal SoldPrice { get; set; }

        [Required]
        public DateTime SoldDate { get; set; }
    }
}
