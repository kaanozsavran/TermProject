using TermProject.Api.Models.DTO.CourseDTO;

namespace TermProject.Api.Services.Interfaces
{
    public interface ICourseService
    {
        public Task<List<CourseInformationDTO>> GetCourseList(int departmentId);
    }
}
