using demo.Dto;
using demo.Interfaces;
using demo.Model;
using demo.Response;
using Microsoft.EntityFrameworkCore;

namespace demo.Repository
{
    public class AwardRepo : IAwardRepo
    {
        private readonly DatabaseContext _context;

        public AwardRepo(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<CustomResult> GetAllAwards(int pageNumber, int pageSize)
        {
            var awards = await _context.Awards
                .Include(a => a.User)   
                .Include(a => a.Competition) 
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new CustomResult(200, "Awards retrieved successfully", awards);
        }

        public async Task<CustomResult> GetAwardById(int id)
        {
            var award = await _context.Awards
                .Include(a => a.User)
                .Include(a => a.Competition)
                .FirstOrDefaultAsync(a => a.AwardId == id);
            if (award == null)
            {
                return new CustomResult(404, "Award not found", 00);
            }
            return new CustomResult(200, "Award retrieved successfully", award);
        }

        public async Task<CustomResult> AddAward(AwardDto awardDto)
        {
            var competition = await _context.Competitions.FindAsync(awardDto.CompetitionId);
            if (competition == null)
            {
                return new CustomResult(404, "Competition not found", 0);
            }

            var user = await _context.Users.FindAsync(awardDto.UserId);
            if (user == null)
            {
                return new CustomResult(404, "User not found", 00);
            }

            var award = new Awards
            {
                CompetitionId = awardDto.CompetitionId,
                UserId = awardDto.UserId,
                AwardTitle = awardDto.AwardTitle ?? string.Empty,
                AwardDescription = awardDto.AwardDescription ?? string.Empty,
                PrizeMoney = awardDto.PrizeMoney ?? 0m,
                DateAwarded = awardDto.DateAwarded,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Awards.Add(award);
            await _context.SaveChangesAsync();
            return new CustomResult(201, "Award added successfully", award);
        }

        public async Task<CustomResult> UpdateAward(int id, AwardDto awardDto)
        {
            var award = await _context.Awards.FindAsync(id);
            if (award == null)
            {
                return new CustomResult(404, "Award not found", 00);
            }

            var competition = await _context.Competitions.FindAsync(awardDto.CompetitionId);
            if (competition == null)
            {
                return new CustomResult(404, "Competition not found", 00);
            }

            var user = await _context.Users.FindAsync(awardDto.UserId);
            if (user == null)
            {
                return new CustomResult(404, "User not found", 00);
            }

            award.CompetitionId = awardDto.CompetitionId;
            award.UserId = awardDto.UserId;
            award.AwardTitle = awardDto.AwardTitle ?? string.Empty;
            award.AwardDescription = awardDto.AwardDescription ?? string.Empty;
            award.DateAwarded = awardDto.DateAwarded;
            award.UpdatedAt = DateTime.Now;

            _context.Awards.Update(award);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Award updated successfully", award);
        }

        public async Task<CustomResult> DeleteAward(int id)
        {
            var award = await _context.Awards.FindAsync(id);
            if (award == null)
            {
                return new CustomResult(404, "Award not found", 00);
            }
            _context.Awards.Remove(award);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Award deleted successfully", 00);
        }

        public async Task<CustomResult> SearchAwards(string searchTerm, int pageNumber, int pageSize)
        {
            var awards = await _context.Awards
                .Where(a => (a.AwardTitle != null && a.AwardTitle.Contains(searchTerm)) || (a.AwardDescription != null && a.AwardDescription.Contains(searchTerm)))
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new CustomResult(200, "Awards retrieved successfully", awards);
        }
    }
}
