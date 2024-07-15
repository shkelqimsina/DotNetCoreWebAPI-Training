using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mungesat_shkolla.Migrations
{
    /// <inheritdoc />
    public partial class migrimiiri : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KlasatId",
                table: "kujdestari");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "KlasatId",
                table: "kujdestari",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
