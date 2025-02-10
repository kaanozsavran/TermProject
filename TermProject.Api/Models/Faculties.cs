using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TermProject.Api.Models
{
    public class Faculties
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FacultyID { get; set; }
        public string FacultyName { get; set; }
        [ForeignKey("Universities")]
        public int UniversityID { get; set; }
    }
}
