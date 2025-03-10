using demo.Dto;
using demo.Model;
using demo.Model.VnPay;
using demo.Service.VnPay;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace demo.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class OrderController : ControllerBase
  {
    private readonly DatabaseContext _context;
    private readonly IVnPayService _vnPayService;

    public OrderController(DatabaseContext context, IVnPayService vnPayService)
    {
      _context = context;
      _vnPayService = vnPayService;
    }

    [HttpPost("create-order")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        var exhibitionSubmission = await _context.ExhibitionSubmissions
            .FirstOrDefaultAsync(es => es.ExhibitionSubmissionId == request.ExhibitionSubmissionId && es.Status == "Available");

        if (exhibitionSubmission == null)
        {
          return BadRequest(new { message = "The artwork has been sold or does not exist." });
        }

        var tick = DateTime.Now.Ticks.ToString();

        var sale = new Sales
        {
          ExhibitionSubmissionId = request.ExhibitionSubmissionId,
          Buyer = request.Buyer,
          SoldPrice = exhibitionSubmission.Price,
          SoldDate = DateTime.UtcNow,
          PaymentStatus = request.PaymentStatus,
          CreatedAt = DateTime.UtcNow,
          UpdatedAt = DateTime.UtcNow,
          TransactionRef = tick
        };

        _context.Sales.Add(sale);
        await _context.SaveChangesAsync();

        var paymentUrl = _vnPayService.CreatePaymentUrl(new PaymentInformationModel
        {
          Amount = (double)sale.SoldPrice,
          OrderDescription = request.OrderDescription,
          OrderType = "order",
          Name = sale.Buyer,
          TransactionRef = tick 
        }, HttpContext);

        await transaction.CommitAsync();

        return Ok(new { paymentUrl, saleId = sale.SaleId });
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return StatusCode(500, new { message = "Error creating order.", error = ex.Message });
      }
    }
  }
}
