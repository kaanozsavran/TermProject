namespace TermProject.Api.Models.DTO.NoteDTO
{
    public class NoteResponseDTO
    {
        public int NoteID { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string FilePath { get; set; }
        public DateTime UploadDate { get; set; }
    }
}
