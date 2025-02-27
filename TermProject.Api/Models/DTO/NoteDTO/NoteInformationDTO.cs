namespace TermProject.Api.Models.DTO.NoteDTO
{
    public class NoteInformationDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int CourseID { get; set; }
        public int UserID { get; set; }
        public IFormFile File { get; set; } // Dosya alanı eklendi

    }
}
