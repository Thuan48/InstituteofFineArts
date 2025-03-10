using demo.Model;
using demo.Settings;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

namespace demo.Service
{
    public class MailService : IMailService
    {
        private readonly MailSettings _settings;

        public MailService(IOptions<MailSettings> mailSetting)
        {

            _settings = mailSetting.Value;
        }

        public async Task SendMailAsync(MailRequest mailRequest)
        {
            try
            {
                using (MimeMessage emailMessage = new MimeMessage())
                {
                    MailboxAddress emailFrom = new MailboxAddress(_settings.DisplayName, _settings.Mail);
                    emailMessage.From.Add(emailFrom);

                    MailboxAddress emailTo = new MailboxAddress("chat user", mailRequest.ToEmail);
                    emailMessage.To.Add(emailTo);

                    emailMessage.Subject = mailRequest.Subject;

                    BodyBuilder bodyBuilder = new BodyBuilder();
                    bodyBuilder.HtmlBody = mailRequest.Body;

                    if (mailRequest.Attachments != null)
                    {
                        foreach (var formFile in mailRequest.Attachments)
                        {
                            if (formFile.Length > 0)
                            {
                                using (var stream = new MemoryStream())
                                {
                                    await formFile.CopyToAsync(stream);
                                    stream.Position = 0;
                                    bodyBuilder.Attachments.Add(formFile.FileName, stream.ToArray());
                                }
                            }
                        }
                    }

                    emailMessage.Body = bodyBuilder.ToMessageBody();

                    using (SmtpClient mailClient = new SmtpClient())
                    {
                        await mailClient.ConnectAsync(_settings.Host, _settings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                        await mailClient.AuthenticateAsync(_settings.Mail, _settings.Password);
                        await mailClient.SendAsync(emailMessage);
                        await mailClient.DisconnectAsync(true);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
