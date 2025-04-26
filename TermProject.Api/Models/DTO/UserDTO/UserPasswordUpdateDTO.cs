namespace TermProject.Api.Models.DTO.UserDTO
{
    public class UserPasswordUpdateDTO
    {
        public string oldPassword { get; set; }
        public string newPassword { get; set; }
        public string newPasswordAgain { get; set; }

    }
}
