using TermProject.Api.Models.DTO.NoteDTO;

namespace TermProject.Api.Services.Interfaces
{
    public interface INoteService
    {
        public Task<bool> AddNoteAsync(NoteInformationDTO createNoteDto);
    }
}
