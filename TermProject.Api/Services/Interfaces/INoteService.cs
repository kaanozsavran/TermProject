using TermProject.Api.Models;
using TermProject.Api.Models.DTO.NoteDTO;

namespace TermProject.Api.Services.Interfaces
{
    public interface INoteService
    {
        Task<Notes> UploadNoteAsync(NoteInformationDTO noteDto, IFormFile file);
        Task<List<Notes>> GetNotesByCourseAsync(int courseId);
        Task<List<Notes>> GetNotesByUserAsync(int userId);
        Task<Notes?> GetNoteByIdAsync(int noteId);
    }
}
