using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OkanPortfolio.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHeroContentCms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HeroContents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrimaryButtonUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    SecondaryButtonUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HeroContents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HeroTranslations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HeroContentId = table.Column<int>(type: "int", nullable: false),
                    LanguageCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Label = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Subtitle = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    PrimaryButtonText = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    SecondaryButtonText = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HeroTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HeroTranslations_HeroContents_HeroContentId",
                        column: x => x.HeroContentId,
                        principalTable: "HeroContents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HeroTranslations_HeroContentId_LanguageCode",
                table: "HeroTranslations",
                columns: new[] { "HeroContentId", "LanguageCode" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HeroTranslations");

            migrationBuilder.DropTable(
                name: "HeroContents");
        }
    }
}
