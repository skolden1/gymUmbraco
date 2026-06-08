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
    public class WorkoutSessionController : ControllerBase
    {
        private readonly AppDbContext _context; //refaktorera till servci senare
        public WorkoutSessionController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost("save-set")]
        public async Task<IActionResult> SaveSet(SaveWorkoutSetDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            var workoutExists = await _context.Workouts
                .Include(w => w.GymProgram)
                .AnyAsync(w => w.Id == dto.WorkoutId && w.GymProgram.UserId == userId);

            if (!workoutExists)
            {
                return Unauthorized("Workout tillhör inte användaren");
            }

            var exerciseExists = await _context.WorkoutExercises
                .AnyAsync(we =>
                    we.WorkoutId == dto.WorkoutId &&
                    we.ExerciseId == dto.ExerciseId);

            if (!exerciseExists)
            {
                return BadRequest("Couldnt not find that exercise in the workout");
            }

            var workoutSession = await _context.WorkoutSessions
                .FirstOrDefaultAsync(ws =>
                    ws.UserId == userId &&
                    ws.WorkoutId == dto.WorkoutId &&
                    !ws.IsCompleted);

            if (workoutSession == null)
            {
                workoutSession = new WorkoutSession
                {
                    UserId = userId,
                    WorkoutId = dto.WorkoutId,
                    StartedAt = DateTime.UtcNow,
                    IsCompleted = false
                };

                _context.WorkoutSessions.Add(workoutSession);
                await _context.SaveChangesAsync();
            }

            var existingSet = await _context.WorkoutSessionExercises
                .FirstOrDefaultAsync(wse =>
                    wse.WorkoutSessionId == workoutSession.Id &&
                    wse.ExerciseId == dto.ExerciseId &&
                    wse.SetNumber == dto.SetNumber);

            if (existingSet != null)
            {
                existingSet.RepsDone = dto.RepsDone;
                existingSet.Weight = dto.Weight;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    existingSet.Id,
                    existingSet.WorkoutSessionId,
                    existingSet.ExerciseId,
                    existingSet.SetNumber,
                    existingSet.RepsDone,
                    existingSet.Weight
                });
            }

            var workoutSessionExercise = new WorkoutSessionExercise
            {
                WorkoutSessionId = workoutSession.Id,
                ExerciseId = dto.ExerciseId,
                SetNumber = dto.SetNumber,
                RepsDone = dto.RepsDone,
                Weight = dto.Weight,
            };

            await _context.WorkoutSessionExercises.AddAsync(workoutSessionExercise);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                workoutSessionExercise.Id,
                workoutSessionExercise.WorkoutSessionId,
                workoutSessionExercise.ExerciseId,
                workoutSessionExercise.SetNumber,
                workoutSessionExercise.RepsDone,
                workoutSessionExercise.Weight
            });
        }


        [Authorize]
        [HttpPut("update-set/{id}")]
        public async Task<IActionResult> UpdateSet(int id, UpdatedWorkoutSetDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            var workoutSessionExercise = await _context.WorkoutSessionExercises.Include(wse => wse.WorkoutSession)
                .FirstOrDefaultAsync(wse => wse.Id == id && wse.WorkoutSession.UserId == userId);

            if (workoutSessionExercise == null)
            {
                return NotFound(
                "Could not find set"
                );
            }

            workoutSessionExercise.RepsDone = dto.RepsDone;
            workoutSessionExercise.Weight = dto.Weight;

            await _context.SaveChangesAsync();

            return Ok(workoutSessionExercise);
        }

        [Authorize]
        [HttpPut("complete-session/{workoutId}")]
        public async Task<IActionResult> CompleteSession(int workoutId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            var session = await _context.WorkoutSessions.FirstOrDefaultAsync(ws => ws.WorkoutId == workoutId && userId == ws.UserId && !ws.IsCompleted);
            if(session == null)
            {
                return NotFound("Could not find session");
            }
            session.IsCompleted = true;
            await _context.SaveChangesAsync();

            return Ok(session);
        }

        [Authorize]
        [HttpGet("latest-session/{workoutId}")]
        public async Task<IActionResult> GetLatestSession(int workoutId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            var latestSession = await _context.WorkoutSessions
                .Include(ws => ws.WorkoutSessionExercises)
                .Where(ws =>
                    ws.UserId == userId &&
                    ws.WorkoutId == workoutId &&
                    ws.IsCompleted)
                .OrderByDescending(ws => ws.StartedAt)
                .FirstOrDefaultAsync();

            if (latestSession == null)
                return NotFound();

            return Ok(
                latestSession.WorkoutSessionExercises
                    .Select(x => new
                    {
                        x.ExerciseId,
                        x.SetNumber,
                        x.RepsDone,
                        x.Weight
                    })
            );
        }

        //Om anv refreshar sidan när man redan påbörjat o edita vissa saker vill jag visa upp det ist för att skapa ny session hela tiden
        [Authorize]
        [HttpGet("active-session/{workoutId}")]
        public async Task<IActionResult> GetActiveSession(int workoutId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            var activeSession = await _context.WorkoutSessions
                .Include(ws => ws.WorkoutSessionExercises)
                .FirstOrDefaultAsync(ws => ws.UserId == userId && ws.WorkoutId == workoutId && !ws.IsCompleted);

            if (activeSession == null) return NotFound();

            return Ok(
                activeSession.WorkoutSessionExercises
                    .Select(x => new
                    {
                        x.ExerciseId,
                        x.SetNumber,
                        x.RepsDone,
                        x.Weight
                    })
            );
        }

        //refaktorera till service fil senare
        //Om anv väljer att kasta nuvarande aktiva pass
        [Authorize]
        [HttpDelete("cancel-session/{workoutId}")]
        public async Task<IActionResult> CancelWorkoutSession(int workoutId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            var activeSession = await _context.WorkoutSessions.FirstOrDefaultAsync(ws => ws.UserId == userId && ws.WorkoutId == workoutId && !ws.IsCompleted);
            if(activeSession == null) return NotFound();

           _context.WorkoutSessions.Remove(activeSession);
           await _context.SaveChangesAsync();

            return NoContent();
        }

        //historik / jämförelse sidan
        [Authorize]
        [HttpGet("completed-sessions")]
        public async Task<IActionResult> GetCompletedSessions()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            var completedSessions = await _context.WorkoutSessions.Where(ws => ws.UserId == userId && ws.IsCompleted)
                .OrderByDescending(ws => ws.StartedAt)
                //Select includear automatiskt genom navprops
                .Select(ws => new
                {
                    SessionId = ws.Id,
                    Date = ws.StartedAt,
                    ProgramName = ws.Workout.GymProgram.ProgramName,
                    WorkoutName = ws.Workout.WorkoutName
                    
                })
                .ToListAsync();

            if(!completedSessions.Any()) return NotFound("No completed sessions found");

            return Ok(completedSessions);
        }
        // typ som ovan men här hämtar vi mer detaljerad info om passet, vilka övningar, reps, vikt etc
        [Authorize]
        [HttpGet("session-details/{sessionId}")]
        public async Task<IActionResult> GetCompletedSessionDetails(int sessionId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            var sessionDetails = await _context.WorkoutSessions.Where(ws => ws.Id == sessionId && ws.UserId == userId && ws.IsCompleted)
                .Select(ws => new
                {
                    SessionId = ws.Id,
                    Exercises = ws.WorkoutSessionExercises.Select(wse => new
                    {
                        ExerciseName = wse.Exercise.ExerciseName,
                        wse.SetNumber,
                        wse.RepsDone,
                        wse.Weight
                    })
                }).FirstOrDefaultAsync();

            if (sessionDetails == null) return NotFound("Kunde inte hitta passet");
            return Ok(sessionDetails);
        }
    }
}
