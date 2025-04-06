namespace TermProject.Api.Models.DTO.UserDTO
{
    public class UserInformationDTO
    {
        public string FullName {  get; set; }
        public string Email {  get; set; }
        public string UniversityName { get; set; }

        public string FacultyName { get; set; }

        public string DepartmentName { get; set; }


        public int DepartmentID { get; set; } // bunları da ekle
        public int FacultyID { get; set; }
        public int UniversityID { get; set; }


    }
}
