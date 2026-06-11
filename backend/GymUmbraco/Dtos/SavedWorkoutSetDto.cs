namespace GymUmbraco.Dtos
{
    //dto som vi SKICKAR/retunerar TILLBAKA till frontend
    public class SavedWorkoutSetDto
    {
        public int Id { get; set; }
        public int WorkoutSessionId { get; set; }
        public int ExerciseId { get; set; }
        public int SetNumber { get; set; }
        public int RepsDone { get; set; }
        public double Weight { get; set; }
    }
}
