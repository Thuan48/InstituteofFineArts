namespace demo.Dto
{
    public class EvaluationDto
    {
        public int SubmissionId { get; set; }
        public int StaffId { get; set; }
        public int Score { get; set; }
        public string? Remarks { get; set; }
        public DateTime EvaluationDate { get; set; }
        public string? Status { get; set; }
    }
}
