namespace TermProject.Api.Models.DTO.NoteDTO
{
    public class NoteGetInformationDTO
    {
        public int NoteID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string FilePath { get; set; }
        public DateTime UploadDate { get; set; }
        public string CourseName { get; set; }
        //public string DepartmentName { get; set; }
        //public string FacultyName { get; set; }
        //public string UniversityName { get; set; }
        public int LikeCount { get; set; } // Yeni eklenen alan

    }
}
