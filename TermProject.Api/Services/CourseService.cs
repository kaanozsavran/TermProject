using Microsoft.EntityFrameworkCore;
using TermProject.Api.Data;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Services
{
    public class CourseService : ICourseService
    {
        private readonly NotelandDbContext _dbcontext;

        public CourseService (NotelandDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public async Task<List<string>> GetCourseList(int departmentId)
        {
            var courses = await _dbcontext.Courses.Where(c => c.DepartmentID == departmentId).Select(c => c.CourseName).ToListAsync();
            return courses;
        }
    }
}
