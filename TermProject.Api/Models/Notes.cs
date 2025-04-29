using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TermProject.Api.Models
{
    public class Notes
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int NoteID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string FilePath { get; set; }
        [ForeignKey("Courses")]
        public int CourseID { get; set; } 
        public DateTime UploadDate { get; set; }
        [ForeignKey("Users")]
        public int UserID { get; set; }
       
    }
}
