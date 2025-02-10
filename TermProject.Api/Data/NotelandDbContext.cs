using Microsoft.EntityFrameworkCore;
using System.Net.Sockets;
using TermProject.Api.Models;

namespace TermProject.Api.Data
{
    public class NotelandDbContext : DbContext
    {
        public NotelandDbContext(DbContextOptions<NotelandDbContext> options)
        : base(options)
        {
        }

        public DbSet<Courses> CoursesModel { get; set; }
        public DbSet<Departments> DepartmentsModel { get; set; }

        public DbSet<Faculties> FacultiesModel { get; set; }
        public DbSet<Notes> NotesModel { get; set; }
        public DbSet<Universities> UniversitiesModel { get; set; }
        public DbSet<Users> UsersModel { get; set; }

    }
}
