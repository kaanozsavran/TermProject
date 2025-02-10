using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TermProject.Api.Data;
using TermProject.Api.Models.DTO;
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
            secretkey = configuration.GetValue<string>("JwtSettings:SecretKey");
        }

        public LoginResponseDTO Login(LoginRequestDTO loginRequestDTO)
        {
            var user = _dbcontext.UsersModel.FirstOrDefault(u => u.Email == loginRequestDTO.Email 
            && u.PasswordHash == loginRequestDTO.Password);

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
         new Claim(ClaimTypes.Email,user.UserID.ToString()),

                }),
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = new(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            LoginResponseDTO loginResponseDTO = new LoginResponseDTO()
            {
                Token = tokenHandler.WriteToken(token),
                APIUser = user,
            };

            return loginResponseDTO;
        }
    }
}
