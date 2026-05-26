using GymUmbraco.Models;
using Microsoft.EntityFrameworkCore;

namespace GymUmbraco.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<GymProgram> GymPrograms { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Workout> Workouts { get; set; }
        public DbSet<WorkoutExercise> WorkoutExercises { get; set; }
        public DbSet<WorkoutSession> WorkoutSessions { get; set; }
        public DbSet<WorkoutSessionExercise> WorkoutSessionExercises { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<WorkoutSession>()
        .HasOne(ws => ws.User)
        .WithMany()
        .HasForeignKey(ws => ws.UserId)
        .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<WorkoutSession>()
                .HasOne(ws => ws.Workout)
                .WithMany()
                .HasForeignKey(ws => ws.WorkoutId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<WorkoutSessionExercise>()
                .HasOne(wse => wse.WorkoutSession)
                .WithMany(ws => ws.WorkoutSessionExercises)
                .HasForeignKey(wse => wse.WorkoutSessionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<WorkoutSessionExercise>()
                .HasOne(wse => wse.Exercise)
                .WithMany()
                .HasForeignKey(wse => wse.ExerciseId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Exercise>().HasData(
                new Exercise { Id = 1, ExerciseName = "Bänkpress" },
                new Exercise { Id = 2, ExerciseName = "Lutande hantelpress" },
                new Exercise { Id = 3, ExerciseName = "Kabel-flyes" },
                new Exercise { Id = 4, ExerciseName = "Dips" },

                new Exercise { Id = 5, ExerciseName = "Pullups" },
                new Exercise { Id = 6, ExerciseName = "Pullups smalt grepp" },
                new Exercise { Id = 7, ExerciseName = "Latsdrag" },
                new Exercise { Id = 8, ExerciseName = "Skivstångsrodd" },
                new Exercise { Id = 9, ExerciseName = "Hantelrodd" },
                new Exercise { Id = 10, ExerciseName = "Sittande kabelrodd" },
                new Exercise { Id = 11, ExerciseName = "Shrugs" },

                new Exercise { Id = 12, ExerciseName = "Militärpress" },
                new Exercise { Id = 13, ExerciseName = "Sittande hantelpress" },
                new Exercise { Id = 14, ExerciseName = "Sidolyft" },
                new Exercise { Id = 15, ExerciseName = "Bakre axlar maskin" },
                new Exercise { Id = 16, ExerciseName = "Face Pulls" },

                new Exercise { Id = 17, ExerciseName = "Knäböj" },
                new Exercise { Id = 18, ExerciseName = "Marklyft" },
                new Exercise { Id = 19, ExerciseName = "Benpress" },
                new Exercise { Id = 20, ExerciseName = "Benspark" },
                new Exercise { Id = 21, ExerciseName = "Lårcurl" },
                new Exercise { Id = 22, ExerciseName = "Vadpress" },
                new Exercise { Id = 23, ExerciseName = "Bulgariska utfall" },

                new Exercise { Id = 24, ExerciseName = "Bicepscurl" },
                new Exercise { Id = 25, ExerciseName = "Hammercurl" },
                new Exercise { Id = 26, ExerciseName = "Triceps pushdown" },
                new Exercise { Id = 27, ExerciseName = "Tricepspress med hantel" }
            );
        }
    }
}
