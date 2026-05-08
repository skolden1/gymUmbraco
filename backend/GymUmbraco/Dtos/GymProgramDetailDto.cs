namespace GymUmbraco.Dtos
{
    public class GymProgramDetailDto
    {
        public int Id { get; set; }

        public string ProgramName { get; set; }

        public List<WorkoutDto> Workouts { get; set; }
    }
}
