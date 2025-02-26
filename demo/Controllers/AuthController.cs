using demo.Dto;
using demo.Interfaces;
using demo.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepo _authRepo;

        public AuthController(IAuthRepo authRepo)
        {
            _authRepo = authRepo;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login userLogin)
        {
            var result = await _authRepo.Login(userLogin);
            if (result.Status == 200)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromBody] string token)
        {
            var result = await _authRepo.Logout(token);
            if (result.Status == 200)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Register userRegister)
        {
            var result = await _authRepo.Register(userRegister);
            if (result.Status == 200)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var result = await _authRepo.GetUserById(id);
            if (result.Status == 200)
            {
                return Ok(result);
            }
            return NotFound(result);
        }
    }
}
