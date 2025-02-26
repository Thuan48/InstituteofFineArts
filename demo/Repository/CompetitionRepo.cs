using demo.Dto;
using demo.Interfaces;
using demo.Model;
using demo.Response;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;

namespace demo.Repository
{
    public class CompetitionRepo : ICompetitionRepo
    {
        private readonly DatabaseContext _context;
        private readonly IWebHostEnvironment _env;

        public CompetitionRepo(DatabaseContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<CustomResult> GetAllCompetitions(int pageNumber, int pageSize)
        {
            var competitions = await _context.Competitions
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var now = DateTime.Now;
            foreach (var competition in competitions)
            {
                if (competition.StartDate > now)
                {
                    if (competition.Status != "Upcoming")
                    {
                        competition.Status = "Upcoming";
                        _context.Competitions.Update(competition);
                    }
                }
                else if (competition.StartDate <= now && competition.EndDate > now)
                {
                    if (competition.Status != "Ongoing")
                    {
                        competition.Status = "Ongoing";
                        _context.Competitions.Update(competition);
                    }
                }
                else if (competition.EndDate < now)
                {
                    if (competition.Status != "Close")
                    {
                        competition.Status = "Close";
                        _context.Competitions.Update(competition);
                    }
                }
            }
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Competitions retrieved successfully", competitions);
        }

        public async Task<CustomResult> GetCompetitionById(int id)
        {
            var competition = await _context.Competitions.FindAsync(id);
            if (competition == null)
            {
                return new CustomResult(404, "Competition not found", 00);
            }
            return new CustomResult(200, "Competition retrieved successfully", competition);
        }

        public async Task<CustomResult> AddCompetition(CompetitionDto competitionDto)
        {
            var competition = new Competitions
            {
                Title = competitionDto.Title,
                Description = competitionDto.Description,
                StartDate = competitionDto.StartDate,
                EndDate = competitionDto.EndDate,
                Rules = competitionDto.Rules,
                AwardsDescription = competitionDto.AwardsDescription,
                Status = competitionDto.Status,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                CreatedBy = competitionDto.CreatedBy 
            };

            if (competitionDto.Image != null)
            {
                if (string.IsNullOrEmpty(_env.WebRootPath))
                {
                    throw new Exception("WebRootPath is not set");
                }
                var fileName = GenerateUniqueName(competitionDto.Image.FileName);
                var uploadPath = Path.Combine(_env.WebRootPath, "images");
                Directory.CreateDirectory(uploadPath);
                var filePath = Path.Combine(uploadPath, fileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await competitionDto.Image.CopyToAsync(fileStream);
                }
                competition.Image = fileName;
            }

            _context.Competitions.Add(competition);
            await _context.SaveChangesAsync();
            return new CustomResult(201, "Competition added successfully", competition);
        }

        public async Task<CustomResult> UpdateCompetition(int id, CompetitionDto competitionDto)
        {
            var competition = await _context.Competitions.FindAsync(id);
            if (competition == null)
            {
                return new CustomResult(404, "Competition not found", 0);
            }

            competition.Title = competitionDto.Title;
            competition.Description = competitionDto.Description;
            competition.StartDate = competitionDto.StartDate;
            competition.EndDate = competitionDto.EndDate;
            competition.Rules = competitionDto.Rules;
            competition.AwardsDescription = competitionDto.AwardsDescription;
            competition.Status = competitionDto.Status;
            competition.UpdatedAt = DateTime.Now;
            competition.CreatedBy = competitionDto.CreatedBy; 

            if (competitionDto.Image != null)
            {
                if (string.IsNullOrEmpty(_env.WebRootPath))
                {
                    throw new Exception("WebRootPath is not set");
                }
                var fileName = GenerateUniqueName(competitionDto.Image.FileName);
                var uploadPath = Path.Combine(_env.WebRootPath, "images");
                Directory.CreateDirectory(uploadPath);
                var filePath = Path.Combine(uploadPath, fileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await competitionDto.Image.CopyToAsync(fileStream);
                }
                competition.Image = fileName;
            }

            _context.Competitions.Update(competition);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Competition updated successfully", competition);
        }

        public async Task<CustomResult> DeleteCompetition(int id)
        {
            var competition = await _context.Competitions.FindAsync(id);
            if (competition == null)
            {
                return new CustomResult(404, "Competition not found", 00);
            }
            _context.Competitions.Remove(competition);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Competition deleted successfully", 00);
        }

        public async Task<CustomResult> SearchCompetitions(string searchTerm, int pageNumber, int pageSize)
        {
            var competitions = await _context.Competitions
                .Where(c => (c.Title != null && c.Title.Contains(searchTerm)) || (c.Description != null && c.Description.Contains(searchTerm)))
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new CustomResult(200, "Competitions retrieved successfully", competitions);
        }

        public async Task<CustomResult> UpdateCompetitionStatus(int id, string status)
        {
            var competition = await _context.Competitions.FindAsync(id);
            if (competition == null)
            {
                return new CustomResult(404, "Competition not found", 0);
            }
            competition.Status = status;
            competition.UpdatedAt = DateTime.Now;
            _context.Competitions.Update(competition);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Competition status updated successfully", competition);
        }

        private string GenerateUniqueName(string fileName)
        {
            return $"{Guid.NewGuid()}_{Path.GetFileName(fileName)}";
        }
    }
}
