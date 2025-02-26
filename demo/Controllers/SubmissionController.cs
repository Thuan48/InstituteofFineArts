using demo.Dto;
using demo.Interfaces;
using demo.Response;
using Microsoft.AspNetCore.Mvc;

namespace demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly ISubmissionRepo _submissionRepo;

        public SubmissionController(ISubmissionRepo submissionRepo)
        {
            _submissionRepo = submissionRepo;
        }

        [HttpPost]
        public async Task<IActionResult> AddSubmission([FromForm] SubmissionDto submissionDto)
        {
            try
            {
                var result = await _submissionRepo.AddSubmission(submissionDto);
                if (result.Status == 404)
                {
                    return NotFound(new { message = result.Message });
                }
                else if (result.Status == 400)
                {
                    return BadRequest(new { message = result.Message });
                }
                else
                {
                    return Ok(result.Data);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubmissionById(int id)
        {
            var result = await _submissionRepo.GetSubmissionById(id);
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
        public async Task<IActionResult> UpdateSubmission(int id, [FromBody] SubmissionDto submissionDto)
        {
            var result = await _submissionRepo.UpdateSubmission(id, submissionDto);
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
        public async Task<IActionResult> DeleteSubmission(int id)
        {
            var result = await _submissionRepo.DeleteSubmission(id);
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
        public async Task<IActionResult> SearchSubmissions([FromQuery] string searchTerm, [FromQuery] int pageNumber, [FromQuery] int pageSize)
        {
            var result = await _submissionRepo.SearchSubmissions(searchTerm, pageNumber, pageSize);
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
        public async Task<IActionResult> GetAllSubmissions()
        {
            var result = await _submissionRepo.GetAllSubmissions(1, 10); // Example values for pageNumber and pageSize
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

        // ...other actions...
    }
}
