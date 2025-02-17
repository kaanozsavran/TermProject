namespace TermProject.Api.Models.DTO.UserDTO
{
    public class LoginResponseDTO
    {
        public Users APIUser { get; set; }
        public string Token { get; set; }
    }
}
