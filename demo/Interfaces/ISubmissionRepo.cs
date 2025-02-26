using demo.Dto;
using demo.Model;
using demo.Response;

namespace demo.Interfaces
{
    public interface ISubmissionRepo
    {
        Task<CustomResult> GetAllSubmissions(int pageNumber, int pageSize);
        Task<CustomResult> GetSubmissionById(int id);
        Task<CustomResult> AddSubmission(SubmissionDto submissionDto);
        Task<CustomResult> UpdateSubmission(int id, SubmissionDto submissionDto);
        Task<CustomResult> DeleteSubmission(int id);
        Task<CustomResult> SearchSubmissions(string searchTerm, int pageNumber, int pageSize);
    }
}
