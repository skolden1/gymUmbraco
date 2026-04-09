namespace GymUmbraco.Dtos
{
    public class CreateProgramDto
    {
        public string ProgramName { get; set; }
        public List<CreateWorkoutDto> Workouts { get; set; }
    }
}
