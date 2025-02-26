using demo.Dto;
using demo.Interfaces;
using demo.Model;
using demo.Response;
using Microsoft.EntityFrameworkCore;

namespace demo.Repository
{
    public class SaleRepo : ISaleRepo
    {
        private readonly DatabaseContext _context;

        public SaleRepo(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<CustomResult> GetAllSales(int pageNumber, int pageSize)
        {
            var sales = await _context.Sales
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new CustomResult(200, "Sales retrieved successfully", sales);
        }

        public async Task<CustomResult> GetSaleById(int id)
        {
            var sale = await _context.Sales.FindAsync(id);
            if (sale == null)
            {
                return new CustomResult(404, "Sale not found", 0);
            }
            return new CustomResult(200, "Sale retrieved successfully", sale);
        }

        public async Task<CustomResult> AddSale(SaleDto saleDto)
        {
            var sale = new Sales
            {
                ExhibitionSubmissionId = saleDto.ExhibitionSubmissionId,
                Buyer = saleDto.Buyer,
                SoldPrice = saleDto.SoldPrice,
                SoldDate = saleDto.SoldDate,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();
            return new CustomResult(201, "Sale added successfully", sale);
        }

        public async Task<CustomResult> UpdateSale(int id, SaleDto saleDto)
        {
            var sale = await _context.Sales.FindAsync(id);
            if (sale == null)
            {
                return new CustomResult(404, "Sale not found", 0);
            }

            sale.ExhibitionSubmissionId = saleDto.ExhibitionSubmissionId;
            sale.Buyer = saleDto.Buyer;
            sale.SoldPrice = saleDto.SoldPrice;
            sale.SoldDate = saleDto.SoldDate;
            sale.UpdatedAt = DateTime.Now;

            _context.Sales.Update(sale);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Sale updated successfully", sale);
        }

        public async Task<CustomResult> DeleteSale(int id)
        {
            var sale = await _context.Sales.FindAsync(id);
            if (sale == null)
            {
                return new CustomResult(404, "Sale not found", 0);
            }
            _context.Sales.Remove(sale);
            await _context.SaveChangesAsync();
            return new CustomResult(200, "Sale deleted successfully", 0);
        }

        public async Task<CustomResult> SearchSales(string searchTerm, int pageNumber, int pageSize)
        {
            var sales = await _context.Sales
                .Where(s => s.Buyer != null && s.Buyer.Contains(searchTerm))
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new CustomResult(200, "Sales retrieved successfully", sales);
        }
    }
}
