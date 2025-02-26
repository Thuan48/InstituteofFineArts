using demo.Dto;
using demo.Model;
using demo.Response;

namespace demo.Interfaces
{
    public interface IEvaluationRepo
    {
        Task<CustomResult> GetAllEvaluations(int pageNumber, int pageSize);
        Task<CustomResult> GetEvaluationById(int id);
        Task<CustomResult> AddEvaluation(EvaluationDto evaluation);
        Task<CustomResult> UpdateEvaluation(int id, EvaluationDto evaluationDto);
        Task<CustomResult> DeleteEvaluation(int id);
        Task<CustomResult> SearchEvaluations(string searchTerm, int pageNumber, int pageSize);
    }
}
