using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TermProject.Api.Models
{
    public class Users
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
        
        [ForeignKey("Universities")]
        public int UniversityID { get; set; }
        [ForeignKey("Faculties")]

        public int FacultyID { get; set; }
        [ForeignKey("Departments")]

        public int DepartmentID { get; set; }

        public string? ProfilePicturePath { get; set; }
        public bool KvkkAccepted { get; set; } 


    }
}
