using Microsoft.AspNetCore.Authorization;
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
        //[HttpPost("login")]
        //public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
        //{
        //    if (loginRequestDTO == null || string.IsNullOrEmpty(loginRequestDTO.Email) || string.IsNullOrEmpty(loginRequestDTO.Password))
        //    {
        //        return BadRequest("Geçersiz giriş bilgileri.");
        //    }

        //    var response = await _userService.Login(loginRequestDTO);

        //    if (response.APIUser == null)
        //    {
        //        return Unauthorized("Kullanıcı adı veya şifre hatalı.");
        //    }

        //    // Başarılı giriş sonrası kullanıcı bilgileri ve token döndürülüyor
        //    return Ok(new
        //    {
        //        User = response.APIUser,
        //        Message = "Giriş başarılı."
        //    });
        //}
        //[HttpGet("check-session")]
        //public IActionResult CheckSession()
        //{
        //    // Token cookie'sinin varlığını kontrol et
        //    if (Request.Cookies.ContainsKey("token"))
        //    {
        //        // Cookie mevcut
        //        return Ok(new { message = "Oturum aktif." });
        //    }
        //    else
        //    {
        //        // Cookie yok
        //        return Unauthorized(new { message = "Oturum kapalı." });
        //    }
        //}

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
            var userinfo = await _userService.GetUserById(userid);
            return Ok(userinfo);
        }
        [HttpPut]
        [Authorize]

        public async Task<IActionResult> UpdateUserInfo(int userid, [FromBody] UserUpdateInfoDTO userUpdateDTO)
        {
            await _userService.UpdateUserInfo(userid, userUpdateDTO);
            return Ok("Kullanıcı bilgileriniz başarıyla güncellendi!");
        }
        [HttpPost("{userId}/upload-profile-picture")]
        public async Task<IActionResult> UploadProfilePicture(int userId, [FromForm] UploadProfilePictureDto uploadProfilePictureDto)
        {
            if (uploadProfilePictureDto.ProfilePicture == null || uploadProfilePictureDto.ProfilePicture.Length == 0)
            {
                return BadRequest("Dosya yüklenemedi.");
            }

            // Servis üzerinden işlemi gerçekleştiriyoruz
            var result = await _userService.UploadProfilePictureAsync(userId, uploadProfilePictureDto.ProfilePicture);

            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            return Ok(result.Message);
        }
    }
}