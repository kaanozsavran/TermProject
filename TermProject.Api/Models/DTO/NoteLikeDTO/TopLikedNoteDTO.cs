namespace TermProject.Api.Models.DTO.NoteLikeDTO
{
    public class TopLikedNoteDTO
    {
        public string Title { get; set; }
        public int LikeCount { get; set; }
        public string FullName { get; set; }
        public string ProfileImage { get; set; }
        public string FilePath { get; set; }  
        public DateTime UploadDate { get; set; } 
    }
}
