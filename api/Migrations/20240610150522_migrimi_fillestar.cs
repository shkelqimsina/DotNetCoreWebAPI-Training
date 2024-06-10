using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class migrimi_fillestar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                });

            migrationBuilder.CreateTable(
                name: "Kujdestaret",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Emri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Mbiemri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KlasaId = table.Column<int>(type: "int", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kujdestaret", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Kujdestaret_Klasat_KlasaId",
                        column: x => x.KlasaId,
                        principalTable: "Klasat",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Nxenesit",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Emri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Mbiemri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KlasaId = table.Column<int>(type: "int", nullable: false),
                    Ditelindja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Gjinia = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Prindi = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nxenesit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nxenesit_Klasat_KlasaId",
                        column: x => x.KlasaId,
                        principalTable: "Klasat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Lendet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Emri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KujdestariId = table.Column<int>(type: "int", nullable: false),
                    Viti = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lendet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lendet_Kujdestaret_KujdestariId",
                        column: x => x.KujdestariId,
                        principalTable: "Kujdestaret",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Mungesat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NxenesiId = table.Column<int>(type: "int", nullable: false),
                    Data = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Arsyeja = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KujdestariId = table.Column<int>(type: "int", nullable: false),
                    Oret = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mungesat", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Mungesat_Kujdestaret_KujdestariId",
                        column: x => x.KujdestariId,
                        principalTable: "Kujdestaret",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Mungesat_Nxenesit_NxenesiId",
                        column: x => x.NxenesiId,
                        principalTable: "Nxenesit",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KlasaLendet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KlasaId = table.Column<int>(type: "int", nullable: false),
                    LendaId = table.Column<int>(type: "int", nullable: false),
                    Ora = table.Column<int>(type: "int", nullable: false),
                    Dita = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KlasaLendet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KlasaLendet_Klasat_KlasaId",
                        column: x => x.KlasaId,
                        principalTable: "Klasat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_KlasaLendet_Lendet_LendaId",
                        column: x => x.LendaId,
                        principalTable: "Lendet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KlasaLendet_KlasaId",
                table: "KlasaLendet",
                column: "KlasaId");

            migrationBuilder.CreateIndex(
                name: "IX_KlasaLendet_LendaId",
                table: "KlasaLendet",
                column: "LendaId");

            migrationBuilder.CreateIndex(
                name: "IX_Kujdestaret_KlasaId",
                table: "Kujdestaret",
                column: "KlasaId",
                unique: true,
                filter: "[KlasaId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Lendet_KujdestariId",
                table: "Lendet",
                column: "KujdestariId");

            migrationBuilder.CreateIndex(
                name: "IX_Mungesat_KujdestariId",
                table: "Mungesat",
                column: "KujdestariId");

            migrationBuilder.CreateIndex(
                name: "IX_Mungesat_NxenesiId",
                table: "Mungesat",
                column: "NxenesiId");

            migrationBuilder.CreateIndex(
                name: "IX_Nxenesit_KlasaId",
                table: "Nxenesit",
                column: "KlasaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KlasaLendet");

            migrationBuilder.DropTable(
                name: "Mungesat");

            migrationBuilder.DropTable(
                name: "Lendet");

            migrationBuilder.DropTable(
                name: "Nxenesit");

            migrationBuilder.DropTable(
                name: "Kujdestaret");

            migrationBuilder.DropTable(
                name: "Klasat");
        }
    }
}
