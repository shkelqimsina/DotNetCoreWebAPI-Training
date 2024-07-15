using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mungesat_shkolla.Migrations
{
    /// <inheritdoc />
    public partial class MigrimiDyte : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "kujdestari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Emri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Mbiemri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KlasatId = table.Column<int>(type: "int", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_kujdestari", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "lenda",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Emri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Viti = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lenda", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Klasat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Emri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KujdestariId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Klasat", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Klasat_kujdestari_KujdestariId",
                        column: x => x.KujdestariId,
                        principalTable: "kujdestari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "klasaLenda",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ora = table.Column<int>(type: "int", nullable: false),
                    Dita = table.Column<int>(type: "int", nullable: false),
                    KlasatId = table.Column<int>(type: "int", nullable: false),
                    LendaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_klasaLenda", x => x.Id);
                    table.ForeignKey(
                        name: "FK_klasaLenda_Klasat_KlasatId",
                        column: x => x.KlasatId,
                        principalTable: "Klasat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_klasaLenda_lenda_LendaId",
                        column: x => x.LendaId,
                        principalTable: "lenda",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "nxenesi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Emri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Mbiemri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ditelindja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Gjinia = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Prindi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KlasatId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nxenesi", x => x.Id);
                    table.ForeignKey(
                        name: "FK_nxenesi_Klasat_KlasatId",
                        column: x => x.KlasatId,
                        principalTable: "Klasat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "mungesa",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Data = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Arsyeja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Oret = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NxenesiId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mungesa", x => x.Id);
                    table.ForeignKey(
                        name: "FK_mungesa_nxenesi_NxenesiId",
                        column: x => x.NxenesiId,
                        principalTable: "nxenesi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_klasaLenda_KlasatId",
                table: "klasaLenda",
                column: "KlasatId");

            migrationBuilder.CreateIndex(
                name: "IX_klasaLenda_LendaId",
                table: "klasaLenda",
                column: "LendaId");

            migrationBuilder.CreateIndex(
                name: "IX_Klasat_KujdestariId",
                table: "Klasat",
                column: "KujdestariId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_mungesa_NxenesiId",
                table: "mungesa",
                column: "NxenesiId");

            migrationBuilder.CreateIndex(
                name: "IX_nxenesi_KlasatId",
                table: "nxenesi",
                column: "KlasatId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "klasaLenda");

            migrationBuilder.DropTable(
                name: "mungesa");

            migrationBuilder.DropTable(
                name: "lenda");

            migrationBuilder.DropTable(
                name: "nxenesi");

            migrationBuilder.DropTable(
                name: "Klasat");

            migrationBuilder.DropTable(
                name: "kujdestari");
        }
    }
}
