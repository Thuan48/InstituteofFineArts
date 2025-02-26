namespace demo.Dto
{
    public class CompetitionDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Rules { get; set; }
        public string? AwardsDescription { get; set; }
        public string? Status { get; set; } 
        public int CreatedBy { get; set; }
        public IFormFile? Image { get; set; }
    }
}
