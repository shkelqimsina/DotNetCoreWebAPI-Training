using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Mungesat_shkolla.Data;
using Mungesat_shkolla.Models;
using Mungesat_shkolla.Interfaces;
using Mungesat_shkolla.DTO;
using System.Security.Claims;

namespace api.Controllers;

[Route("api/account")]
[ApiController]
public class AccountController : ControllerBase
{
  private readonly UserManager<Kujdestari> _userManager;
  private readonly RoleManager<IdentityRole<int>> _roleManager;
  private readonly ITokenService _tokenService;
  private readonly SignInManager<Kujdestari> _signinManager;
  private readonly MungesatDbContext _dbContext;

  public AccountController(
    UserManager<Kujdestari> userManager,
    RoleManager<IdentityRole<int>> roleManager,
    ITokenService tokenService,
    SignInManager<Kujdestari> signInManager,
    MungesatDbContext dbContext)
  {
    _userManager = userManager;
    _roleManager = roleManager;
    _tokenService = tokenService;
    _signinManager = signInManager;
    _dbContext = dbContext;
  }

  /// <summary>Kthen rolin kryesor kur përdoruesi ka më shumë se një rol (p.sh. Kujdestar + Drejtori).</summary>
  private static string GetPrimaryRole(IList<string> roles)
  {
    if (roles == null || roles.Count == 0) return "";
    if (roles.Contains("Administrator")) return "Administrator";
    if (roles.Contains("Drejtori")) return "Drejtori";
    if (roles.Contains("Kujdestar")) return "Kujdestar";
    if (roles.Contains("Prindi")) return "Prindi";
    return roles[0];
  }

  /// <summary>Lista e klasave për formën e regjistrimit (Prindi) – pa nevojë për kyçje.</summary>
  [HttpGet("klasat")]
  [AllowAnonymous]
  public async Task<IActionResult> GetKlasatForRegister()
  {
    var klasat = await _dbContext.Klasat.AsNoTracking().OrderBy(k => k.Emri).Select(k => new { id = k.Id, emri = k.Emri }).ToListAsync();
    return Ok(klasat);
  }

  [HttpGet("me")]
  [Authorize]
  public async Task<IActionResult> Me()
  {
    var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
    if (string.IsNullOrEmpty(sub) || !int.TryParse(sub, out var userId))
      return Unauthorized(new { message = "Token i pavlefshëm." });

    var user = await _userManager.FindByIdAsync(userId.ToString());
    if (user == null)
      return Unauthorized(new { message = "Përdoruesi nuk u gjet." });

    var roles = await _userManager.GetRolesAsync(user);
    var role = GetPrimaryRole(roles);

    int? klasatId = null;
    if (User.IsInRole("Kujdestar"))
    {
      var klasa = await _dbContext.Klasat.AsNoTracking().FirstOrDefaultAsync(k => k.KujdestariId == userId);
      klasatId = klasa?.Id;
    }

    return Ok(new
    {
      userName = user.UserName,
      email = user.Email,
      role,
      isAdministrator = User.IsInRole("Administrator"),
      isKujdestar = User.IsInRole("Kujdestar"),
      isPrindi = User.IsInRole("Prindi"),
      isDrejtori = User.IsInRole("Drejtori"),
      klasatId
    });
  }

  [HttpPost("login")]
  public async Task<IActionResult> Login(LoginDto loginDto)
  {
    if (!ModelState.IsValid)
      return BadRequest(ModelState);

    var username = loginDto.Username?.Trim();
    if (string.IsNullOrEmpty(username))
      return BadRequest(new { message = "Shkruani emrin e përdoruesit." });

    var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == username.ToLowerInvariant());
    if (user == null)
      return Unauthorized(new { message = "Përdoruesi me këtë emër nuk u gjet. Kontrolloni emrin ose regjistrohuni." });

    var result = await _signinManager.CheckPasswordSignInAsync(user, loginDto.Password ?? "", false);
    if (!result.Succeeded)
      return Unauthorized(new { message = "Fjalëkalimi është i gabuar. Provoni përsëri." });

    var roles = await _userManager.GetRolesAsync(user);
    var role = GetPrimaryRole(roles);

    return Ok(new NewUserDto
    {
      UserName = user.UserName,
      Email = user.Email ?? "",
      Token = await _tokenService.CreateTokenAsync(user),
      Role = role
    });
  }

  [HttpPost("register")]
  [AllowAnonymous]
  public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
  {
    try
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      if (registerDto.Role?.Trim() == "Prindi")
        return BadRequest(new { message = "Regjistrimi si Prind bëhet nga Administratori, Drejtori ose kujdestari i klasës, nga faqja e nxënësve." });

      var numriPerdoruesvePara = await _userManager.Users.CountAsync();
      var roleTrim = registerDto.Role?.Trim();
      var eshteKujdestarOseDrejtori = roleTrim == "Kujdestar" || roleTrim == "Drejtori";

      if (numriPerdoruesvePara > 0)
      {
        if (!eshteKujdestarOseDrejtori)
          return BadRequest(new { message = "Regjistrimi nga faqja publike lejohet vetëm për përdoruesin e parë." });

        if (string.IsNullOrWhiteSpace(registerDto.AdminUserName) || string.IsNullOrWhiteSpace(registerDto.AdminPassword))
          return BadRequest(new { message = "Jepni emrin e përdoruesit dhe fjalëkalimin e Administratorit ose Drejtorit që e autorizon regjistrimin." });

        var adminUser = await _userManager.FindByNameAsync(registerDto.AdminUserName.Trim());
        if (adminUser == null)
          return BadRequest(new { message = "Administratori ose Drejtori me këto kredenciale nuk u gjet." });

        var adminSignIn = await _signinManager.CheckPasswordSignInAsync(adminUser, registerDto.AdminPassword, false);
        if (!adminSignIn.Succeeded)
          return BadRequest(new { message = "Emri i përdoruesit ose fjalëkalimi i Administratorit/Drejtorit janë gabim." });

        var adminRoles = await _userManager.GetRolesAsync(adminUser);
        if (roleTrim == "Drejtori")
        {
          if (!adminRoles.Contains("Administrator"))
            return BadRequest(new { message = "Regjistrimi i një drejtori lejohet vetëm nga Administratori." });
        }
        else
        {
          // Kujdestar
          var mundAutorizojKujdestar = adminRoles.Contains("Administrator") || adminRoles.Contains("Drejtori");
          if (!mundAutorizojKujdestar)
            return BadRequest(new { message = "Regjistrimi i një kujdestari lejohet vetëm nga Administratori ose Drejtori." });
        }
      }

      var appUser = new Kujdestari
      {
        UserName = registerDto.Username?.Trim().ToLowerInvariant() ?? "",
        Emri = registerDto.Emri ?? "",
        Mbiemri = registerDto.Mbiemri ?? "",
        Email = registerDto.Email ?? "",
      };

      var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password ?? "");

      if (createdUser.Succeeded)
      {
        var roleName = numriPerdoruesvePara == 0 ? "Administrator" : (roleTrim == "Drejtori" ? "Drejtori" : "Kujdestar");
        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
          await _roleManager.CreateAsync(new IdentityRole<int>(roleName));

        var roleResult = await _userManager.AddToRoleAsync(appUser, roleName);
        if (!roleResult.Succeeded)
          return StatusCode(500, new { message = "Përdoruesi u krijua por roli nuk u caktua.", errors = roleResult.Errors.Select(e => e.Description).ToList() });

        return Ok(new NewUserDto
        {
          UserName = appUser.UserName,
          Email = appUser.Email ?? "",
          Token = await _tokenService.CreateTokenAsync(appUser),
          Role = roleName
        });
      }
      else
      {
        var errors = createdUser.Errors.Select(e => e.Description).ToList();
        return BadRequest(new { message = "Gabim gjatë krijimit të përdoruesit.", errors });
      }
    }
    catch (Exception ex)
    {
      var msg = ex.InnerException?.Message ?? ex.Message;
      return StatusCode(500, new { message = "Gabim i brendshëm. Provoni përsëri.", detail = msg });
    }
  }

  private int? GetCurrentUserId()
  {
    var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
    return int.TryParse(sub, out var id) ? id : null;
  }

  /// <summary>Regjistron një prind dhe e lidh me nxënësin. Administratori dhe Drejtori për çdo nxënës; kujdestari vetëm për nxënësit e klasës së vet.</summary>
  [HttpPost("register-parent")]
  [Authorize(Roles = "Administrator,Kujdestar,Drejtori")]
  public async Task<IActionResult> RegisterParent([FromBody] RegisterParentDto dto)
  {
    if (!ModelState.IsValid)
      return BadRequest(ModelState);

    var nxenesi = await _dbContext.nxenesi.Include(n => n.Klasat).FirstOrDefaultAsync(n => n.Id == dto.NxenesiId);
    if (nxenesi == null)
      return NotFound(new { message = "Nxënësi nuk u gjet." });

    // Kujdestari vetëm për nxënësit e klasës së vet; Administratori dhe Drejtori për çdo nxënës.
    if (User.IsInRole("Kujdestar") && !User.IsInRole("Administrator") && !User.IsInRole("Drejtori"))
    {
      var userId = GetCurrentUserId();
      if (!userId.HasValue)
        return Unauthorized();
      var klasaKujdestarit = await _dbContext.Klasat.AsNoTracking().FirstOrDefaultAsync(k => k.KujdestariId == userId);
      if (klasaKujdestarit == null || nxenesi.KlasatId != klasaKujdestarit.Id)
        return Forbid();
    }

    var userName = (dto.UserName ?? dto.Email)?.Trim().ToLowerInvariant() ?? "";
    if (string.IsNullOrEmpty(userName))
      return BadRequest(new { message = "Shkruani emrin e përdoruesit ose email-in." });

    if (await _userManager.FindByNameAsync(userName) != null)
      return BadRequest(new { message = "Ky emër përdoruesi ekziston tashmë." });

    var appUser = new Kujdestari
    {
      UserName = userName,
      NormalizedUserName = userName.ToUpperInvariant(),
      Emri = dto.Emri?.Trim() ?? "",
      Mbiemri = dto.Mbiemri?.Trim() ?? "",
      Email = dto.Email?.Trim() ?? "",
      NormalizedEmail = (dto.Email ?? "").Trim().ToUpperInvariant(),
      SecurityStamp = Guid.NewGuid().ToString(),
    };

    var createResult = await _userManager.CreateAsync(appUser, dto.Password ?? "");
    if (!createResult.Succeeded)
      return BadRequest(new { message = "Prindi nuk u regjistrua.", errors = createResult.Errors.Select(e => e.Description).ToList() });

    var roleName = "Prindi";
    if (!await _roleManager.RoleExistsAsync(roleName))
      await _roleManager.CreateAsync(new IdentityRole<int>(roleName));
    await _userManager.AddToRoleAsync(appUser, roleName);

    nxenesi.PrindiUserId = appUser.Id;
    await _dbContext.SaveChangesAsync();

    return Ok(new NewUserDto
    {
      UserName = appUser.UserName,
      Email = appUser.Email ?? "",
      Role = roleName,
    });
  }

  /// <summary>Vetëm administratori mund të rivendosë fjalëkalimin e një përdoruesi (p.sh. kur kujdestari e ka harruar).</summary>
  [HttpPost("reset-password")]
  [Authorize(Roles = "Administrator")]
  public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
  {
    if (string.IsNullOrWhiteSpace(dto.UserName))
      return BadRequest(new { message = "Shkruani emrin e përdoruesit (username)." });
    if (string.IsNullOrWhiteSpace(dto.NewPassword) || dto.NewPassword.Length < 6)
      return BadRequest(new { message = "Fjalëkalimi i ri duhet të përmbajë të paktën 6 karaktere." });

    var user = await _userManager.FindByNameAsync(dto.UserName.Trim().ToLowerInvariant());
    if (user == null)
      return NotFound(new { message = "Përdoruesi me këtë emër nuk u gjet." });

    await _userManager.RemovePasswordAsync(user);
    var result = await _userManager.AddPasswordAsync(user, dto.NewPassword);
    if (!result.Succeeded)
      return BadRequest(new { message = "Fjalëkalimi nuk u ndryshua.", errors = result.Errors.Select(e => e.Description).ToList() });

    return Ok(new { message = "Fjalëkalimi u ndryshua. Përdoruesi mund të kyçet me fjalëkalimin e ri." });
  }
}