using demo.Model.VnPay;

namespace demo.Service.VnPay  
{
    public interface IVnPayService
    {
    string CreatePaymentUrl(PaymentInformationModel model, HttpContext context);
    PaymentResponseModel PaymentExecute(IQueryCollection collections);
  }
}