namespace GymUmbraco.Models
{
    public class WorkoutExercise
    {
        //Denna är till för att kunna ändra sets o reps, har vi den i Exercise tabellen kan vi inte ha olika set o rep antal i olika workouts
        public int Id { get; set; }

        //Så jag vet VILKET pass den tillhör
        public int WorkoutId { get; set; }
        public Workout Workout { get; set; }

        //Så jag vet VILKEN övning det gäller
        public int ExerciseId { get; set; }
        public Exercise Exercise { get; set; }

        public int Set { get; set; }
        public int Rep { get; set; }
    }
}
