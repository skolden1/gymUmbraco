namespace GymUmbraco.Models
{
    public class Workout
    {
        public int Id { get; set; }
        public string WorkoutName { get; set; }
        public int GymProgramId { get; set; }
        public GymProgram GymProgram { get; set; }

        public List<WorkoutExercise> WorkoutExercises { get; set; } = new();
    }
}
