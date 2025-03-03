﻿using Microsoft.EntityFrameworkCore;
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
        public async Task<List<NoteResponseDTO>> GetNotesByCourseIdAsync(int courseId)
        {
            var notes = await _context.Notes
                .Where(n => n.CourseID == courseId)
                .Select(n => new NoteResponseDTO
                {
                    NoteID = n.NoteID,
                    Title = n.Title,
                    Description = n.Description,
                    FilePath = n.FilePath,
                    UploadDate = n.UploadDate,
                    CourseID = n.CourseID // Ders ID'si eklendi
                })
                .ToListAsync();

            return notes;
        }
    }
}
