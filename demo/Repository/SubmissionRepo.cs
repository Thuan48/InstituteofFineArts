using demo.Dto;
using demo.Interfaces;
using demo.Model;
using demo.Response;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace demo.Repository
{
    public class SubmissionRepo : ISubmissionRepo
    {
        private readonly DatabaseContext _context;
        private readonly IWebHostEnvironment _env;

        public SubmissionRepo(DatabaseContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        private string GenerateUniqueName(string fileName)
        {
            return $"{Guid.NewGuid()}_{fileName}";
        }

        public async Task<CustomResult> GetAllSubmissions(int pageNumber, int pageSize)
        {
            var submissions = await _context.Submissions
                .Include(s => s.User)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new CustomResult(200, "Submissions retrieved successfully", submissions);
        }

        public async Task<CustomResult> GetSubmissionById(int id)
        {
            var submission = await _context.Submissions
                .Include(s => s.User) 
                .FirstOrDefaultAsync(s => s.CompetitionId == id);
            if (submission == null)
            {
                return new CustomResult(404, "Submission not found", 0);
            }
            return new CustomResult(200, "Submission retrieved successfully", submission);
        }

        public async Task<CustomResult> AddSubmission(SubmissionDto submissionDto)
        {
            var submission = new Submissions
            {
                UserId = submissionDto.UserId,
                CompetitionId = submissionDto.CompetitionId,
                Title = submissionDto.Title,
                Description = submissionDto.Description,
                SubmitDate = submissionDto.SubmitDate,
                Status = submissionDto.Status,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            if (submissionDto.UploadImage != null)
            {
                if (string.IsNullOrEmpty(_env.WebRootPath))
                {
                    throw new Exception("WebRootPath is not set");
                }

                var fileName = GenerateUniqueName(submissionDto.UploadImage.FileName);
                var uploadPath = Path.Combine(_env.WebRootPath, "images");
                Directory.CreateDirectory(uploadPath); // Ensure the directory exists
                var filePath = Path.Combine(uploadPath, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await submissionDto.UploadImage.CopyToAsync(fileStream);
                }

                submission.FilePath = fileName;
            }

            _context.Submissions.Add(submission);
            await _context.SaveChangesAsync();
            return new CustomResult(201, "Submission added successfully", submission);
        }

        public async Task<CustomResult> UpdateSubmission(int id, SubmissionDto submissionDto)
        {
            var submission = await _context.Submissions.FindAsync(id);
            if (submission == null)
            {
                return new CustomResult(404, "Submission not found", 0);
            }

            submission.UserId = submissionDto.UserId;
            submission.CompetitionId = submissionDto.CompetitionId;
            submission.Title = submissionDto.Title;
            submission.Description = submissionDto.Description;
            submission.SubmitDate = submissionDto.SubmitDate;
            submission.Status = submissionDto.Status;
            submission.UpdatedAt = DateTime.Now;

            if (submissionDto.UploadImage != null)
            {
                if (string.IsNullOrEmpty(_env.WebRootPath))
                {
                    throw new Exception("WebRootPath is not set");
                }

                var fileName = GenerateUniqueName(submissionDto.UploadImage.FileName);
                var uploadPath = Path.Combine(_env.WebRootPath, "images");
                Directory.CreateDirectory(uploadPath); // Ensure the directory exists
                var filePath = Path.Combine(uploadPath, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await submissionDto.UploadImage.CopyToAsync(fileStream);
                }

                submission.FilePath = fileName;
            }

            _context.Submissions.Update(submission);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Submission updated successfully", submission);
        }

        public async Task<CustomResult> DeleteSubmission(int id)
        {
            var submission = await _context.Submissions.FindAsync(id);
            if (submission == null)
            {
                return new CustomResult(404, "Submission not found", 0);
            }
            _context.Submissions.Remove(submission);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Submission deleted successfully", 0);
        }

        public async Task<CustomResult> SearchSubmissions(string searchTerm, int pageNumber, int pageSize)
        {
            var submissions = await _context.Submissions
                .Where(s => (s.Title != null && s.Title.Contains(searchTerm)) || (s.Description != null && s.Description.Contains(searchTerm)))
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new CustomResult(200, "Submissions retrieved successfully", submissions);
        }
    }
}
