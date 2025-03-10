using demo.Libraries;
using demo.Model;
using demo.Model.VnPay;
using demo.Service;
using demo.Dto;
using Microsoft.Extensions.DependencyInjection;

namespace demo.Service.VnPay
{
  public class VnPayService : IVnPayService
  {
    private readonly IConfiguration _configuration;
    private readonly IServiceProvider _serviceProvider;
    private readonly IMailService _mailService;

    public VnPayService(IConfiguration configuration, IServiceProvider serviceProvider, IMailService mailService)
    {
      _configuration = configuration;
      _serviceProvider = serviceProvider;
      _mailService = mailService;
    }

    public string CreatePaymentUrl(PaymentInformationModel model, HttpContext context)
    {
      var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
      var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
      var tick = DateTime.Now.Ticks.ToString();
      var pay = new VnPayLibrary();
      var urlCallBack = _configuration["Vnpay:PaymentBackReturnUrl"];

      pay.AddRequestData("vnp_Version", _configuration["Vnpay:Version"]);
      pay.AddRequestData("vnp_Command", _configuration["Vnpay:Command"]);
      pay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"]);
      pay.AddRequestData("vnp_Amount", ((int)(model.Amount * 100)).ToString()); // Ensure amount is multiplied by 100
      pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
      pay.AddRequestData("vnp_CurrCode", _configuration["Vnpay:CurrCode"]);
      pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context));
      pay.AddRequestData("vnp_Locale", _configuration["Vnpay:Locale"]);
      pay.AddRequestData("vnp_OrderInfo", $"{model.Name} {model.OrderDescription} {model.Amount}");
      pay.AddRequestData("vnp_OrderType", model.OrderType);
      pay.AddRequestData("vnp_ReturnUrl", urlCallBack);
      pay.AddRequestData("vnp_TxnRef", model.TransactionRef);

      var paymentUrl = pay.CreateRequestUrl(_configuration["Vnpay:BaseUrl"], _configuration["Vnpay:HashSecret"]);

      return paymentUrl;
    }

    public PaymentResponseModel PaymentExecute(IQueryCollection collections)
    {
      var pay = new VnPayLibrary();
      var response = pay.GetFullResponseData(collections, _configuration["Vnpay:HashSecret"]);

      if (response.VnPayResponseCode == "00" && response.Success)
      {
        using (var scope = _serviceProvider.CreateScope())
        {
          var dbContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
          var transactionRef = collections["vnp_TxnRef"].ToString();
          var sale = dbContext.Sales.FirstOrDefault(s => s.TransactionRef == transactionRef);
          if (sale != null)
          {
            var updateStatusDto = new UpdateStatusDto
            {
              PaymentStatus = "sold",
              SoldDate = DateTime.UtcNow
            };

            sale.PaymentStatus = updateStatusDto.PaymentStatus;
            sale.SoldDate = updateStatusDto.SoldDate;

            if (sale.PaymentStatus == "sold")
            {
              var updateStatusExSubDto = new UpdateStatusExSubDto
              {
                ExhibitionSubmissionStatus = "sold"
              };

              var exhibitionSubmission = dbContext.ExhibitionSubmissions.FirstOrDefault(es => es.ExhibitionSubmissionId == sale.ExhibitionSubmissionId);
              if (exhibitionSubmission != null)
              {
                exhibitionSubmission.Status = updateStatusExSubDto.ExhibitionSubmissionStatus;
              }
            }

            dbContext.SaveChanges();

            var billContent = $"<h3>Hóa đơn thanh toán</h3>" +
                              $"<p>Mã đơn hàng: {sale.SaleId}</p>" +
                              $"<p>Số tiền: {sale.SoldPrice:C}</p>" +
                              $"<p>Ngày thanh toán: {sale.SoldDate:dd/MM/yyyy HH:mm:ss}</p>" +
                              $"<p>Cảm ơn quý khách đã thanh toán thành công.</p>";

            var mailRequest = new MailRequest
            {
              ToEmail = sale.Buyer,
              Subject = "Payment Successful",
              Body = billContent,
              Attachments = null
            };
            _mailService.SendMailAsync(mailRequest).Wait();
          }
        }
        response.Success = true;
      }
      else
      {
        response.Success = false;
      }

      return response;
    }
  }
}