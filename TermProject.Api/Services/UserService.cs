using Azure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TermProject.Api.Data;
using TermProject.Api.Models;
using TermProject.Api.Models.DTO.ProfilePictureDTO;
using TermProject.Api.Models.DTO.UserDTO;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Services
{
    public class UserService : IUserService
    {
        private readonly NotelandDbContext _dbcontext;
        private readonly IWebHostEnvironment _environment;
        private string secretkey;

        public UserService(NotelandDbContext dbcontext, IConfiguration configuration, IWebHostEnvironment environment)
        {
            _dbcontext = dbcontext;
            secretkey = configuration.GetValue<string>("JwtSettings:SecretKey"); //JWT 
            _environment = environment;

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
        new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()), // 🔥 DOĞRU
        new Claim(ClaimTypes.Email, user.Email) //  E-mail bilgisini de düzgün ekleyelim
      }),
                Expires = DateTime.UtcNow.AddMinutes(45), //token time
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

        //public async Task<LoginResponseDTO> Login(LoginRequestDTO loginRequestDTO)
        //{
        //    var user = await _dbcontext.Users
        //        .FirstOrDefaultAsync(u => u.Email == loginRequestDTO.Email && u.PasswordHash == loginRequestDTO.Password);

        //    if (user == null)
        //    {
        //        return new LoginResponseDTO()
        //        {
        //            Token = "",
        //            APIUser = null
        //        };
        //    }

        //    var tokenHandler = new JwtSecurityTokenHandler();
        //    var key = Encoding.ASCII.GetBytes(secretkey);

        //    var tokenDescriptor = new SecurityTokenDescriptor
        //    {
        //        Subject = new ClaimsIdentity(new Claim[] {
        //    new Claim(ClaimTypes.Email, user.UserID.ToString()),
        //}),
        //        Expires = DateTime.UtcNow.AddMinutes(15),
        //        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        //    };

        //    var token = tokenHandler.CreateToken(tokenDescriptor);
        //    var jwtToken = tokenHandler.WriteToken(token);

        //    // Token'ı HttpOnly cookie olarak ekle
        //    var cookieOptions = new CookieOptions
        //    {
        //        HttpOnly = true,
        //        Secure = true, // HTTPS kullanıyorsanız
        //        SameSite = SameSiteMode.Strict, // CSRF koruması için
        //        Expires = DateTime.UtcNow.AddMinutes(15) // Cookie'nin geçerlilik süresi
        //    };

        //    // HttpContext kullanarak cookie ekleme
        //    var httpContext = new DefaultHttpContext(); // HttpContext nesnesi oluşturma
        //    httpContext.Response.Cookies.Append("token", jwtToken, cookieOptions);

        //    return new LoginResponseDTO()
        //    {
        //        Token = "", // Artık token'ı döndürmüyoruz, çünkü cookie'de saklı
        //        APIUser = user,
        //    };
        //}


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
            //Users user = new Users()
            //{
            //    FullName = registerRequestDTO.FullName,
            //    Email = registerRequestDTO.Email,
            //    PasswordHash = registerRequestDTO.Password,
            //    UniversityID = await GetUniversityIDByNameAsync(registerRequestDTO.UniversityName),
            //    FacultyID = await GetFacultyIDByNameAsync(registerRequestDTO.FacultyName),
            //    DepartmentID = await GetDepartmentIDByNameAsync(registerRequestDTO.DepartmentName),
            //    Role = "student"
            //};  
            //burası vardı oncesınde
            //await _dbcontext.AddAsync(user);
            //await _dbcontext.SaveChangesAsync();
            //return user;
            try
            {
                Users user = new Users()
                {
                    
                    FullName = registerRequestDTO.FullName,
                    Email = registerRequestDTO.Email,
                    PasswordHash = registerRequestDTO.Password,
                    UniversityID = registerRequestDTO.UniversityId,
                    FacultyID = registerRequestDTO.FacultyId,
                    DepartmentID = registerRequestDTO.DepartmentId,
                    Role = "student"
                };

                await _dbcontext.Users.AddAsync(user);
                await _dbcontext.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception($"Kullanıcı kaydı sırasında hata oluştu: {ex.Message}");
            }
        }

        public async Task DeleteAccount(int id)
        {
            var user = await _dbcontext.Users.FindAsync(id);

            if (user == null)
            {
                throw new Exception("Kullanıcı bulunamadı.");
            }

            _dbcontext.Users.Remove(user);
            await _dbcontext.SaveChangesAsync();
        }
 
        public async Task<string> GetUniversityNameByIDAsync(int id)
        {
            var university = await _dbcontext.Universities.FirstOrDefaultAsync(u => u.UniversityID == id);
            if (university != null)
            {
                return university.UniversityName;
            }
            else
            {
                throw new ArgumentException("University ID is not found!", nameof(id));
            }
        }

        public async Task<string> GetFacultyNameByIDAsync(int id)
        {
            var faculty = await _dbcontext.Faculties.FirstOrDefaultAsync(f => f.FacultyID == id);
            if (faculty != null)
            {
                return faculty.FacultyName;
            }
            else
            {
                throw new ArgumentException("Faculty ID is not found!", nameof(id));
            }
        }

        public async Task<string> GetDepartmentNameByIDAsync(int id)
        {
            var department = await _dbcontext.Departments.FirstOrDefaultAsync(d => d.DepartmentID == id);
            if (department != null)
            {
                return department.DepartmentName;
            }
            else
            {
                throw new ArgumentException("Department ID is not found!", nameof(id));
            }
        }

        public async Task<UserInformationDTO> GetUserById(int userid)
        {
            var user = await _dbcontext.Users.FindAsync(userid);
            if (user == null)
            {
                throw new Exception("Kullanıcı bulunamadı.");
            }
            UserInformationDTO userinfo = new UserInformationDTO
            {
                FullName = user.FullName,
                Email = user.Email,
                DepartmentName = await GetDepartmentNameByIDAsync(user.DepartmentID),
                FacultyName = await GetFacultyNameByIDAsync(user.FacultyID),
                UniversityName = await GetUniversityNameByIDAsync(user.UniversityID),
                DepartmentID = user.DepartmentID,
                FacultyID = user.FacultyID,
                UniversityID = user.UniversityID

            };
            if(userinfo == null)
            {
                throw new ArgumentException("Kullanıcı bilgileri bulunamadı.", nameof(userinfo));
            }
            return userinfo;
        }

        public async Task UpdateUserInfo(int userid, UserUpdateInfoDTO dto)
        {
            var user = await _dbcontext.Users.FindAsync(userid);
            if (user == null)
            {
                throw new Exception("Kullanıcı bulunamadı.");
            }

            // Full Name ve Email güncelleme
            user.FullName = dto.FullName;
            user.Email = dto.Email;

            // Şifre kontrolü (Eğer şifreler eşleşmiyorsa hata fırlat)
            if (!string.IsNullOrEmpty(dto.Password) && dto.Password == dto.PasswordAgain)
            {
                user.PasswordHash = dto.Password; // Gerçek projede hashleme eklemelisin!
            }
            else if (!string.IsNullOrEmpty(dto.Password) || !string.IsNullOrEmpty(dto.PasswordAgain))
            {
                throw new Exception("Şifreler uyuşmuyor!");
            }

            // Üniversite ID'sini bulma
            var universityId = await GetUniversityIDByNameAsync(dto.UniversityName);

            // Fakülte ID'sini bulma
            var facultyId = await GetFacultyIDByNameAsync(dto.FacultyName);

            // Bölüm ID'sini bulma
            var departmentId = await GetDepartmentIDByNameAsync(dto.DepartmentName);

            // Üniversite, Fakülte ve Bölüm ID'lerini kullanıcıya ata
            user.UniversityID = universityId;
            user.FacultyID = facultyId;
            user.DepartmentID = departmentId;

            // Değişiklikleri kaydet
            await _dbcontext.SaveChangesAsync();
        }


        public async Task<(bool Success, string Message)> UploadProfilePictureAsync(int userId, IFormFile profilePicture)
        {
            var user = await _dbcontext.Users.FindAsync(userId);
            if (user == null)
            {
                return (false, "Kullanıcı bulunamadı.");
            }
            // Dosya adı oluşturma (örneğin: userId_guid.jpg)
            var fileName = $"{userId}_{Guid.NewGuid()}{Path.GetExtension(profilePicture.FileName)}";
            var filePath = Path.Combine(_environment.WebRootPath, "images", "profile-pictures", fileName);

            // Dosyayı sunucuya kaydet
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await profilePicture.CopyToAsync(stream);
            }

            // Kullanıcının profil fotoğrafı yolunu güncelle
            user.ProfilePicturePath = $"/images/profile-pictures/{fileName}";
            await _dbcontext.SaveChangesAsync();

            return (true, "Profil fotoğrafı başarıyla eklendi!");

            

        }

        public async Task UpdateUserPassword(int userid, UserPasswordUpdateDTO userPasswordUpdateDTO)
        {
            // 1. Kullanıcıyı veritabanından bul
            var user = await _dbcontext.Users.FindAsync(userid);

            if (user == null)
            {
                throw new Exception("Kullanıcı bulunamadı.");
            }

            // 2. Mevcut şifreyi kontrol et
            if (user.PasswordHash != userPasswordUpdateDTO.oldPassword)
            {
                throw new Exception("Eski şifre yanlış.");
            }

            // 3. Yeni şifreler birbiriyle aynı mı kontrol et
            if (userPasswordUpdateDTO.newPassword != userPasswordUpdateDTO.newPasswordAgain)
            {
                throw new Exception("Yeni şifreler birbiriyle uyuşmuyor.");
            }
            if(user.PasswordHash == userPasswordUpdateDTO.newPassword 
                || user.PasswordHash ==  userPasswordUpdateDTO.newPasswordAgain)
            {
                throw new Exception("Yeni şifre, eski şifreniz ile aynı olamaz!");
            }
            if (userPasswordUpdateDTO.newPassword == "") 
            { 
                throw  new Exception("Şifre boş bırakılamaz!");
            }
            // 4. Şifreyi güncelle
            user.PasswordHash = userPasswordUpdateDTO.newPassword;

            // 5. Değişiklikleri kaydet
            await _dbcontext.SaveChangesAsync();
        }


        public async Task<UserInformationProfileDTO> GetUserInformationAsync(int userId)
        {
            var user = await _dbcontext.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exception("Kullanıcı bulunamadı.");
            }

            // User information with associated data (Department, Faculty, University)
            var userInfo = new UserInformationProfileDTO
            {
                FullName = user.FullName,
                Email = user.Email,
                DepartmentName = await GetDepartmentNameByIDAsync(user.DepartmentID),
                FacultyName = await GetFacultyNameByIDAsync(user.FacultyID),
                UniversityName = await GetUniversityNameByIDAsync(user.UniversityID)
            };
            return userInfo;
        }





        public async Task<ProfilePictureDTO> GetProfilePictureAsync(int userId)
        {
            var user = await _dbcontext.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exception("Kullanıcı bulunamadı."); 
            }

            var profilePicturePath = user.ProfilePicturePath;  

            // Kullanıcı profil fotoğrafı yüklememişse, varsayılan fotoğraf döndür
            if (string.IsNullOrEmpty(profilePicturePath))
            {
                profilePicturePath = "/images/profile-pictures/pp-darkblue.png"; // Varsayılan profil fotoğrafı
            }

            return new ProfilePictureDTO
            {
                ProfilePictureUrl = profilePicturePath
            };
        }




    }
}
