namespace GymUmbraco.Dtos
{
    public class CreateWorkoutDto
    {
        public string WorkoutName { get; set; }
        public List<CreateWorkoutExerciseDto> Exercises { get; set; }
    }
}
