namespace GymUmbraco.Dtos
{
    public class WorkoutDto
    {
        public int Id { get; set; }

        public string WorkoutName { get; set; }

        public List<ExerciseDetailDto> Exercises { get; set; }
    }
}
