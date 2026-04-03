using GymUmbraco.Data;
using GymUmbraco.Dtos;
using GymUmbraco.Models;
using J2N.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpPost]
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

        [HttpPost]
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

            return Ok("Login success");
        }
    }
}
