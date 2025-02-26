using demo.Dto;
using demo.Model;
using demo.Response;

namespace demo.Interfaces
{
    public interface IAwardRepo
    {
        Task<CustomResult> GetAllAwards(int pageNumber, int pageSize);
        Task<CustomResult> GetAwardById(int id);
        Task<CustomResult> AddAward(AwardDto award);
        Task<CustomResult> UpdateAward(int id, AwardDto awardDto);
        Task<CustomResult> DeleteAward(int id);
        Task<CustomResult> SearchAwards(string searchTerm, int pageNumber, int pageSize);
    }
}
