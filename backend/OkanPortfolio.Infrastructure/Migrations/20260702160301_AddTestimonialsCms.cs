using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OkanPortfolio.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTestimonialsCms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Testimonials",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    Company = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    Rating = table.Column<decimal>(type: "decimal(3,1)", nullable: false),
                    IsApproved = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Testimonials", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TestimonialTranslations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TestimonialId = table.Column<int>(type: "int", nullable: false),
                    LanguageCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestimonialTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TestimonialTranslations_Testimonials_TestimonialId",
                        column: x => x.TestimonialId,
                        principalTable: "Testimonials",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Testimonials_DisplayOrder",
                table: "Testimonials",
                column: "DisplayOrder");

            migrationBuilder.CreateIndex(
                name: "IX_Testimonials_IsActive",
                table: "Testimonials",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Testimonials_IsApproved",
                table: "Testimonials",
                column: "IsApproved");

            migrationBuilder.CreateIndex(
                name: "IX_TestimonialTranslations_TestimonialId_LanguageCode",
                table: "TestimonialTranslations",
                columns: new[] { "TestimonialId", "LanguageCode" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TestimonialTranslations");

            migrationBuilder.DropTable(
                name: "Testimonials");
        }
    }
}
