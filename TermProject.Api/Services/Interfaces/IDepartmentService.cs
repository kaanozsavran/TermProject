namespace TermProject.Api.Services.Interfaces
{
    public interface IDepartmentService
    {
        public Task<List<string>> GetDepartmentsByFacultyId(int facultyId);
    }
}
