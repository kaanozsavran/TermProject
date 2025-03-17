namespace TermProject.Api.Models.DTO.NoteDTO
{
    public class NoteResponseDTO
    {
        public int NoteID { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string FilePath { get; set; }
        public DateTime UploadDate { get; set; }
        //public string UniversityName { get; set; }

        //public string FacultyName { get; set; }

        //public string DepartmentName { get; set; }
        //public string CourseName { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; } // Kullanıcı adı


    }
}
