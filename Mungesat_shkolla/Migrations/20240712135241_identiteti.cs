using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mungesat_shkolla.Migrations
{
    /// <inheritdoc />
    public partial class identiteti : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Klasat_kujdestari_KujdestariId",
                table: "Klasat");

            migrationBuilder.DropPrimaryKey(
                name: "PK_kujdestari",
                table: "kujdestari");

            migrationBuilder.RenameTable(
                name: "kujdestari",
                newName: "Kujdestari");

            migrationBuilder.AddColumn<int>(
                name: "AccessFailedCount",
                table: "Kujdestari",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                table: "Kujdestari",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EmailConfirmed",
                table: "Kujdestari",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "LockoutEnabled",
                table: "Kujdestari",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LockoutEnd",
                table: "Kujdestari",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NormalizedEmail",
                table: "Kujdestari",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NormalizedUserName",
                table: "Kujdestari",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Kujdestari",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Kujdestari",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "PhoneNumberConfirmed",
                table: "Kujdestari",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SecurityStamp",
                table: "Kujdestari",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TwoFactorEnabled",
                table: "Kujdestari",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UserName",
                table: "Kujdestari",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Kujdestari",
                table: "Kujdestari",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "RoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaims", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClaims", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogins", x => new { x.LoginProvider, x.ProviderKey });
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Klasat_Kujdestari_KujdestariId",
                table: "Klasat",
                column: "KujdestariId",
                principalTable: "Kujdestari",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Klasat_Kujdestari_KujdestariId",
                table: "Klasat");

            migrationBuilder.DropTable(
                name: "RoleClaims");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "UserClaims");

            migrationBuilder.DropTable(
                name: "UserLogins");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "UserTokens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Kujdestari",
                table: "Kujdestari");

            migrationBuilder.DropColumn(
                name: "AccessFailedCount",
                table: "Kujdestari");

            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "Kujdestari");

            migrationBuilder.DropColumn(
                name: "EmailConfirmed",
                table: "Kujdestari");

            migrationBuilder.DropColumn(
                name: "LockoutEnabled",
                table: "Kujdestari");

            migrationBuilder.DropColumn(
                name: "LockoutEnd",
                table: "Kujdestari");

            migrationBuilder.DropColumn(
                name: "NormalizedEmail",
                table: "Kujdestari");

            migrationBuilder.DropColumn(
                name: "NormalizedUserName",
                table: "Kujdestari");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Kujdestari");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Kujdestari");

            migrationBuilder.DropColumn(
                name: "PhoneNumberConfirmed",
                table: "Kujdestari");

            migrationBuilder.DropColumn(
                name: "SecurityStamp",
                table: "Kujdestari");

            migrationBuilder.DropColumn(
                name: "TwoFactorEnabled",
                table: "Kujdestari");

            migrationBuilder.DropColumn(
                name: "UserName",
                table: "Kujdestari");

            migrationBuilder.RenameTable(
                name: "Kujdestari",
                newName: "kujdestari");

            migrationBuilder.AddPrimaryKey(
                name: "PK_kujdestari",
                table: "kujdestari",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Klasat_kujdestari_KujdestariId",
                table: "Klasat",
                column: "KujdestariId",
                principalTable: "kujdestari",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
