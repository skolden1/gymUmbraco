using GymUmbraco.Data;
using GymUmbraco.Dtos;
using GymUmbraco.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GymUmbraco.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GymProgramController : ControllerBase
    {
        private readonly AppDbContext _context;
        public GymProgramController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateProgram(CreateProgramDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            if (dto.Workouts == null || !dto.Workouts.Any()) return BadRequest("Program must contain at least one workout");
            var program = new GymProgram
            {
                ProgramName = dto.ProgramName,
                UserId = userId,
                Workouts = dto.Workouts.Select(w => new Workout
                {
                    WorkoutName = w.WorkoutName,
                    WorkoutExercises = w.Exercises.Select(e => new WorkoutExercise
                    {
                        ExerciseId = e.ExerciseId,
                        Set = e.Set,
                        Rep = e.Rep
                    }).ToList()
                }).ToList()
            };

            await _context.GymPrograms.AddAsync(program);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyPrograms()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            var gymPrograms = await _context.GymPrograms.Where(p => p.UserId == userId)
                .Include(p => p.Workouts)
                .ThenInclude(p => p.WorkoutExercises)
                .ThenInclude(p => p.Exercise)
                .ToListAsync();

            return Ok(gymPrograms);
        }


        // alla ska nå denna så ej authorize, detta ska ba va en global lista för alla
        [HttpGet("exercises")]
        public async Task<IActionResult> GetAllExercises()
        {
           var exercises = await _context.Exercises.ToListAsync();
            return Ok(exercises);

        }
    }
}
