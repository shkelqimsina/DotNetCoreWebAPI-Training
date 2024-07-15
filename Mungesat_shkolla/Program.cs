using Mungesat_shkolla.Data;
using Mungesat_shkolla.Mappings;
using Mungesat_shkolla.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Mungesat_shkolla.Models;
using Mungesat_shkolla.Interfaces;
using Mungesat_shkolla.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<MungesatDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MungesatConnectionString")));

builder.Services.AddScoped<INxenesitRepository, SQLNxenesitRepository>();
builder.Services.AddScoped<IKlasatRepository, SQLKlasatRepository>();
builder.Services.AddScoped<IKujdestariRepository, SQLKujdestariRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddAutoMapper(typeof(Profiles));

// Configure Identity
builder.Services.AddIdentity<Kujdestari, IdentityRole>()
    .AddEntityFrameworkStores<MungesatDbContext>()
    .AddDefaultTokenProviders();

// Configure JWT authentication
var key = Encoding.ASCII.GetBytes(builder.Configuration["JWT:SigningKey"]);
builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = builder.Configuration["JWT:Issuer"],
    ValidAudience = builder.Configuration["JWT:Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(key)
  };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
