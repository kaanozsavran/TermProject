using Microsoft.EntityFrameworkCore;
using TermProject.Api.Data;
using TermProject.Api.Models.DTO.CourseDTO;
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

        public async Task<List<CourseInformationDTO>> GetCourseList(int departmentId)
        {
            var courses = await _dbcontext.Courses.Where(c => c.DepartmentID == departmentId).Select(c => new CourseInformationDTO 
            { CourseID = c.CourseID, CourseName = c.CourseName }).ToListAsync();

            return courses;
        }
    }
}
