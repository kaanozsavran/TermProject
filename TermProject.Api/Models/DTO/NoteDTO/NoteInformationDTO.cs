using System.ComponentModel.DataAnnotations;

namespace TermProject.Api.Models.DTO.NoteDTO
{
    public class NoteInformationDTO
    {
        [Required]
        public string Title { get; set; }

        public string? Description { get; set; }

        [Required]
        public IFormFile File { get; set; }

        [Required]
        public int CourseID { get; set; }

        public int UserID { get; set; } // Kullanıcı ID'si; bunu genellikle JWT token üzerinden alabilirsin

    }
}
