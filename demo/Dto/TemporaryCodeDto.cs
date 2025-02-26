using System;

namespace demo.Dto
{
    public class TemporaryCodeDto
    {
        public string Code { get; set; }
        public DateTime ExpiryTime { get; set; }
        public int UserId { get; set; } // Add UserId property

        public TemporaryCodeDto(int userId)
        {
            UserId = userId;
            Code = GenerateCode();
            ExpiryTime = DateTime.Now.AddSeconds(60);
        }

        private string GenerateCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        public bool IsValid()
        {
            return DateTime.Now <= ExpiryTime;
        }
    }
}
