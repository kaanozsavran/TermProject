using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacultyController : ControllerBase
    {
        private readonly IFacultyService _facultyService;

        public FacultyController(IFacultyService facultyService)
        {
            _facultyService = facultyService;
        }

        [HttpGet]

        public async Task<IActionResult> GetAllFaculties()
        {
            var faculty = await _facultyService.GetAllFacultiesNames();
            return Ok(faculty);
        }
        [HttpGet("getFacultyName/${id}")]
        public async Task<IActionResult> GetFacultyName(int id)
        {
            var faculty = await _facultyService.GetFacultyNameByIDAsync(id);
            return Ok(faculty);
        }

    }
}
