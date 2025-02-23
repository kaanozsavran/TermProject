using TermProject.Api.Models.DTO.StatisticsDTO;

namespace TermProject.Api.Services.Interfaces
{
    public interface IStatisticsService
    {
        Task<StatisticsInformationDTO> GetStatisticsAsync();
    }
}
