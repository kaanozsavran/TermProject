using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TermProject.Api.Models.DTO.NoteDTO;
using TermProject.Api.Services;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly INoteService _noteService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public NoteController(INoteService noteService,
            IWebHostEnvironment webHostEnvironment)
        {
            _noteService = noteService;
            _webHostEnvironment = webHostEnvironment;
        }

        // Not ekleme işlemi
        [HttpPost("add-note")]
        public async Task<IActionResult> AddNote([FromForm] NoteInformationDTO createNoteDto)
        {
            try
            {
                var result = await _noteService.AddNoteAsync(createNoteDto);

                if (!result)
                {
                    return StatusCode(500, "Not veritabanına eklenemedi.");
                }

                return Ok("Not başarıyla eklendi.");
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest($"Eksik veri: {ex.ParamName}");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message); // PDF değilse veya boyut büyükse buradan yakalanır
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Bir hata oluştu: {ex.Message}");
            }
        }
        [HttpGet("user-notes/{userId}")]
        public async Task<IActionResult> GetUserNotes(int userId)
        {
            var notes = await _noteService.GetNotesByUserIdAsync(userId);

            if (notes == null || !notes.Any())
            {
                return NotFound("Kullanıcıya ait not bulunamadı.");
            }

            return Ok(notes);
        }
        // Ders ID'sine göre notları alma
        [HttpGet("course-notes/{courseId}")]
        public async Task<IActionResult> GetNotesByCourseId(int courseId)
        {
            var notes = await _noteService.GetNotesByCourseIdAsync(courseId);
            return Ok(notes); // Notları JSON formatında döndür
        }

        //notların önizleme çekim işlemleri icin
        [HttpGet("note-files")]
        public async Task<IActionResult> File(string filePath)
        {
            string path = Path.Join(_webHostEnvironment.WebRootPath, filePath);
            var file = PhysicalFile(path, "application/pdf");
            return file;
        }


        [HttpPut("{noteId}")]
        [Authorize]
        public async Task<IActionResult> UpdateNote(int noteId, [FromBody] NoteUpdateDTO updateDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var result = await _noteService.UpdateNoteAsync(noteId, userId, updateDto);

            if (!result)
                return NotFound(new { message = "Not bulunamadı veya bu not size ait değil." });

            return Ok(new { message = "Not başarıyla güncellendi." });
        }
    }
}
