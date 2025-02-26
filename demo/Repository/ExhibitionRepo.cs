using demo.Dto;
using demo.Interfaces;
using demo.Model;
using demo.Response;
using Microsoft.EntityFrameworkCore;

namespace demo.Repository
{
    public class ExhibitionRepo : IExhibitionRepo
    {
        private readonly DatabaseContext _context;

        public ExhibitionRepo(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<CustomResult> GetAllExhibitions(int pageNumber, int pageSize)
        {
            var exhibitions = await _context.Exhibitions
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new CustomResult(200, "Exhibitions retrieved successfully", exhibitions);
        }

        public async Task<CustomResult> GetExhibitionById(int id)
        {
            var exhibition = await _context.Exhibitions.FindAsync(id);
            if (exhibition == null)
            {
                return new CustomResult(404, "Exhibition not found", 0);
            }
            return new CustomResult(200, "Exhibition retrieved successfully", exhibition);
        }

        public async Task<CustomResult> AddExhibition(ExhibitionDto exhibitionDto)
        {
            var exhibition = new Exhibitions
            {
                Name = exhibitionDto.Name,
                Date = exhibitionDto.Date,
                Description = exhibitionDto.Description,
                Status = exhibitionDto.Status ?? "Upcoming",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Exhibitions.Add(exhibition);
            await _context.SaveChangesAsync();
            return new CustomResult(201, "Exhibition added successfully", exhibition);
        }

        public async Task<CustomResult> UpdateExhibition(int id, ExhibitionDto exhibitionDto)
        {
            var exhibition = await _context.Exhibitions.FindAsync(id);
            if (exhibition == null)
            {
                return new CustomResult(404, "Exhibition not found", 0);
            }

            exhibition.Name = exhibitionDto.Name;
            exhibition.Date = exhibitionDto.Date;
            exhibition.Description = exhibitionDto.Description;
            exhibition.Status = exhibitionDto.Status;
            exhibition.UpdatedAt = DateTime.Now;

            _context.Exhibitions.Update(exhibition);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Exhibition updated successfully", exhibition);
        }

        public async Task<CustomResult> DeleteExhibition(int id)
        {
            var exhibition = await _context.Exhibitions.FindAsync(id);
            if (exhibition == null)
            {
                return new CustomResult(404, "Exhibition not found", 0);
            }
            _context.Exhibitions.Remove(exhibition);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Exhibition deleted successfully", 0);
        }

        public async Task<CustomResult> SearchExhibitions(string searchTerm, int pageNumber, int pageSize)
        {
            var exhibitions = await _context.Exhibitions
                .Where(e => (e.Name != null && e.Name.Contains(searchTerm)) || (e.Description != null && e.Description.Contains(searchTerm)))
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new CustomResult(200, "Exhibitions retrieved successfully", exhibitions);
        }
    }
}
