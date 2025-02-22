using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UniversityController : ControllerBase
    {
        private readonly IUniversityService _universityService;

        public UniversityController(IUniversityService universityService)
        {
            _universityService = universityService;
        }
        [HttpGet]

        public async Task<IActionResult> GetAllUniversities() {

            var universities = await _universityService.GetAllUniversityNames();
            return Ok(universities);

        }
    }
}
