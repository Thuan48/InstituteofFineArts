using System;

namespace demo.Model
{
  public class TemporaryCode
  {
    public int Id { get; set; }
    public string Code { get; set; }
    public DateTime ExpiryTime { get; set; }
    public int UserId { get; set; }
  }
}
