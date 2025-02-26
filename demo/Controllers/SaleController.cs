using demo.Dto;
using demo.Interfaces;
using demo.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private readonly ISaleRepo _saleRepo;

        public SaleController(ISaleRepo saleRepo)
        {
            _saleRepo = saleRepo;
        }

        [HttpPost]
        [Authorize(Roles = "MANAGER,STAFF,ADMIN")]
        public async Task<IActionResult> AddSale([FromBody] SaleDto saleDto)
        {
            var result = await _saleRepo.AddSale(saleDto);
            if (result.Status == 404)
            {
                return NotFound(result.Message);
            }
            else if (result.Status == 400)
            {
                return BadRequest(result.Message);
            }
            else
            {
                return Ok(result.Data);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSaleById(int id)
        {
            var result = await _saleRepo.GetSaleById(id);
            if (result.Status == 404)
            {
                return NotFound(result.Message);
            }
            else if (result.Status == 400)
            {
                return BadRequest(result.Message);
            }
            else
            {
                return Ok(result.Data);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "MANAGER,STAFF,ADMIN")]
        public async Task<IActionResult> UpdateSale(int id, [FromBody] SaleDto saleDto)
        {
            var result = await _saleRepo.UpdateSale(id, saleDto);
            if (result.Status == 404)
            {
                return NotFound(result.Message);
            }
            else if (result.Status == 400)
            {
                return BadRequest(result.Message);
            }
            else
            {
                return Ok(result.Data);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "MANAGER,STAFF,ADMIN")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            var result = await _saleRepo.DeleteSale(id);
            if (result.Status == 404)
            {
                return NotFound(result.Message);
            }
            else if (result.Status == 400)
            {
                return BadRequest(result.Message);
            }
            else
            {
                return Ok(result.Data);
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchSales([FromQuery] string searchTerm, [FromQuery] int pageNumber, [FromQuery] int pageSize)
        {
            var result = await _saleRepo.SearchSales(searchTerm, pageNumber, pageSize);
            if (result.Status == 404)
            {
                return NotFound(result.Message);
            }
            else if (result.Status == 400)
            {
                return BadRequest(result.Message);
            }
            else
            {
                return Ok(result.Data);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSales()
        {
            var result = await _saleRepo.GetAllSales(1, 10);
            if (result.Status == 404)
            {
                return NotFound(result.Message);
            }
            else if (result.Status == 400)
            {
                return BadRequest(result.Message);
            }
            else
            {
                return Ok(result.Data);
            }
        }

        // ...existing code...
    }
}
