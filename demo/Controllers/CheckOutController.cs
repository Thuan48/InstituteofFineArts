using demo.Model.VnPay;
using demo.Service.VnPay;
using Microsoft.AspNetCore.Mvc;

namespace demo.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CheckOutController : ControllerBase
  {
    private readonly IVnPayService _vnPayService;

    public CheckOutController(IVnPayService vnPayService)
    {
      _vnPayService = vnPayService;
    }

    [HttpPost("create-payment-url")]
    public IActionResult CreatePaymentUrl([FromBody] PaymentInformationModel model)
    {
      var paymentUrl = _vnPayService.CreatePaymentUrl(model, HttpContext);
      return Ok(new { Url = paymentUrl });
    }

    [HttpGet("payment-execute")]
    public IActionResult PaymentExecute()
    {
      var response = _vnPayService.PaymentExecute(Request.Query);
      return Ok(response);
    }
  }
}
