using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mungesat_shkolla.Migrations
{
    /// <inheritdoc />
    public partial class AddOretMeArsyje : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OretMeArsyje",
                table: "mungesa",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OretMeArsyje",
                table: "mungesa");
        }
    }
}
