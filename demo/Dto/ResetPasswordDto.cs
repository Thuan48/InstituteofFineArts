namespace demo.Dto
{
  public class ResetPasswordDto
  {
    public int UserId { get; set; }
    public string Code { get; set; }
    public string NewPassword { get; set; }
  }
}
