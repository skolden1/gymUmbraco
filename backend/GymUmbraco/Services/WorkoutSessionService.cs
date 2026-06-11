using GymUmbraco.Data;
using GymUmbraco.Dtos;
using GymUmbraco.Models;
using Microsoft.EntityFrameworkCore;

namespace GymUmbraco.Services
{
    public class WorkoutSessionService
    {
        private readonly AppDbContext _context;
        public WorkoutSessionService(AppDbContext context)
        {
            _context = context;
        }

        //Notera att savedWorkoutSetDto och SaveWorkoutSetDto är oliak typer.
        public async Task<SavedWorkoutSetDto> SaveWorkoutSet(SaveWorkoutSetDto dto, int userId)
        {
            var workoutExists = await _context.Workouts
                .Include(w => w.GymProgram)
                .AnyAsync(w => w.Id == dto.WorkoutId && w.GymProgram.UserId == userId);

            if (!workoutExists)
            {
               throw new Exception("Workout doesn't belong to user");
            }

            var exerciseExists = await _context.WorkoutExercises
                .AnyAsync(we =>
                    we.WorkoutId == dto.WorkoutId &&
                    we.ExerciseId == dto.ExerciseId);

            if (!exerciseExists)
            {
                throw new Exception("Couldnt not find that exercise in the workout");
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

                return new SavedWorkoutSetDto
                {
                    Id = existingSet.Id,
                    WorkoutSessionId = existingSet.WorkoutSessionId,
                    ExerciseId = existingSet.ExerciseId,
                    SetNumber = existingSet.SetNumber,
                    RepsDone = existingSet.RepsDone,
                    Weight = existingSet.Weight
                };
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

            return new SavedWorkoutSetDto
            {
                Id = workoutSessionExercise.Id,
                WorkoutSessionId = workoutSessionExercise.WorkoutSessionId,
                ExerciseId = workoutSessionExercise.ExerciseId,
                SetNumber = workoutSessionExercise.SetNumber,
                RepsDone = workoutSessionExercise.RepsDone,
                Weight = workoutSessionExercise.Weight
            };
        }
    }
}
