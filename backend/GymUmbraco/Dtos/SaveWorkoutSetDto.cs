namespace GymUmbraco.Dtos
{
    public class SaveWorkoutSetDto
    {
        public int WorkoutId { get; set; }
        public int ExerciseId { get; set; }
        public int SetNumber { get; set; }

        public int RepsDone { get; set; }

        public double Weight { get; set; }
    }
}
