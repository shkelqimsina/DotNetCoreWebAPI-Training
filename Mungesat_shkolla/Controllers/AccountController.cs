using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Mungesat_shkolla.Models;
using Mungesat_shkolla.Interfaces;
using Mungesat_shkolla.DTO;

namespace api.Controllers;

[Route("api/account")]
[ApiController]
public class AccountController : ControllerBase
{
  private readonly UserManager<Kujdestari> _userManager;
  private readonly RoleManager<IdentityRole<int>> _roleManager;
  private readonly ITokenService _tokenService;
  private readonly SignInManager<Kujdestari> _signinManager;

  public AccountController(
    UserManager<Kujdestari> userManager,
    RoleManager<IdentityRole<int>> roleManager,
    ITokenService tokenService,
    SignInManager<Kujdestari> signInManager)
  {
    _userManager = userManager;
    _roleManager = roleManager;
    _tokenService = tokenService;
    _signinManager = signInManager;
  }

  [HttpPost("login")]
  public async Task<IActionResult> Login(LoginDto loginDto)
  {
    if (!ModelState.IsValid)
      return BadRequest(ModelState);

    var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());
    if (user == null) return Unauthorized("Invalid username!");

    var result = await _signinManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
    if (!result.Succeeded) return Unauthorized("Username not found and/or password incorrect");

    var roles = await _userManager.GetRolesAsync(user);
    var role = roles.FirstOrDefault() ?? "";

    return Ok(new NewUserDto
    {
      UserName = user.UserName,
      Email = user.Email ?? "",
      Token = await _tokenService.CreateTokenAsync(user),
      Role = role
    });
  }

  [HttpPost("register")]
  public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
  {
    try
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

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
        var isFirstUser = await _userManager.Users.CountAsync() == 1;
        var roleName = isFirstUser ? "Administrator" : "Kujdestar";
        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
          await _roleManager.CreateAsync(new IdentityRole<int>(roleName));
        await _userManager.AddToRoleAsync(appUser, roleName);

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
}