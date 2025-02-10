using TermProject.Api.Models.DTO;

namespace TermProject.Api.Services.Interfaces
{
    public interface IUserService
    {
        public LoginResponseDTO Login(LoginRequestDTO loginRequestDTO);
    }
}
