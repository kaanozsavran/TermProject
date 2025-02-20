namespace TermProject.Api.Models.DTO.UserDTO
{
    public class UserUpdateInfoDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PasswordAgain { get; set; }
        public string UniversityName { get; set; }
        public string FacultyName { get; set; }

        public string DepartmentName { get; set; }
    }
}
