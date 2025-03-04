using TermProject.Api.Models.DTO.DepartmentDTO;

namespace TermProject.Api.Services.Interfaces
{
    public interface IDepartmentService
    {
        public Task<List<DepartmentInformationDTO>> GetDepartmentsByFacultyId(int facultyId);
    }
}
