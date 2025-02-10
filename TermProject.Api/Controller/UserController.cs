using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TermProject.Api.Models.DTO;
using TermProject.Api.Services;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestDTO loginRequestDTO)
        {

            var loginResponse = _userService.Login(loginRequestDTO);

            if (string.IsNullOrEmpty(loginResponse.Token))
            {
                return Unauthorized("Invalid credentials");
            }

            return Ok(loginResponse);
        }
    }
}
