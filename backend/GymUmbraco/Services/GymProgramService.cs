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
    }
}
