namespace TermProject.Api.Services.Interfaces
{
    public interface IFacultyService
    {
        public Task<List<string>> GetAllFacultiesNames();
    }
}
