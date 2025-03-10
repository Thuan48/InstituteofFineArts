using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace demo.Model
{
    public class Sales
    {
        [Key]
        public int SaleId { get; set; }

        [ForeignKey("ExhibitionSubmissions")]
        public int ExhibitionSubmissionId { get; set; }
        public ExhibitionSubmissions? ExhibitionSubmission { get; set; }

        [Required, MaxLength(255)]
        public string? Buyer { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal SoldPrice { get; set; }
        public DateTime SoldDate { get; set; }

        [Required]
        public string? PaymentStatus { get; set; }
        public string TransactionRef { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}