using Microsoft.EntityFrameworkCore;
using TermProject.Api.Data;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Services
{
    public class FacultyService : IFacultyService
    {
        private readonly NotelandDbContext _dbcontext;

        public FacultyService(NotelandDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public async Task<List<string>> GetAllFacultiesNames()
        {
            // Veritabanından fakülte isimlerini çekiyoruz
            var facultyNames = await _dbcontext.Faculties
                .Select(u => u.FacultyName) // Sadece fakülte isimlerini seçiyoruz
                .ToListAsync(); // Sonuçları liste olarak döndürüyoruz

            return facultyNames; // fakülte isimlerini döndürüyoruz        }
        }
    }
}

