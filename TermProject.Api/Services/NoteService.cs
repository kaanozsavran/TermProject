using Microsoft.EntityFrameworkCore;
using TermProject.Api.Data;
using TermProject.Api.Models;
using TermProject.Api.Models.DTO.NoteDTO;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Services
{
    public class NoteService : INoteService
    {
        private readonly NotelandDbContext _context;
        private readonly IWebHostEnvironment _env;

        public NoteService(NotelandDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<Notes> UploadNoteAsync(NoteInformationDTO noteDto, IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Dosya yüklenmedi!");

            string uploadPath = Path.Combine(_env.WebRootPath, "uploads");

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            string filePath = Path.Combine(uploadPath, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var note = new Notes
            {
                Title = noteDto.Title,
                Description = noteDto.Description,
                FilePath = file.FileName,
                CourseID = noteDto.CourseID,
                UserID = noteDto.UserID,
                UploadDate = DateTime.UtcNow
               
            };

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            return note;
        }

        public async Task<List<Notes>> GetNotesByCourseAsync(int courseId)
        {
            return await _context.Notes.Where(n => n.CourseID == courseId).ToListAsync();
        }

        public async Task<List<Notes>> GetNotesByUserAsync(int userId)
        {
            return await _context.Notes.Where(n => n.UserID == userId).ToListAsync();
        }

        public async Task<Notes?> GetNoteByIdAsync(int noteId)
        {
            return await _context.Notes.FirstOrDefaultAsync(n => n.NoteID == noteId);
        }
    }
}
