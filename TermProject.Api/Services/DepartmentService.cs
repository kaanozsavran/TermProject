using Microsoft.EntityFrameworkCore;
using TermProject.Api.Data;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly NotelandDbContext _dbcontext;

        public DepartmentService (NotelandDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public async Task<List<string>> GetDepartmentsByFacultyId(int facultyId)
        {
            var departments =await _dbcontext.Departments.Where(d=>d.FacultyID == facultyId).Select(d=>d.DepartmentName).ToListAsync();
            return departments;
        }
    }
}
