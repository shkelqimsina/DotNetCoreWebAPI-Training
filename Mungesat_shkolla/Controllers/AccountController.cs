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
  private readonly ITokenService _tokenService;
  private readonly SignInManager<Kujdestari> _signinManager;
  public AccountController(UserManager<Kujdestari> userManager, ITokenService tokenService, SignInManager<Kujdestari> signInManager)
  {
    _userManager = userManager;
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

    return Ok(
        new NewUserDto
        {
          UserName = user.UserName,
          Email = user.Email,
          Token = _tokenService.CreateToken(user)
        }
    );
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
        UserName = registerDto.Username,
        Emri = registerDto.Emri,
        Mbiemri = registerDto.Mbiemri,
        Email = registerDto.Email,
      };

      var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);

      if (createdUser.Succeeded)
      {
          return Ok(
              new NewUserDto
              {
                UserName = appUser.UserName,
                Email = appUser.Email,
                Token = _tokenService.CreateToken(appUser)
              }
          );
      }
      else
      {
        return StatusCode(500, "An error occurred while creating the user.");
      }
    }
    catch (Exception e)
    {
      return StatusCode(500, "An internal error occurred.");
    }
  }
}