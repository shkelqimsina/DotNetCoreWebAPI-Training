using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mungesat_shkolla.Migrations
{
    /// <inheritdoc />
    public partial class AddMeArsyjeToMungesa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "MeArsyje",
                table: "mungesa",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MeArsyje",
                table: "mungesa");
        }
    }
}
