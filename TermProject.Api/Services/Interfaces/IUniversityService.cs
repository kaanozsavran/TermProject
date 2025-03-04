using TermProject.Api.Models.DTO.UniversityDTO;

namespace TermProject.Api.Services.Interfaces
{
    public interface IUniversityService
    {
        public Task<List<UniversitiesInformationDTO>> GetAllUniversityNames(); //list
    }
}
