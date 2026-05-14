using GymUmbraco.Data;
using GymUmbraco.Dtos;
using GymUmbraco.Models;
using GymUmbraco.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GymUmbraco.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GymProgramController : ControllerBase
    {
        private readonly GymProgramService _gymProgramService;

        public GymProgramController(GymProgramService gymProgramService)
        {
            _gymProgramService = gymProgramService;
        }

        [Authorize]
        [HttpPost]
        //Denna anvs för att skapa programmet direkt, lägg till mer endpoints längre ner där man kan redigera o lägga till bara en övn / pass etc i taget.
        public async Task<IActionResult> CreateProgram(CreateProgramDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            try{
                await _gymProgramService.CreateProgram(dto, userId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //bara för dashboard, todo: fixa en till endpoint som hämtar workouts och allt senare.
        [Authorize]
        [HttpGet("myPrograms")]
        public async Task<IActionResult> GetMyPrograms()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);
            var gymPrograms = await _gymProgramService.GetMyPrograms(userId);

            return Ok(gymPrograms);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProgramById(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            var program = await _gymProgramService.GetProgramById(id, userId);
            if (program == null) return NotFound();
            return Ok(program);
        }

        [Authorize]
        [HttpPut("program/{id}")]
        public async Task<IActionResult> EditProgramNameById(int id, EditProgramNameDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            try
            {
                await _gymProgramService.EditProgramNameById(id, userId, dto);
                return Ok();
            } 
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPut("workout/{id}")]
        public async Task<IActionResult> EditWorkoutNameById(int id, EditWorkoutNameDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");

            var userId = int.Parse(userIdClaim);

            try
            {
                await _gymProgramService.EditWorkoutNameById(id, userId, dto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok();
        }

        [Authorize]
        [HttpPut("exercise/{id}")]
        public async Task<IActionResult> EditWorkoutExercise(int id, EditWorkoutExerciseDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");
            var userId = int.Parse(userIdClaim);

            try
            {
                var workoutExercise = await _gymProgramService.EditWorkoutExercise(id, userId, dto);
                return Ok(workoutExercise);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [Authorize]
        [HttpPost("workout/{workoutId}/exercise")]
        public async Task<IActionResult> AddExerciseToWorkout(int workoutId, AddWorkoutExerciseDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");
            var userId = int.Parse(userIdClaim);

            try
            {
                var addNewExercise = await _gymProgramService.AddExerciseToWorkout(workoutId, userId, dto);
                return Ok(addNewExercise);
            }
            catch (Exception ex)
            {
               return NotFound(ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("exercise/{id}")]
        public async Task<IActionResult> DeleteExerciseFromWorkout(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");
            var userId = int.Parse(userIdClaim);

            try
            {
                await _gymProgramService.DeleteExerciseFromWorkout(id, userId);
                return Ok();
            }
            catch(Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [Authorize]
        [HttpPost("{programId}/workout")]
        public async Task<IActionResult> AddWorkoutToProgram(int programId, AddWorkoutDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");
            var userId = int.Parse(userIdClaim);

            try
            {
                await _gymProgramService.AddWorkoutToProgram(programId, userId, dto);
                return Ok();
            }
            catch(Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("workout/{id}")]
        public async Task<IActionResult> DeleteWorkout(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("User ID claim saknas");
            var userId = int.Parse(userIdClaim);

            try
            {
                await _gymProgramService.DeleteWorkout(id, userId);
                return Ok();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProgram(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            var userId = int.Parse(userIdClaim);

            try
            {
                await _gymProgramService.DeleteProgram(id, userId);
                return Ok();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // alla ska nå denna så ej authorize, detta ska ba va en global lista för alla
        [HttpGet("exercises")]
        public async Task<IActionResult> GetAllExercises()
        {
            var exercises = await _gymProgramService.GetAllExercises();
            return Ok(exercises);
        }
    }
}
