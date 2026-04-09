namespace GymUmbraco.Models
{
    public class GymProgram
    {
        public int Id { get; set; }

        public int UserId { get; set; }       // FK
        public User User { get; set; }

        public string ProgramName { get; set; }
        public List<Workout> Workouts { get; set; } = new();
    }
}
