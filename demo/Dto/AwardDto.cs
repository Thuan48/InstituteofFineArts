namespace demo.Dto
{
    public class AwardDto
    {
        public int CompetitionId { get; set; }
        public int UserId { get; set; }
        public string? AwardTitle { get; set; }
        public string? AwardDescription { get; set; }
        public decimal? PrizeMoney { get; set; }
        public DateTime DateAwarded { get; set; }
    }
}
