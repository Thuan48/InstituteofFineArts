
using demo.Model;

namespace demo.Service
{
    public interface IMailService
    {
        public Task SendMailAsync(MailRequest mailRequest);
    }
}
