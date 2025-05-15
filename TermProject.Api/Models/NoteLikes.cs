using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TermProject.Api.Models
{
    public class NoteLikes
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LikeID { get; set; }

        [ForeignKey("Notes")]
        public int NoteID { get; set; }

        [ForeignKey("Users")]
        public int UserID { get; set; }

        public DateTime LikedAt { get; set; } = DateTime.UtcNow;

        public Notes Note { get; set; }
        public Users User { get; set; }
    }
}
