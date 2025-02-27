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

        [HttpPost("upload")]
        public async Task<IActionResult> UploadNote([FromForm] NoteInformationDTO noteDto, [FromForm] IFormFile file)
        {
            if (noteDto.File == null || noteDto.File.Length == 0)
                return BadRequest(new { Message = "Lütfen bir dosya yükleyin!" });

            var note = await _noteService.UploadNoteAsync(noteDto, noteDto.File);
            return Ok(new { Message = "Dosya başarıyla yüklendi!", NoteId = note.NoteID });
        }

        [HttpGet("by-course/{courseId}")]
        public async Task<IActionResult> GetNotesByCourse(int courseId)
        {
            var notes = await _noteService.GetNotesByCourseAsync(courseId);
            return Ok(notes);
        }

        [HttpGet("by-user/{userId}")]
        public async Task<IActionResult> GetNotesByUser(int userId)
        {
            var notes = await _noteService.GetNotesByUserAsync(userId);
            return Ok(notes);
        }

        [HttpGet("{noteId}")]
        public async Task<IActionResult> GetNoteById(int noteId)
        {
            var note = await _noteService.GetNoteByIdAsync(noteId);
            if (note == null)
                return NotFound(new { Message = "Not bulunamadı!" });

            return Ok(note);
        }
    }
}
