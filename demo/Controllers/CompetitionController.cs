using demo.Dto;
using demo.Interfaces;
using demo.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompetitionController : ControllerBase
    {
        private readonly ICompetitionRepo _competitionRepo;

        public CompetitionController(ICompetitionRepo competitionRepo)
        {
            _competitionRepo = competitionRepo;
        }

        [HttpPost]
        [Authorize(Roles = "MANAGER,STAFF,ADMIN")]
        public async Task<IActionResult> AddCompetition([FromForm] CompetitionDto competitionDto)
        {
            var result = await _competitionRepo.AddCompetition(competitionDto);
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
        public async Task<IActionResult> GetCompetitionById(int id)
        {
            var result = await _competitionRepo.GetCompetitionById(id);
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
        public async Task<IActionResult> UpdateCompetition(int id, [FromForm] CompetitionDto competitionDto)
        {
            var result = await _competitionRepo.UpdateCompetition(id, competitionDto);
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
        public async Task<IActionResult> DeleteCompetition(int id)
        {
            var result = await _competitionRepo.DeleteCompetition(id);
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
        public async Task<IActionResult> SearchCompetitions([FromQuery] string searchTerm, [FromQuery] int pageNumber, [FromQuery] int pageSize)
        {
            var result = await _competitionRepo.SearchCompetitions(searchTerm, pageNumber, pageSize);
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
        public async Task<IActionResult> GetAllCompetitions([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 6)
        {
            var result = await _competitionRepo.GetAllCompetitions(pageNumber, pageSize);
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

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "MANAGER,STAFF,ADMIN")]
        public async Task<IActionResult> UpdateCompetitionStatus(int id, [FromQuery] string status)
        {
            var result = await _competitionRepo.UpdateCompetitionStatus(id, status);
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
    }
}
