using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using TermProject.Api.Data;
using TermProject.Api.Services;
using TermProject.Api.Services.Interfaces;


var builder = WebApplication.CreateBuilder(args);
//CORS politikasýný tanýmla
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
       policy =>
        {
            policy.WithOrigins("http://127.0.0.1:5500")  // Frontend URL'sini buraya yaz
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});


// Add services to the container.
builder.Services.AddDbContext<NotelandDbContext>(option => // DbContext entegre
{
    option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultSQLConnection"));
});
builder.Services.AddSwaggerGen(options =>
{
options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
{
    Description =
        "JWT Authorization header using the Bearer Scheme. \r\n\r\n" +
        "Enter 'Bearer' [space] and then your token. \r\n\r\n" +
        "Example: Bearer your_token",
    Name = "Authorization",
    In = ParameterLocation.Header,
    Scheme = "Bearer"
});                                                                                        //JWT için
    options.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {   new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header

            },
            new List<string>()
        }
    });
});

builder.Services.AddControllers();
builder.Services.AddScoped<IUserService, UserService>(); // UserService entegresi.
builder.Services.AddScoped<IUniversityService, UniversityService>(); // UniversityService entegresi.
builder.Services.AddScoped<IFacultyService, FacultyService>(); // FacultyService entegresi.
builder.Services.AddScoped<IDepartmentService, DepartmentService>(); // DepartmentService entegresi.
builder.Services.AddScoped<ICourseService, CourseService>(); // CourseService entegresi.
builder.Services.AddScoped<IStatisticsService, StatisticsService>(); // StatisticsService entegresi.
builder.Services.AddScoped<INoteService, NoteService>(); // StatisticsService entegresi.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var key = builder.Configuration.GetValue<string>("JwtSettings:SecretKey"); // JWT için
builder.Services.AddAuthentication(x =>
{
x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
x.RequireHttpsMetadata = false;
x.SaveToken = true;
x.TokenValidationParameters = new TokenValidationParameters
{
    ValidateIssuerSigningKey = true,
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
    ValidateIssuer = false,
    ValidateAudience = false

};

});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Statik dosyalarýn sunulmasý ic?in middleware'i ekle
app.UseStaticFiles(); // wwwroot klaso?ru?nden statik dosyalarý sunmak ic?in

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin"); // CORS'u aktif et


app.UseAuthentication(); // Authentication
app.UseAuthorization();

app.MapControllers();

app.Run();
