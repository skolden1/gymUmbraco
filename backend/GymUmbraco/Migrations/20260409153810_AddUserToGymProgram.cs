using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymUmbraco.Migrations
{
    /// <inheritdoc />
    public partial class AddUserToGymProgram : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "GymPrograms",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_GymPrograms_UserId",
                table: "GymPrograms",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_GymPrograms_Users_UserId",
                table: "GymPrograms",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GymPrograms_Users_UserId",
                table: "GymPrograms");

            migrationBuilder.DropIndex(
                name: "IX_GymPrograms_UserId",
                table: "GymPrograms");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "GymPrograms");
        }
    }
}
