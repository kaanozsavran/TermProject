﻿using Microsoft.AspNetCore.Http;
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
    }
}
