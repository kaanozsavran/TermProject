using Microsoft.EntityFrameworkCore;
using TermProject.Api.Data;
using TermProject.Api.Models;
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
        public async Task<List<Faculties>> GetAllFacultiesNames()
        {
            return await _dbcontext.Faculties
           .Select(f => new Faculties { FacultyID = f.FacultyID, FacultyName = f.FacultyName })
           .ToListAsync();
        }
        public async Task<string> GetFacultyNameByIDAsync(int id)
        {
            var faculty = await _dbcontext.Faculties.FirstOrDefaultAsync(f => f.FacultyID == id);
            if (faculty != null)
            {
                return faculty.FacultyName;
            }
            else
            {
                throw new ArgumentException("Faculty ID is not found!", nameof(id));
            }
        }
    }
}

