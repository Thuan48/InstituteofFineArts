using demo.Dto;
using demo.Model;
using demo.Response;

namespace demo.Interfaces
{
    public interface ISaleRepo
    {
        Task<CustomResult> GetAllSales(int pageNumber, int pageSize);
        Task<CustomResult> GetSaleById(int id);
        Task<CustomResult> AddSale(SaleDto sale);
        Task<CustomResult> UpdateSale(int id, SaleDto saleDto);
        Task<CustomResult> DeleteSale(int id);
        Task<CustomResult> SearchSales(string searchTerm, int pageNumber, int pageSize);
    }
}
