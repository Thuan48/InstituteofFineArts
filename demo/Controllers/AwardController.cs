using demo.Dto;
using demo.Interfaces;
using demo.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace demo.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AwardController : ControllerBase
  {
    private readonly IAwardRepo _awardRepo;

    public AwardController(IAwardRepo awardRepo)
    {
      _awardRepo = awardRepo;
    }

    [HttpPost]
    [Authorize(Roles = "MANAGER,STAFF,ADMIN")]
    public async Task<IActionResult> AddAward([FromBody] AwardDto awardDto)
    {
      var result = await _awardRepo.AddAward(awardDto);
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

    public async Task<IActionResult> GetAwardById(int id)
    {
      var result = await _awardRepo.GetAwardById(id);
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
    public async Task<IActionResult> UpdateAward(int id, [FromBody] AwardDto awardDto)
    {
      var result = await _awardRepo.UpdateAward(id, awardDto);
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
    public async Task<IActionResult> DeleteAward(int id)
    {
      var result = await _awardRepo.DeleteAward(id);
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
    public async Task<IActionResult> SearchAwards([FromQuery] string searchTerm, [FromQuery] int pageNumber, [FromQuery] int pageSize)
    {
      var result = await _awardRepo.SearchAwards(searchTerm, pageNumber, pageSize);
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
    public async Task<IActionResult> GetAllAwards()
    {
      var result = await _awardRepo.GetAllAwards(1, 10);
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
