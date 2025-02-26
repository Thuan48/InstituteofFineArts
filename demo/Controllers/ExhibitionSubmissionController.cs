using demo.Dto;
using demo.Interfaces;
using demo.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace demo.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ExhibitionSubmissionController : ControllerBase
  {
    private readonly IExhibitionSubmissionRepo _exhibitionSubmissionRepo;

    public ExhibitionSubmissionController(IExhibitionSubmissionRepo exhibitionSubmissionRepo)
    {
      _exhibitionSubmissionRepo = exhibitionSubmissionRepo;
    }

    [HttpPost]
    [Authorize(Roles = "MANAGER,ADMIN")]
    public async Task<IActionResult> AddExhibitionSubmission([FromBody] ExhibitionSubmissionDto exhibitionSubmissionDto)
    {
      var result = await _exhibitionSubmissionRepo.AddExhibitionSubmission(exhibitionSubmissionDto);
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
    public async Task<IActionResult> GetExhibitionSubmissionById(int id)
    {
      var result = await _exhibitionSubmissionRepo.GetExhibitionSubmissionById(id);
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
    public async Task<IActionResult> UpdateExhibitionSubmission(int id, [FromBody] ExhibitionSubmissionDto exhibitionSubmissionDto)
    {
      var result = await _exhibitionSubmissionRepo.UpdateExhibitionSubmission(id, exhibitionSubmissionDto);
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
    public async Task<IActionResult> DeleteExhibitionSubmission(int id)
    {
      var result = await _exhibitionSubmissionRepo.DeleteExhibitionSubmission(id);
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
    public async Task<IActionResult> SearchExhibitionSubmissions([FromQuery] string searchTerm, [FromQuery] int pageNumber, [FromQuery] int pageSize)
    {
      var result = await _exhibitionSubmissionRepo.SearchExhibitionSubmissions(searchTerm, pageNumber, pageSize);
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
    public async Task<IActionResult> GetAllExhibitionSubmissions()
    {
      var result = await _exhibitionSubmissionRepo.GetAllExhibitionSubmissions(1, 10);
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
