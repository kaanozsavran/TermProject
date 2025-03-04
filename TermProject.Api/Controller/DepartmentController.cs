using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TermProject.Api.Models;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;

        public DepartmentController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpGet("faculty/{facultyId}")] //faculty id'ya bağlı department çekebilmek için.

        public async Task<IActionResult> GetDepartmentsByFacultyId(int facultyId)
        {
            var departments = await _departmentService.GetDepartmentsByFacultyId(facultyId);
            return Ok(departments);
        }
    }
}

