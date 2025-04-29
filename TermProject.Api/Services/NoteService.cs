using Microsoft.EntityFrameworkCore;
using System;
using TermProject.Api.Data;
using TermProject.Api.Models;
using TermProject.Api.Models.DTO.NoteDTO;
using TermProject.Api.Models.DTO.UserDTO;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Services
{
    public class NoteService : INoteService 
    {
        private readonly NotelandDbContext _context;
        private readonly IWebHostEnvironment _environment;


        public NoteService(NotelandDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;

        }
        //not ekleme servisi.
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

            // 1. Dosya türü kontrolü
            var allowedExtensions = new[] { ".pdf" };
            var extension = Path.GetExtension(createNoteDto.File.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
            {
                throw new InvalidOperationException("Sadece PDF dosyaları kabul edilir.");
            }

            // 2. Dosya boyutu kontrolü (örn. maksimum 10 MB)
            if (createNoteDto.File.Length > 10 * 1024 * 1024)
            {
                throw new InvalidOperationException("Dosya boyutu çok büyük. Maksimum 10 MB olabilir.");
            }

            // 3. Dosya yolu oluşturma
            var directoryPath = Path.Combine(_environment.WebRootPath, "files", "notes");

            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            var fileName = $"{createNoteDto.UserID}_{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(directoryPath, fileName);

            // LOG
            Console.WriteLine($"Dosya şu dizine kaydediliyor: {filePath}");
            Console.WriteLine($"_environment.WebRootPath: {_environment.WebRootPath}");

            // 4. Dosyayı fiziksel olarak kaydetme
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await createNoteDto.File.CopyToAsync(stream);
            }

            // 5. Note nesnesini oluşturup veritabanına ekle
            var note = new Notes
            {
                Title = createNoteDto.Title,
                Description = createNoteDto.Description,
                FilePath = $"/files/notes/{fileName}",
                CourseID = createNoteDto.CourseID,
                UserID = createNoteDto.UserID,
                UploadDate = DateTime.Now
            };

            _context.Notes.Add(note);
            var result = await _context.SaveChangesAsync();

            return result > 0;

        }

        public async Task<int> GetUniversityIDByNameAsync(string name)
        {
            var university = await _context.Universities.FirstOrDefaultAsync(u => u.UniversityName == name);
            if (university != null)
            {
                return university.UniversityID;
            }
            else
            {
                throw new ArgumentException("University name is not found!", nameof(name));
            }
        }

        public async Task<int> GetFacultyIDByNameAsync(string name)
        {
            var faculty = await _context.Faculties.FirstOrDefaultAsync(u => u.FacultyName == name);
            if (faculty != null)
            {
                return faculty.FacultyID;
            }
            else
            {
                throw new ArgumentException("Faculty is not found!", nameof(name));
            }
        }

        public async Task<int> GetDepartmentIDByNameAsync(string name)
        {
            var department = await _context.Departments.FirstOrDefaultAsync(u => u.DepartmentName == name);
            if (department != null)
            {
                return department.DepartmentID; // Bu satırı düzeltmek gerekti.
            }
            else
            {
                throw new ArgumentException("Department is not found!", nameof(name));
            }
        }
        public async Task<int> GetCourseIDByNameAsync(string name)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(u => u.CourseName == name);
            if (course != null)
            {
                return course.CourseID; // Bu satırı düzeltmek gerekti.
            }
            else
            {
                throw new ArgumentException("Department is not found!", nameof(name));
            }
        }

        public async Task<List<NoteGetInformationDTO>> GetNotesByUserIdAsync(int userId)
        {
            var notes = await _context.Notes
        .Where(n => n.UserID == userId)
        .ToListAsync();

            var noteDTOs = new List<NoteGetInformationDTO>();

            foreach (var note in notes)
            {
                var courseName = await GetCourseNameByIDAsync(note.CourseID);

                noteDTOs.Add(new NoteGetInformationDTO
                {
                    NoteID = note.NoteID,
                    Title = note.Title,
                    Description = note.Description,
                    FilePath = note.FilePath,
                    UploadDate = note.UploadDate,
                    CourseName = courseName
                });
            }

            return noteDTOs;
        }

        public async Task<List<NoteResponseDTO>> GetNotesByCourseIdAsync(int courseId)
        {
            
            // Belirtilen courseId ile notları bul
            var notes = await _context.Notes
                .Where(n => n.CourseID == courseId)
                .Select(n => new NoteResponseDTO
                {
                    NoteID = n.NoteID,
                    Title = n.Title,
                    Description = n.Description,
                    FilePath = n.FilePath,
                    UploadDate = n.UploadDate,

                })
                .ToListAsync();
           

            return notes; // List<NoteResponseDTO> döndür
        }
        public async Task<string> GetCourseNameByIDAsync(int courseId)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(c => c.CourseID == courseId);
            if (course != null)
            {
                return course.CourseName;
            }
            else
            {
                throw new ArgumentException("Course ID is not found!", nameof(courseId));
            }
        }

    }
}
