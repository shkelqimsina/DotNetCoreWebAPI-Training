using Mungesat_shkolla.Data;
using Mungesat_shkolla.Mappings;
using Mungesat_shkolla.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
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

// Configure Identity (int Id to match database)
builder.Services.AddIdentity<Kujdestari, IdentityRole<int>>()
    .AddEntityFrameworkStores<MungesatDbContext>()
    .AddDefaultTokenProviders();

// Configure JWT authentication – përdorim "role" që tokeni e dërgon me këtë emër (për Administrator dhe Kujdestar)
var key = Encoding.ASCII.GetBytes(builder.Configuration["JWT:SigningKey"]);
builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  options.MapInboundClaims = false;
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = builder.Configuration["JWT:Issuer"],
    ValidAudience = builder.Configuration["JWT:Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(key),
    RoleClaimType = "role"
  };
});


// Add CORS service – origjinat lexohen nga konfigurimi (appsettings); në prodhim shtoni URL e faqes së frontend-it
var corsOrigins = builder.Configuration["CORS:AllowedOrigins"]?
    .Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    .Where(s => !string.IsNullOrEmpty(s))
    .ToArray();
if (corsOrigins == null || corsOrigins.Length == 0)
    corsOrigins = new[] { "http://localhost:5173", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5179", "http://localhost:5181" };
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Seed: nëse nuk ka asnjë përdorues, krijohet një Administrator me emër/fjalëkalim të konfigurueshëm (p.sh. për PC të re në shkollë).
using (var scope = app.Services.CreateScope())
{
  var userManager = scope.ServiceProvider.GetRequiredService<UserManager<Kujdestari>>();
  var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
  var numUsers = await userManager.Users.CountAsync();
  if (numUsers == 0)
  {
    const string adminRole = "Administrator";
    if (!await roleManager.RoleExistsAsync(adminRole))
      await roleManager.CreateAsync(new IdentityRole<int>(adminRole));
    var adminUserName = builder.Configuration["SeedAdmin:UserName"] ?? "admin";
    var adminPassword = builder.Configuration["SeedAdmin:Password"] ?? "Admin123!";
    var adminUser = new Kujdestari
    {
      UserName = adminUserName.ToLowerInvariant(),
      NormalizedUserName = adminUserName.ToUpperInvariant(),
      Email = builder.Configuration["SeedAdmin:Email"] ?? $"{adminUserName}@localhost",
      NormalizedEmail = (builder.Configuration["SeedAdmin:Email"] ?? $"{adminUserName}@localhost").ToUpperInvariant(),
      Emri = builder.Configuration["SeedAdmin:Emri"] ?? "Administrator",
      Mbiemri = builder.Configuration["SeedAdmin:Mbiemri"] ?? "Sistem",
      SecurityStamp = Guid.NewGuid().ToString(),
    };
    var createResult = await userManager.CreateAsync(adminUser, adminPassword);
    if (createResult.Succeeded)
    {
      await userManager.AddToRoleAsync(adminUser, adminRole);
      Console.WriteLine($"[Seed] U krijua përdoruesi Administrator: {adminUserName}. Ndryshoni fjalëkalimin pas kyçjes.");
    }
  }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

// Use CORS
app.UseCors("AllowReactApp");

if (!app.Environment.IsDevelopment())
  app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
