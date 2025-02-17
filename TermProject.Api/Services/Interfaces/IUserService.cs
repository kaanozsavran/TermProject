using TermProject.Api.Models;
using TermProject.Api.Models.DTO.UserDTO;

namespace TermProject.Api.Services.Interfaces
{
    public interface IUserService
    {
        public Task<LoginResponseDTO> Login(LoginRequestDTO loginRequestDTO);
        public Task<Users> Register(RegisterRequestDTO registerRequestDTO);

    }
}
