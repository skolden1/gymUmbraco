namespace GymUmbraco.Models
{
    public class WorkoutSession
    {
        public int Id { get; set; }
        public int UserId { get; set; }       // FK
        public User User { get; set; }  //nav prop
        public int WorkoutId { get; set; }    // FK
        public Workout Workout { get; set; }  //nav prop
        public DateTime StartedAt { get; set; }
        public bool IsCompleted { get; set; }
        public List<WorkoutSessionExercise> WorkoutSessionExercises { get; set; } = [];
    }
}
