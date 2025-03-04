using Microsoft.EntityFrameworkCore;
using TermProject.Api.Data;
using TermProject.Api.Models.DTO.UniversityDTO;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Services
{
    public class UniversityService : IUniversityService
    {
        private readonly NotelandDbContext _dbcontext;

        public UniversityService(NotelandDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public async Task<List<UniversitiesInformationDTO>> GetAllUniversityNames()
        {
            return await _dbcontext.Universities
                .Select(u => new UniversitiesInformationDTO
                {
                    UniversityId = u.UniversityID,
                    UniversityName = u.UniversityName
                })
                .ToListAsync();
        }
    }
}
