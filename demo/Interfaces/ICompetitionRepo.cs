using demo.Dto;
using demo.Model;
using demo.Response;

namespace demo.Interfaces
{
    public interface ICompetitionRepo
    {
        Task<CustomResult> GetAllCompetitions(int pageNumber, int pageSize);
        Task<CustomResult> GetCompetitionById(int id);
        Task<CustomResult> AddCompetition(CompetitionDto competition);
        Task<CustomResult> UpdateCompetition(int id, CompetitionDto competitionDto);
        Task<CustomResult> DeleteCompetition(int id);
        Task<CustomResult> SearchCompetitions(string searchTerm, int pageNumber, int pageSize);
        Task<CustomResult> UpdateCompetitionStatus(int id, string status);
    }
}
