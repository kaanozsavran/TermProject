using System.ComponentModel.DataAnnotations.Schema;

namespace TermProject.Api.Models.DTO.UserDTO
{
    public class RegisterRequestDTO
    {
        public string FullName { get; set; }

        public string Email { get; set; }
        public string Password { get; set; }
        //public string UniversityName { get; set; }

        //public string FacultyName { get; set; }

        //public string DepartmentName { get; set; }
        public int UniversityId { get; set; }
        public int FacultyId { get; set; }
        public int DepartmentId { get; set; }
    }
}
