using demo.Dto;

namespace demo.Service
{
    public interface IMailService
    {
        public Task SendMailAsync(MailRequest mailRequest);
    }
}
