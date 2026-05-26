namespace GymUmbraco.Models
{
    public class WorkoutSessionExercise
    {
        public int Id { get; set; }
        
        public int WorkoutSessionId { get; set; } //fk
        public WorkoutSession WorkoutSession { get; set; } // nav

        public int ExerciseId { get; set; }
        public Exercise Exercise { get; set; }

        public int SetNumber { get; set; } // vilket set i övningen

        public int RepsDone { get; set; }

        public double Weight { get; set; }
    }
}
