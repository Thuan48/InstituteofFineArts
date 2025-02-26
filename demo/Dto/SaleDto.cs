namespace demo.Dto
{
    public class SaleDto
    {
        public int ExhibitionSubmissionId { get; set; }
        public string? Buyer { get; set; }
        public decimal SoldPrice { get; set; }
        public DateTime SoldDate { get; set; }
    }
}
