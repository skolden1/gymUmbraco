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
        //Denna anvs för att skapa programmet direkt, lägg till mer endpoints längre ner där man kan redigera o lägga till bara en övn / pass etc i taget.
        public async Task<IActionResult> CreateProgram(CreateProgramDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            if (dto.Workouts == null || !dto.Workouts.Any()) return BadRequest("Programmet måste innehålla minst ett pass");
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

        //bara för dashboard, todo: fixa en till endpoint som hämtar workouts och allt senare.
        [Authorize]
        [HttpGet("myPrograms")]
        public async Task<IActionResult> GetMyPrograms()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            var gymPrograms = await _context.GymPrograms
                .Where(p => p.UserId == userId)
                .Select(p => new {
                    id = p.Id,
                    programName = p.ProgramName
                })
                .ToListAsync();

            return Ok(gymPrograms);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProgramById(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            var program = await _context.GymPrograms.Where(p => p.Id == id && p.UserId == userId).Select(p => new
            {
                id = p.Id,
                programName = p.ProgramName,

                workouts = p.Workouts.Select(w => new
                {
                    id = w.Id,
                    workoutName = w.WorkoutName,

                    exercises = w.WorkoutExercises.Select(e => new
                    {
                        id = e.Id,
                        exerciseId = e.ExerciseId,
                        exerciseName = e.Exercise.ExerciseName,
                        set = e.Set,
                        rep = e.Rep
                    }).ToList()
                }).ToList()
            }).FirstOrDefaultAsync();
            if (program == null) return NotFound();

            return Ok(program);
        }

        [Authorize]
        [HttpPut("program/{id}")]
        public async Task<IActionResult> EditProgramNameById(int id, EditProgramNameDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            var program = await _context.GymPrograms.FirstOrDefaultAsync(p => p.UserId == userId && p.Id == id);
            if(program == null) return NotFound("Programmet hittades inte");

            program.ProgramName = dto.GymProgramName;

            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPut("workout/{id}")]
        public async Task<IActionResult> EditWorkoutNameById(int id, EditWorkoutNameDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            var workout = await _context.Workouts.FirstOrDefaultAsync(w => w.Id == id && w.GymProgram.UserId == userId);
            if(workout == null) return NotFound("Passet hittades inte");

            workout.WorkoutName = dto.WorkoutName;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPut("exercise/{id}")]
        public async Task<IActionResult> EditWorkoutExercise(int id, EditWorkoutExerciseDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");
            var userId = int.Parse(userIdClaim);

            var workoutExercise = await _context.WorkoutExercises.FirstOrDefaultAsync(we => we.Workout.GymProgram.UserId == userId && we.Id == id);
            if (workoutExercise == null) return NotFound("Övningen hittades inte");

            if (dto.Set.HasValue)
            {
                workoutExercise.Set = dto.Set.Value;
            }
            if (dto.Rep.HasValue)
            {
                workoutExercise.Rep = dto.Rep.Value;
            }

            await _context.SaveChangesAsync();
            return Ok(new {id = workoutExercise.Id, set = workoutExercise.Set, rep = workoutExercise.Rep});
        }

        [Authorize]
        [HttpPost("workout/{workoutId}/exercise")]
        public async Task<IActionResult> AddExerciseToWorkout(int workoutId, AddWorkoutExerciseDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");
            var userId = int.Parse(userIdClaim);

            var workout = await _context.Workouts.FirstOrDefaultAsync(w => w.Id == workoutId && w.GymProgram.UserId == userId);
            if (workout == null) return NotFound("Passet hittades inte");

            var newExercise = new WorkoutExercise
            {
                WorkoutId = workoutId,
                ExerciseId = dto.ExerciseId,
                Set = dto.Set,
                Rep = dto.Rep,
            };
            await _context.WorkoutExercises.AddAsync(newExercise);
            await _context.SaveChangesAsync();
            return Ok(new 
            {
                id = newExercise.Id,
                exerciseId = newExercise.ExerciseId,
                set = newExercise.Set,
                rep = newExercise.Rep
            });
        }

        [Authorize]
        [HttpDelete("exercise/{id}")]
        public async Task<IActionResult> DeleteExerciseFromWorkout(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");
            var userId = int.Parse(userIdClaim);

            var workoutExercise = await _context.WorkoutExercises.FirstOrDefaultAsync(we => we.Id == id && we.Workout.GymProgram.UserId == userId);
            if (workoutExercise == null) return NotFound("Övningen hittades inte");

            _context.WorkoutExercises.Remove(workoutExercise);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost("{programId}/workout")]
        public async Task<IActionResult> AddWorkoutToProgram(int programId, AddWorkoutDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");
            var userId = int.Parse(userIdClaim);

            var gymProgram = await _context.GymPrograms.FirstOrDefaultAsync(p => p.Id == programId && p.UserId == userId);
            if (gymProgram == null) return NotFound("Programmet hittades inte");

            var newWorkout = new Workout
            {
                WorkoutName = dto.WorkoutName,
                GymProgramId = programId
            };
            await _context.Workouts.AddAsync(newWorkout);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpDelete("workout/{id}")]
        public async Task<IActionResult> DeleteWorkout(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");
            var userId = int.Parse(userIdClaim);

            var workout = await _context.Workouts.Include(w => w.WorkoutExercises).FirstOrDefaultAsync(w => w.Id == id && w.GymProgram.UserId == userId);
            if (workout == null) return NotFound("Passet hittades inte");

            _context.WorkoutExercises.RemoveRange(workout.WorkoutExercises);

            _context.Workouts.Remove(workout);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProgram(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var userId = int.Parse(userIdClaim);

            var program = await _context.GymPrograms
                .Include(p => p.Workouts)
                    .ThenInclude(w => w.WorkoutExercises)
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

            if(program == null) return NotFound("Programmet hittades inte");

   
            _context.WorkoutExercises.RemoveRange(program.Workouts.SelectMany(w => w.WorkoutExercises));

            _context.Workouts.RemoveRange(program.Workouts);

            _context.GymPrograms.Remove(program);

            await _context.SaveChangesAsync();

            return Ok();
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
