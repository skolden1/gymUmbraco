using GymUmbraco.Data;
using GymUmbraco.Dtos;
using GymUmbraco.Models;
using J2N.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GymUmbraco.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserAuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UserAuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto regDto)
        {
            var userAlreadyExist = await _context.Users.FirstOrDefaultAsync(u => u.Email == regDto.EmailDto);
            if (userAlreadyExist != null) return BadRequest("Usern är redan registread"); 
            if (regDto.PasswordDto != regDto.RepeatPasswordDto) return BadRequest("Lösenord matchar inte");

            var user = new User
            {
                Email = regDto.EmailDto,
                CreatedAt = DateTime.UtcNow 
            };

            var hashPw = new PasswordHasher<User>();
            user.PasswordHash = hashPw.HashPassword(user, regDto.PasswordDto);

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return Ok(new {message = "User skapad"});
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.EmailDto);
            if (user == null) return Unauthorized("Fel email eller lösenord");

            var hashPw = new PasswordHasher<User>();
            var result = hashPw.VerifyHashedPassword(
                user,
                user.PasswordHash,
                loginDto.PasswordDto
            );
            if (result != PasswordVerificationResult.Success) return Unauthorized("Fel email eller lösenord");

            var jwtSettings = HttpContext.RequestServices
                .GetRequiredService<IConfiguration>()
                .GetSection("Jwt");

            
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"])
            );

           
            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

           
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: creds
            );

            
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { token = jwt });
        }

        //Hämta "rätt" user genom jwt token 
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> me()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            return Ok(new
            {
                userId,
                email
            });
        }

    }
}
