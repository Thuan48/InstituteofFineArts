using demo.Dto;
using demo.Interfaces;
using demo.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExhibitionController : ControllerBase
    {
        private readonly IExhibitionRepo _exhibitionRepo;

        public ExhibitionController(IExhibitionRepo exhibitionRepo)
        {
            _exhibitionRepo = exhibitionRepo;
        }

        [HttpPost]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> AddExhibition([FromBody] ExhibitionDto exhibitionDto)
        {
            var result = await _exhibitionRepo.AddExhibition(exhibitionDto);
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
        public async Task<IActionResult> GetExhibitionById(int id)
        {
            var result = await _exhibitionRepo.GetExhibitionById(id);
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
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> UpdateExhibition(int id, [FromBody] ExhibitionDto exhibitionDto)
        {
            var result = await _exhibitionRepo.UpdateExhibition(id, exhibitionDto);
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
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> DeleteExhibition(int id)
        {
            var result = await _exhibitionRepo.DeleteExhibition(id);
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
        public async Task<IActionResult> SearchExhibitions([FromQuery] string searchTerm, [FromQuery] int pageNumber, [FromQuery] int pageSize)
        {
            var result = await _exhibitionRepo.SearchExhibitions(searchTerm, pageNumber, pageSize);
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
        public async Task<IActionResult> GetAllExhibitions([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _exhibitionRepo.GetAllExhibitions(pageNumber, pageSize);
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
