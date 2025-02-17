namespace TermProject.Api.Services.Interfaces
{
    public interface ICourseService
    {
        public Task<List<string>> GetCourseList(int departmentId);
    }
}
