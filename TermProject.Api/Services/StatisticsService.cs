using Microsoft.EntityFrameworkCore;
using TermProject.Api.Data;
using TermProject.Api.Models.DTO.StatisticsDTO;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Services
{
    public class StatisticsService : IStatisticsService
    {
        private readonly NotelandDbContext _dbcontext;

        public StatisticsService(NotelandDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }


        public async Task<StatisticsInformationDTO> GetStatisticsAsync()
        {
            var statistics = new StatisticsInformationDTO
            {
                Universities = await _dbcontext.Universities.CountAsync(),
                Users = await _dbcontext.Users.CountAsync(),
                Notes = await _dbcontext.Notes.CountAsync()
            };

            return statistics;
        }
    }
}
