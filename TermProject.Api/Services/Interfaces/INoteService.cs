using TermProject.Api.Models.DTO.NoteDTO;

namespace TermProject.Api.Services.Interfaces
{
    public interface INoteService
    {
        public Task<bool> AddNoteAsync(NoteInformationDTO createNoteDto);
        Task<List<NoteGetInformationDTO>> GetNotesByUserIdAsync(int userId); // Kullanıcıya ait notları getir
        Task<List<NoteResponseDTO>> GetNotesByCourseIdAsync(int courseId); // Ders ID'sine göre notları getir

        Task<bool> UpdateNoteAsync(int noteId, int userId, NoteUpdateDTO updateDto);


    }
}
