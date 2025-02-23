using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticsService _statisticsService;

        public StatisticsController(IStatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }
        [HttpGet]
        public async Task<IActionResult> GetStatistics()
        {
            var statistics = await _statisticsService.GetStatisticsAsync();
            return Ok(statistics);
        }
    }
}
