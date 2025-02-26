using demo.Dto;
using demo.Interfaces;
using demo.Model;
using demo.Response;
using Microsoft.EntityFrameworkCore;

namespace demo.Repository
{
    public class EvaluationRepo : IEvaluationRepo
    {
        private readonly DatabaseContext _context;

        public EvaluationRepo(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<CustomResult> GetAllEvaluations(int pageNumber, int pageSize)
        {
            var evaluations = await _context.Evaluations
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new CustomResult(200, "Evaluations retrieved successfully", evaluations);
        }

        public async Task<CustomResult> GetEvaluationById(int id)
        {
            var evaluation = await _context.Evaluations.FindAsync(id);
            if (evaluation == null)
            {
                return new CustomResult(404, "Evaluation not found", 00);
            }
            return new CustomResult(200, "Evaluation retrieved successfully", evaluation);
        }

        public async Task<CustomResult> AddEvaluation(EvaluationDto evaluationDto)
        {
            var evaluation = new Evaluations
            {
                SubmissionId = evaluationDto.SubmissionId,
                StaffId = evaluationDto.StaffId,
                Score = evaluationDto.Score,
                Remarks = evaluationDto.Remarks,
                EvaluationDate = evaluationDto.EvaluationDate,
                Status = string.IsNullOrEmpty(evaluationDto.Status) ? "Pending" : evaluationDto.Status, 
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Evaluations.Add(evaluation);
            await _context.SaveChangesAsync();
            return new CustomResult(201, "Evaluation added successfully", evaluation);
        }

        public async Task<CustomResult> UpdateEvaluation(int id, EvaluationDto evaluationDto)
        {
            var evaluation = await _context.Evaluations.FindAsync(id);
            if (evaluation == null)
            {
                return new CustomResult(404, "Evaluation not found", 0);
            }

            evaluation.SubmissionId = evaluationDto.SubmissionId;
            evaluation.StaffId = evaluationDto.StaffId;
            evaluation.Score = evaluationDto.Score;
            evaluation.Remarks = evaluationDto.Remarks;
            evaluation.EvaluationDate = evaluationDto.EvaluationDate;
            evaluation.Status = string.IsNullOrEmpty(evaluationDto.Status) ? evaluation.Status : evaluationDto.Status; // update status if provided
            evaluation.UpdatedAt = DateTime.Now;

            _context.Evaluations.Update(evaluation);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Evaluation updated successfully", evaluation);
        }

        public async Task<CustomResult> DeleteEvaluation(int id)
        {
            var evaluation = await _context.Evaluations.FindAsync(id);
            if (evaluation == null)
            {
                return new CustomResult(404, "Evaluation not found", 00);
            }
            _context.Evaluations.Remove(evaluation);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Evaluation deleted successfully", 00);
        }

        public async Task<CustomResult> SearchEvaluations(string searchTerm, int pageNumber, int pageSize)
        {
            var evaluations = await _context.Evaluations
                .Where(e => e.Remarks != null && e.Remarks.Contains(searchTerm))
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new CustomResult(200, "Evaluations retrieved successfully", evaluations);
        }
    }
}
