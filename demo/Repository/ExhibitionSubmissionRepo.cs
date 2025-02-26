using demo.Dto;
using demo.Interfaces;
using demo.Model;
using demo.Response;
using Microsoft.EntityFrameworkCore;

namespace demo.Repository
{
    public class ExhibitionSubmissionRepo : IExhibitionSubmissionRepo
    {
        private readonly DatabaseContext _context;

        public ExhibitionSubmissionRepo(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<CustomResult> GetAllExhibitionSubmissions(int pageNumber, int pageSize)
        {
            var exhibitionSubmissions = await _context.ExhibitionSubmissions
                .Include(es => es.Exhibition)
                .Include(es => es.Submission)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new CustomResult(200, "Exhibition submissions retrieved successfully", exhibitionSubmissions);
        }

        public async Task<CustomResult> GetExhibitionSubmissionById(int id)
        {
            var exhibitionSubmission = await _context.ExhibitionSubmissions
                .Include(es => es.Exhibition)
                .Include(es => es.Submission)
                .FirstOrDefaultAsync(es => es.ExhibitionSubmissionId == id);
            if (exhibitionSubmission == null)
            {
                return new CustomResult(404, "Exhibition submission not found", 0);
            }
            return new CustomResult(200, "Exhibition submission retrieved successfully", exhibitionSubmission);
        }

        public async Task<CustomResult> AddExhibitionSubmission(ExhibitionSubmissionDto exhibitionSubmissionDto)
        {
            var exhibition = await _context.Exhibitions.FindAsync(exhibitionSubmissionDto.ExhibitionId);
            if (exhibition == null)
            {
                return new CustomResult(404, "Exhibition not found", 0);
            }

            var submission = await _context.Submissions.FindAsync(exhibitionSubmissionDto.SubmissionId);
            if (submission == null)
            {
                return new CustomResult(404, "Submission not found", 0);
            }

            var exhibitionSubmission = new ExhibitionSubmissions
            {
                ExhibitionId = exhibitionSubmissionDto.ExhibitionId,
                SubmissionId = exhibitionSubmissionDto.SubmissionId,
                Price = exhibitionSubmissionDto.Price,
                Status = exhibitionSubmissionDto.Status,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.ExhibitionSubmissions.Add(exhibitionSubmission);
            await _context.SaveChangesAsync();
            return new CustomResult(201, "Exhibition submission added successfully", exhibitionSubmission);
        }

        public async Task<CustomResult> UpdateExhibitionSubmission(int id, ExhibitionSubmissionDto exhibitionSubmissionDto)
        {
            var exhibitionSubmission = await _context.ExhibitionSubmissions.FindAsync(id);
            if (exhibitionSubmission == null)
            {
                return new CustomResult(404, "Exhibition submission not found", 0);
            }

            exhibitionSubmission.ExhibitionId = exhibitionSubmissionDto.ExhibitionId;
            exhibitionSubmission.SubmissionId = exhibitionSubmissionDto.SubmissionId;
            exhibitionSubmission.Price = exhibitionSubmissionDto.Price;
            exhibitionSubmission.Status = exhibitionSubmissionDto.Status;
            exhibitionSubmission.UpdatedAt = DateTime.Now;

            _context.ExhibitionSubmissions.Update(exhibitionSubmission);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Exhibition submission updated successfully", exhibitionSubmission);
        }

        public async Task<CustomResult> DeleteExhibitionSubmission(int id)
        {
            var exhibitionSubmission = await _context.ExhibitionSubmissions.FindAsync(id);
            if (exhibitionSubmission == null)
            {
                return new CustomResult(404, "Exhibition submission not found", 0);
            }
            _context.ExhibitionSubmissions.Remove(exhibitionSubmission);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Exhibition submission deleted successfully", 0);
        }

        public async Task<CustomResult> SearchExhibitionSubmissions(string searchTerm, int pageNumber, int pageSize)
        {
            var exhibitionSubmissions = await _context.ExhibitionSubmissions
                .Include(es => es.Exhibition)
                .Include(es => es.Submission)
                .Where(es => (es.Exhibition != null && es.Exhibition.Name != null && es.Exhibition.Name.Contains(searchTerm)) || (es.Submission != null && es.Submission.Title != null && es.Submission.Title.Contains(searchTerm)))
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new CustomResult(200, "Exhibition submissions retrieved successfully", exhibitionSubmissions);
        }
    }
}
