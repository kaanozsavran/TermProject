using Microsoft.EntityFrameworkCore;
using System;
using TermProject.Api.Data;
using TermProject.Api.Models;
using TermProject.Api.Models.DTO.NoteDTO;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Services
{
    public class NoteService :INoteService
    {
        private readonly NotelandDbContext _context;
        private readonly IWebHostEnvironment _environment;


        public NoteService(NotelandDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;

        }

        public async Task<bool> AddNoteAsync(NoteInformationDTO createNoteDto)
        {
            if (createNoteDto == null)
            {
                throw new ArgumentNullException(nameof(createNoteDto));
            }

            if (createNoteDto.File == null)
            {
                throw new ArgumentNullException(nameof(createNoteDto.File));
            }

            // Kullanıcının not dosyasını kaydedeceğimiz dizin
            var directoryPath = Path.Combine(_environment.WebRootPath, "files", "notes");

            // Eğer dizin yoksa oluştur
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            // Dosya adı oluştur (Örn: 12_xxxx.pdf)
            var fileName = $"{createNoteDto.UserID}_{Guid.NewGuid()}{Path.GetExtension(createNoteDto.File.FileName)}";
            var filePath = Path.Combine(directoryPath, fileName);

            // Dosya kaydetme işlemi
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await createNoteDto.File.CopyToAsync(stream);
            }

            // Not nesnesi oluştur
            var note = new Notes
            {
                Title = createNoteDto.Title,
                Description = createNoteDto.Description,
                FilePath = $"/files/notes/{fileName}", // Frontend erişebilsin diye düzelttik
                CourseID = createNoteDto.CourseID,
                UserID = createNoteDto.UserID,
                UploadDate = DateTime.Now
            };

            // Veritabanına kaydet
            _context.Notes.Add(note);
            var result = await _context.SaveChangesAsync();

            return result > 0;

        }
        public async Task<List<NoteResponseDTO>> GetUserNotesAsync(int userId)
        {
            var notes = await _context.Notes
                .Where(n => n.UserID == userId)
                .Select(n => new NoteResponseDTO
                {
                    NoteID = n.NoteID,
                    Title = n.Title,
                    Description = n.Description,
                    FilePath = n.FilePath,
                    UploadDate = n.UploadDate
                })
                .ToListAsync();

            return notes;
        }

    }
}
