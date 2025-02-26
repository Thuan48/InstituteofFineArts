namespace demo.Dto
{
    public class MailRequest
    {

        public string? ToEmail { get; set; }

        public string? Body { get; set; }

        public string? Subject { get; set; }

        public ICollection<IFormFile>? Attachments { get; set; }
    }
}
