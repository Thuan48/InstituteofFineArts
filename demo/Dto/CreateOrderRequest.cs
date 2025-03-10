namespace demo.Dto
{
  public class CreateOrderRequest
  {
    public int ExhibitionSubmissionId { get; set; }
    public string Buyer { get; set; }
    public string OrderDescription { get; set; } 
    public string PaymentStatus { get; set; } 
  }
}