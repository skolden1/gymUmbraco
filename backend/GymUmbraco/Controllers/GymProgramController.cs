using GymUmbraco.Data;
using GymUmbraco.Dtos;
using GymUmbraco.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
            var userId = int.Parse(User.FindFirst("id").Value); //kmr från jwt som skickas med i headern från frontend

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
    }
}
