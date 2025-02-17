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

        public DbSet<Courses> Courses { get; set; }
        public DbSet<Departments> Departments { get; set; }

        public DbSet<Faculties> Faculties { get; set; }
        public DbSet<Notes> Notes { get; set; }
        public DbSet<Universities> Universities { get; set; }
        public DbSet<Users> Users { get; set; }

    }
}
