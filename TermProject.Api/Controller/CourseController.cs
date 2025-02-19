using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }
        [HttpGet("department/{departmentId}")] //Department id'ya bağlı dersleri çekebilmek için.
        public async Task<IActionResult> GetCourseList(int departmantId) 
        {
            var courses = await _courseService.GetCourseList(departmantId);
            if (courses == null || !courses.Any()) { 
                return NotFound("Bu bölüme ait ders bulunamadı.");
            }
            return Ok(courses);
        }
    }
}
