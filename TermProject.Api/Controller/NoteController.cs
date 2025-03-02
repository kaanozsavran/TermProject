using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TermProject.Api.Models.DTO.NoteDTO;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly INoteService _noteService;

        public NoteController(INoteService noteService)
        {
            _noteService = noteService;
        }

        // Not ekleme işlemi
        [HttpPost("add-note")]
        public async Task<IActionResult> AddNote([FromForm] NoteInformationDTO createNoteDto)
        {
            // Dosya yüklenmediği durum kontrolü
            if (createNoteDto.File == null || createNoteDto.File.Length == 0)
            {
                return BadRequest("Dosya yüklenmedi.");
            }

            // Notu ve dosyayı veritabanına kaydetmek için service'i çağırıyoruz
            var result = await _noteService.AddNoteAsync(createNoteDto);

            if (!result)
            {
                return BadRequest("Not eklenirken bir hata oluştu.");
            }

            return Ok("Not başarıyla eklendi.");
        }
        [HttpGet("user-notes/{userId}")]
        public async Task<IActionResult> GetUserNotes(int userId)
        {
            var notes = await _noteService.GetUserNotesAsync(userId);

            if (notes == null || !notes.Any())
            {
                return NotFound("Kullanıcıya ait not bulunamadı.");
            }

            return Ok(notes);
        }

    }
}
