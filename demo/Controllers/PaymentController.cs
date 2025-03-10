using demo.Model.VnPay;
using demo.Service.VnPay;
using Microsoft.AspNetCore.Mvc;

namespace demo.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class PaymentController : ControllerBase
  {
    private readonly IVnPayService _vnPayService;
    private readonly IConfiguration _configuration;

    public PaymentController(IVnPayService vnPayService, IConfiguration configuration)
    {
      _vnPayService = vnPayService;
      _configuration = configuration;
    }

    [HttpPost("create-payment")]
    public IActionResult CreatePaymentUrl([FromBody] PaymentInformationModel model)
    {
      var paymentUrl = _vnPayService.CreatePaymentUrl(model, HttpContext);
      return Redirect(paymentUrl);
    }

    [HttpGet("payment-execute")]
    public IActionResult PaymentCallback()
    {
      var response = _vnPayService.PaymentExecute(Request.Query);
      if (response.Success)
      {
        return Ok(new
        {
          status = "success",
          amount = Request.Query["vnp_Amount"],
          bankCode = Request.Query["vnp_BankCode"],
          bankTranNo = Request.Query["vnp_BankTranNo"],
          cardType = Request.Query["vnp_CardType"],
          orderInfo = Request.Query["vnp_OrderInfo"],
          payDate = Request.Query["vnp_PayDate"],
          responseCode = Request.Query["vnp_ResponseCode"],
          tmnCode = Request.Query["vnp_TmnCode"],
          transactionNo = Request.Query["vnp_TransactionNo"],
          transactionStatus = Request.Query["vnp_TransactionStatus"],
          txnRef = Request.Query["vnp_TxnRef"]
        });
      }
      return BadRequest(new { status = "failure", message = "Payment failed." });
    }
  }
}