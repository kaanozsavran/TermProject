using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TermProject.Api.Data;
using TermProject.Api.Models;
using TermProject.Api.Models.DTO.UserDTO;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Services
{
    public class UserService : IUserService
    {
        private readonly NotelandDbContext _dbcontext;
        private string secretkey;

        public UserService(NotelandDbContext dbcontext, IConfiguration configuration)
        {
            _dbcontext = dbcontext;
            secretkey = configuration.GetValue<string>("JwtSettings:SecretKey"); //JWT 
        }

        public async Task<LoginResponseDTO> Login(LoginRequestDTO loginRequestDTO)
        {
            var user = await _dbcontext.Users
                .FirstOrDefaultAsync(u => u.Email == loginRequestDTO.Email && u.PasswordHash == loginRequestDTO.Password);

            if (user == null)
            {
                return new LoginResponseDTO()
                {
                    Token = "",
                    APIUser = null
                };
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretkey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.Email, user.UserID.ToString()),
                }),
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            LoginResponseDTO loginResponseDTO = new LoginResponseDTO()
            {
                Token = tokenHandler.WriteToken(token),
                APIUser = user,
            };

            return loginResponseDTO;
        }


        public async Task<int> GetUniversityIDByNameAsync(string name)
        {
            var university = await _dbcontext.Universities.FirstOrDefaultAsync(u => u.UniversityName == name);
            if (university != null)
            {
                return university.UniversityID;
            }
            else
            {
                throw new ArgumentException("University name is not found!", nameof(name));
            }
        }

        public async Task<int> GetFacultyIDByNameAsync(string name)
        {
            var faculty = await _dbcontext.Faculties.FirstOrDefaultAsync(u => u.FacultyName == name);
            if (faculty != null)
            {
                return faculty.FacultyID;
            }
            else
            {
                throw new ArgumentException("Faculty is not found!", nameof(name));
            }
        }

        public async Task<int> GetDepartmentIDByNameAsync(string name)
        {
            var department = await _dbcontext.Departments.FirstOrDefaultAsync(u => u.DepartmentName == name);
            if (department != null)
            {
                return department.DepartmentID; // Bu satırı düzeltmek gerekti.
            }
            else
            {
                throw new ArgumentException("Department is not found!", nameof(name));
            }
        }




        public async Task<Users> Register(RegisterRequestDTO registerRequestDTO)
        {
            Users user = new Users()
            {
                FullName = registerRequestDTO.FullName,
                Email = registerRequestDTO.Email,
                PasswordHash = registerRequestDTO.Password,
                UniversityID = await GetUniversityIDByNameAsync(registerRequestDTO.UniversityName),
                FacultyID = await GetFacultyIDByNameAsync(registerRequestDTO.FacultyName),
                DepartmentID = await GetDepartmentIDByNameAsync(registerRequestDTO.DepartmentName),
                Role = "student"
            };  

            await _dbcontext.AddAsync(user);
            await _dbcontext.SaveChangesAsync();
            return user;
        }

    }
}
