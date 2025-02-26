using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace demo.Migrations
{
    /// <inheritdoc />
    public partial class i : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Competitions",
                columns: table => new
                {
                    CompetitionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Rules = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AwardsDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Competitions", x => x.CompetitionId);
                });

            migrationBuilder.CreateTable(
                name: "Exhibitions",
                columns: table => new
                {
                    ExhibitionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exhibitions", x => x.ExhibitionId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ProfileImage = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Awards",
                columns: table => new
                {
                    AwardId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompetitionId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    AwardTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    AwardDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateAwarded = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PrizeMoney = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Awards", x => x.AwardId);
                    table.ForeignKey(
                        name: "FK_Awards_Competitions_CompetitionId",
                        column: x => x.CompetitionId,
                        principalTable: "Competitions",
                        principalColumn: "CompetitionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Awards_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Submissions",
                columns: table => new
                {
                    SubmissionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CompetitionId = table.Column<int>(type: "int", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SubmitDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Submissions", x => x.SubmissionId);
                    table.ForeignKey(
                        name: "FK_Submissions_Competitions_CompetitionId",
                        column: x => x.CompetitionId,
                        principalTable: "Competitions",
                        principalColumn: "CompetitionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Submissions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Evaluations",
                columns: table => new
                {
                    EvaluationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubmissionId = table.Column<int>(type: "int", nullable: false),
                    StaffId = table.Column<int>(type: "int", nullable: false),
                    Score = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EvaluationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Evaluations", x => x.EvaluationId);
                    table.ForeignKey(
                        name: "FK_Evaluations_Submissions_SubmissionId",
                        column: x => x.SubmissionId,
                        principalTable: "Submissions",
                        principalColumn: "SubmissionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Evaluations_Users_StaffId",
                        column: x => x.StaffId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ExhibitionSubmissions",
                columns: table => new
                {
                    ExhibitionSubmissionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExhibitionId = table.Column<int>(type: "int", nullable: false),
                    SubmissionId = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: "Available"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExhibitionSubmissions", x => x.ExhibitionSubmissionId);
                    table.ForeignKey(
                        name: "FK_ExhibitionSubmissions_Exhibitions_ExhibitionId",
                        column: x => x.ExhibitionId,
                        principalTable: "Exhibitions",
                        principalColumn: "ExhibitionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExhibitionSubmissions_Submissions_SubmissionId",
                        column: x => x.SubmissionId,
                        principalTable: "Submissions",
                        principalColumn: "SubmissionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Sales",
                columns: table => new
                {
                    SaleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExhibitionSubmissionId = table.Column<int>(type: "int", nullable: false),
                    Buyer = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    SoldPrice = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    SoldDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PaymentStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sales", x => x.SaleId);
                    table.ForeignKey(
                        name: "FK_Sales_ExhibitionSubmissions_ExhibitionSubmissionId",
                        column: x => x.ExhibitionSubmissionId,
                        principalTable: "ExhibitionSubmissions",
                        principalColumn: "ExhibitionSubmissionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Competitions",
                columns: new[] { "CompetitionId", "AwardsDescription", "CreatedAt", "CreatedBy", "Description", "EndDate", "Image", "Rules", "StartDate", "Status", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, null, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, new DateTime(2023, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "comp1.png", null, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "U", "Competition 1", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, null, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, null, new DateTime(2023, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "comp2.png", null, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "O", "Competition 2", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "Exhibitions",
                columns: new[] { "ExhibitionId", "CreatedAt", "Date", "Description", "Name", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Exhibition 1", "U", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Exhibition 2", "O", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "CreatedAt", "Email", "Name", "Password", "ProfileImage", "Role", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@gmail.com", "Admin User", "$2a$12$p6SajsJcQBaDyh2eMg54huGoVjNJxUaiCcDa81dWifXKnAlBbZoVa", "admin.png", "ADMIN", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "staff@gmail.com", "Staff User", "$2a$12$p6SajsJcQBaDyh2eMg54huGoVjNJxUaiCcDa81dWifXKnAlBbZoVa", "staff.png", "STAFF", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 3, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "manager@gmail.com", "Manager User", "$2a$12$p6SajsJcQBaDyh2eMg54huGoVjNJxUaiCcDa81dWifXKnAlBbZoVa", "staff.png", "MANAGER", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 4, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "student@gmail.com", "Student User", "$2a$12$p6SajsJcQBaDyh2eMg54huGoVjNJxUaiCcDa81dWifXKnAlBbZoVa", "staff.png", "STUDENT", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "Awards",
                columns: new[] { "AwardId", "AwardDescription", "AwardTitle", "CompetitionId", "CreatedAt", "DateAwarded", "PrizeMoney", "UpdatedAt", "UserId" },
                values: new object[,]
                {
                    { 1, null, "Best Design", 1, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1000.00m, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1 },
                    { 2, null, "Best Innovation", 2, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1500.00m, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 2 }
                });

            migrationBuilder.InsertData(
                table: "Submissions",
                columns: new[] { "SubmissionId", "CompetitionId", "CreatedAt", "Description", "FilePath", "Status", "SubmitDate", "Title", "UpdatedAt", "UserId" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "file1.pdf", "P", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Submission 1", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1 },
                    { 2, 2, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "file2.pdf", "A", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Submission 2", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 2 }
                });

            migrationBuilder.InsertData(
                table: "Evaluations",
                columns: new[] { "EvaluationId", "CreatedAt", "EvaluationDate", "Remarks", "Score", "StaffId", "Status", "SubmissionId", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, 85, 1, "P", 1, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, 90, 2, "R", 2, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "ExhibitionSubmissions",
                columns: new[] { "ExhibitionSubmissionId", "CreatedAt", "ExhibitionId", "Price", "Status", "SubmissionId", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, 0m, "A", 1, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 0m, "S", 2, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.InsertData(
                table: "Sales",
                columns: new[] { "SaleId", "Buyer", "CreatedAt", "ExhibitionSubmissionId", "PaymentStatus", "SoldDate", "SoldPrice", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "Buyer 1", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "P", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 500.00m, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, "Buyer 2", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "R", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 750.00m, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Awards_CompetitionId",
                table: "Awards",
                column: "CompetitionId");

            migrationBuilder.CreateIndex(
                name: "IX_Awards_UserId",
                table: "Awards",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Evaluations_StaffId",
                table: "Evaluations",
                column: "StaffId");

            migrationBuilder.CreateIndex(
                name: "IX_Evaluations_SubmissionId",
                table: "Evaluations",
                column: "SubmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_ExhibitionSubmissions_ExhibitionId",
                table: "ExhibitionSubmissions",
                column: "ExhibitionId");

            migrationBuilder.CreateIndex(
                name: "IX_ExhibitionSubmissions_SubmissionId",
                table: "ExhibitionSubmissions",
                column: "SubmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_Sales_ExhibitionSubmissionId",
                table: "Sales",
                column: "ExhibitionSubmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_CompetitionId",
                table: "Submissions",
                column: "CompetitionId");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_UserId",
                table: "Submissions",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Awards");

            migrationBuilder.DropTable(
                name: "Evaluations");

            migrationBuilder.DropTable(
                name: "Sales");

            migrationBuilder.DropTable(
                name: "ExhibitionSubmissions");

            migrationBuilder.DropTable(
                name: "Exhibitions");

            migrationBuilder.DropTable(
                name: "Submissions");

            migrationBuilder.DropTable(
                name: "Competitions");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
