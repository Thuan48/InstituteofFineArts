using demo.Dto;
using demo.Model;
using demo.Response;

namespace demo.Interfaces
{
  public interface IExhibitionSubmissionRepo
  {
    Task<CustomResult> GetAllExhibitionSubmissions(int pageNumber, int pageSize);
    Task<CustomResult> GetExhibitionSubmissionById(int id);
    Task<CustomResult> AddExhibitionSubmission(ExhibitionSubmissionDto exhibitionSubmissionDto);
    Task<CustomResult> UpdateExhibitionSubmission(int id, ExhibitionSubmissionDto exhibitionSubmissionDto);
    Task<CustomResult> DeleteExhibitionSubmission(int id);
    Task<CustomResult> SearchExhibitionSubmissions(string searchTerm, int pageNumber, int pageSize);
  }
}
