using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OkanPortfolio.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSiteTextsCms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SiteTextItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    GroupKey = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Label = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteTextItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SiteTextTranslations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SiteTextItemId = table.Column<int>(type: "int", nullable: false),
                    LanguageCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Value = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteTextTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SiteTextTranslations_SiteTextItems_SiteTextItemId",
                        column: x => x.SiteTextItemId,
                        principalTable: "SiteTextItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SiteTextItems_GroupKey",
                table: "SiteTextItems",
                column: "GroupKey");

            migrationBuilder.CreateIndex(
                name: "IX_SiteTextItems_Key",
                table: "SiteTextItems",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SiteTextTranslations_SiteTextItemId_LanguageCode",
                table: "SiteTextTranslations",
                columns: new[] { "SiteTextItemId", "LanguageCode" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SiteTextTranslations");

            migrationBuilder.DropTable(
                name: "SiteTextItems");
        }
    }
}
