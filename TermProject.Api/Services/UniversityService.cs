using Microsoft.EntityFrameworkCore;
using TermProject.Api.Data;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Services
{
    public class UniversityService : IUniversityService
    {
        private readonly NotelandDbContext _dbcontext;

        public UniversityService(NotelandDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public async Task<List<string>> GetAllUniversityNames()
        {
            // Veritabanından üniversite isimlerini çekiyoruz
            var universityNames = await _dbcontext.Universities
                .Select(u => u.UniversityName) // Sadece üniversite isimlerini seçiyoruz
                .ToListAsync(); // Sonuçları liste olarak döndürüyoruz

            return universityNames; // Üniversite isimlerini döndürüyoruz
        }
    }
}
