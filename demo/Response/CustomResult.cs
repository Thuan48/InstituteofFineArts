namespace demo.Response
{
    public class CustomResult
    {
        public CustomResult(int statusCode, string message, object data)

        {

            Status = statusCode;

            Message = message;

            Data = data;

        }
        public int Status { get; }

        public string? Message { get; }

        public object? Data { get; }
    }
}
