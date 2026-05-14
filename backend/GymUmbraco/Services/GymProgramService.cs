using GymUmbraco.Data;
using GymUmbraco.Dtos;
using GymUmbraco.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace GymUmbraco.Services
{
    public class GymProgramService
    {
        private readonly AppDbContext _context;
        public GymProgramService(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateProgram(CreateProgramDto dto, int userId)
        {
            if(dto.Workouts == null || !dto.Workouts.Any())
            {
                throw new Exception("Program must include atleast one workout");
            }

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
        }

        public async Task<List<GymProgramListItemDto>> GetMyPrograms(int userId)
        {
            var gymPrograms = await _context.GymPrograms
               .Where(p => p.UserId == userId)
               .Select(p => new GymProgramListItemDto
               {
                   Id = p.Id,
                   ProgramName = p.ProgramName
               })
               .ToListAsync();
            return gymPrograms;
        }

        public async Task<GymProgramDetailDto?> GetProgramById(int id, int userId)
        {
            var program = await _context.GymPrograms
               .Where(p => p.Id == id && p.UserId == userId)
               .Select(p => new GymProgramDetailDto
               {
                   Id = p.Id,
                   ProgramName = p.ProgramName,

                   Workouts = p.Workouts.Select(w => new WorkoutDto
                   {
                       Id = w.Id,
                       WorkoutName = w.WorkoutName,

                       Exercises = w.WorkoutExercises.Select(e =>
                           new ExerciseDetailDto
                           {
                               Id = e.Id,
                               ExerciseId = e.ExerciseId,
                               ExerciseName = e.Exercise.ExerciseName,
                               Set = e.Set,
                               Rep = e.Rep
                           }).ToList()

                   }).ToList()
               }).FirstOrDefaultAsync();
            return program;
        }

        public async Task EditProgramNameById(int id, int userId, EditProgramNameDto dto)
        {
            var program = await _context.GymPrograms.FirstOrDefaultAsync(p => p.UserId == userId && p.Id == id);
            if(program == null)
            {
                throw new Exception($"Program with id {id} was not found");
            }
            program.ProgramName = dto.GymProgramName;
            await _context.SaveChangesAsync();
        }

        public async Task EditWorkoutNameById(int id, int userId, EditWorkoutNameDto dto)
        {
            var workout = await _context.Workouts.FirstOrDefaultAsync(w => w.Id == id && w.GymProgram.UserId == userId);
            if(workout == null)
            {
                throw new Exception("Workout not found");
            }
            workout.WorkoutName = dto.WorkoutName;
            await _context.SaveChangesAsync();
        }

        public async Task<UpdatedWorkoutExerciseDto> EditWorkoutExercise(int id, int userId, EditWorkoutExerciseDto dto)
        {
            var workoutExercise = await _context.WorkoutExercises.FirstOrDefaultAsync(we => we.Workout.GymProgram.UserId == userId && we.Id == id);
            if (workoutExercise == null)
            {
                throw new Exception("Workout exercise not found"); 
            }

            if (dto.Set.HasValue)
            {
                workoutExercise.Set = dto.Set.Value;
            }
            if (dto.Rep.HasValue)
            {
                workoutExercise.Rep = dto.Rep.Value;
            }
            await _context.SaveChangesAsync();
            return new UpdatedWorkoutExerciseDto
            {
                Id = workoutExercise.Id,
                Set = workoutExercise.Set,
                Rep = workoutExercise.Rep
            };
        }

        public async Task<AddedWorkoutExerciseDto> AddExerciseToWorkout(int workoutId, int userId, AddWorkoutExerciseDto dto)
        {
            var workout = await _context.Workouts.FirstOrDefaultAsync(w => w.Id == workoutId && w.GymProgram.UserId == userId);
            if (workout == null)
            {
                throw new Exception("Workout not found");
            }
            var newExercise = new WorkoutExercise
            {
                WorkoutId = workoutId,
                ExerciseId = dto.ExerciseId,
                Set = dto.Set,
                Rep = dto.Rep,
            };
            await _context.WorkoutExercises.AddAsync(newExercise);
            await _context.SaveChangesAsync();

            return new AddedWorkoutExerciseDto
            {
                Id = newExercise.Id,
                ExerciseId = newExercise.ExerciseId,
                Set = newExercise.Set,
                Rep = newExercise.Rep
            };
        }

        public async Task DeleteExerciseFromWorkout(int id, int userId)
        {
            var workoutExercise = await _context.WorkoutExercises.FirstOrDefaultAsync(we => we.Id == id && we.Workout.GymProgram.UserId == userId);
            if (workoutExercise == null)
            {
                throw new Exception("Exercise not found");
            }
            _context.WorkoutExercises.Remove(workoutExercise);
            await _context.SaveChangesAsync();
        }

        public async Task AddWorkoutToProgram(int programId, int userId, AddWorkoutDto dto)
        {
            var gymProgram = await _context.GymPrograms.FirstOrDefaultAsync(p => p.Id == programId && p.UserId == userId); 
            if(gymProgram == null)
            {
                throw new Exception("Gym program not found");
            }

            var newWorkout = new Workout
            {
                WorkoutName = dto.WorkoutName,
                GymProgramId = programId 
            };
            await _context.Workouts.AddAsync(newWorkout);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteWorkout(int id, int userId)
        {
            var workout = await _context.Workouts.Include(w => w.WorkoutExercises).FirstOrDefaultAsync(w => w.Id == id && w.GymProgram.UserId == userId);
            if(workout == null)
            {
                throw new Exception("Workout not found");
            }
            _context.WorkoutExercises.RemoveRange(workout.WorkoutExercises);
            _context.Workouts.Remove(workout);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteProgram(int id, int userId)
        {

            var program = await _context.GymPrograms
                .Include(p => p.Workouts)
                    .ThenInclude(w => w.WorkoutExercises)
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

            if (program == null)
            {
                throw new Exception("Program not found");
            }
            _context.WorkoutExercises.RemoveRange(program.Workouts.SelectMany(w => w.WorkoutExercises));
            _context.Workouts.RemoveRange(program.Workouts);
            _context.GymPrograms.Remove(program);

            await _context.SaveChangesAsync();
        }

        public async Task<List<Exercise>> GetAllExercises()
        {
            var exercises = await _context.Exercises.ToListAsync();
            return exercises;
        }
    }
}
