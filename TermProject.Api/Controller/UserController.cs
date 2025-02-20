using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TermProject.Api.Models.DTO.UserDTO;
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

        [HttpPost("login")] //for login
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
        {
            var loginResponse = await _userService.Login(loginRequestDTO); // await ekleyin

            if (string.IsNullOrEmpty(loginResponse.Token))
            {
                return Unauthorized("Invalid credentials");
            }

            return Ok(loginResponse);
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerRequestDTO)
        {
            var user = await _userService.Register(registerRequestDTO);
            return Ok(user);
        }
        [HttpDelete]
        public async Task<IActionResult> DeleteUser(int id)
        {
             await _userService.DeleteAccount(id);
            return Ok("Hesabınız başarıyla silindi!");
        }
        [HttpGet]
        public async Task<IActionResult> GetUserInfo(int userid)
        {
           var userinfo =  await _userService.GetUserById(userid);
            return Ok(userinfo);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateUserInfo(int userid, [FromBody] UserUpdateInfoDTO userUpdateDTO)
        {
            await _userService.UpdateUserInfo(userid, userUpdateDTO);
            return Ok("Kullanıcı bilgileriniz başarıyla güncellendi!");
        }
    }
}
