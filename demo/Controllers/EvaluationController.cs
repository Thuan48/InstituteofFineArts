using demo.Dto;
using demo.Interfaces;
using demo.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EvaluationController : ControllerBase
    {
        private readonly IEvaluationRepo _evaluationRepo;

        public EvaluationController(IEvaluationRepo evaluationRepo)
        {
            _evaluationRepo = evaluationRepo;
        }

        [HttpPost]
        [Authorize(Roles = "MANAGER,STAFF,ADMIN")]
        public async Task<IActionResult> AddEvaluation([FromBody] EvaluationDto evaluationDto)
        {
            var result = await _evaluationRepo.AddEvaluation(evaluationDto);
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
        public async Task<IActionResult> GetEvaluationById(int id)
        {
            var result = await _evaluationRepo.GetEvaluationById(id);
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
        public async Task<IActionResult> UpdateEvaluation(int id, [FromBody] EvaluationDto evaluationDto)
        {
            var result = await _evaluationRepo.UpdateEvaluation(id, evaluationDto);
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
        public async Task<IActionResult> DeleteEvaluation(int id)
        {
            var result = await _evaluationRepo.DeleteEvaluation(id);
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
        public async Task<IActionResult> SearchEvaluations([FromQuery] string searchTerm, [FromQuery] int pageNumber, [FromQuery] int pageSize)
        {
            var result = await _evaluationRepo.SearchEvaluations(searchTerm, pageNumber, pageSize);
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
        public async Task<IActionResult> GetAllEvaluations()
        {
            var result = await _evaluationRepo.GetAllEvaluations(1, 10);
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
