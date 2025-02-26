using demo.Dto;
using demo.Model;
using demo.Response;

namespace demo.Interfaces
{
    public interface IExhibitionRepo
    {
        Task<CustomResult> GetAllExhibitions(int pageNumber, int pageSize);
        Task<CustomResult> GetExhibitionById(int id);
        Task<CustomResult> AddExhibition(ExhibitionDto exhibition);
        Task<CustomResult> UpdateExhibition(int id, ExhibitionDto exhibitionDto);
        Task<CustomResult> DeleteExhibition(int id);
        Task<CustomResult> SearchExhibitions(string searchTerm, int pageNumber, int pageSize);
    }
}
