using TermProject.Api.Models;

namespace TermProject.Api.Services.Interfaces
{
    public interface IFacultyService
    {
        public Task<List<Faculties>> GetAllFacultiesNames();
        public Task<string> GetFacultyNameByIDAsync(int id);
    }
}
