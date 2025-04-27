using TermProject.Api.Models;
using TermProject.Api.Models.DTO.UserDTO;

namespace TermProject.Api.Services.Interfaces
{
    public interface IUserService
    {
        public Task<LoginResponseDTO> Login(LoginRequestDTO loginRequestDTO);
        public Task<Users> Register(RegisterRequestDTO registerRequestDTO);
        public Task DeleteAccount(int id);

        public Task<UserInformationDTO> GetUserById(int userid);
        public Task UpdateUserInfo(int userid, UserUpdateInfoDTO dto);
        public Task<(bool Success, string Message)> UploadProfilePictureAsync(int userId, IFormFile profilePicture);
        public Task UpdateUserPassword(int userid, UserPasswordUpdateDTO userPasswordUpdateDTO);
        Task<UserInformationProfileDTO> GetUserInformationAsync(int userId);

    }
}
