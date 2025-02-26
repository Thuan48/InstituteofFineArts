using Microsoft.EntityFrameworkCore;

namespace demo.Model
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Competitions> Competitions { get; set; }
        public DbSet<Submissions> Submissions { get; set; }
        public DbSet<Evaluations> Evaluations { get; set; }
        public DbSet<Awards> Awards { get; set; }
        public DbSet<Exhibitions> Exhibitions { get; set; }
        public DbSet<ExhibitionSubmissions> ExhibitionSubmissions { get; set; }
        public DbSet<Sales> Sales { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Users>(options =>
            {
                options.HasKey(u => u.UserId);
                options.Property(u => u.CreatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(u => u.UpdatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(u => u.Email).IsRequired().HasMaxLength(255);
                options.Property(u => u.Role).IsRequired();
                options.Property(u => u.ProfileImage).HasMaxLength(255);
                options.HasData(
                    new Users { UserId = 1, Name = "Admin User", Email = "admin@gmail.com", Role = "ADMIN", Password = "$2a$11$uQV1ZCpc0kirSkN5WHWPYOXwNSQUl31N0AD6zArCLQNWTjpULJqC6", ProfileImage = "admin.png", CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) },
                    new Users { UserId = 2, Name = "Staff User", Email = "staff@gmail.com", Role = "STAFF", Password = "$2a$11$uQV1ZCpc0kirSkN5WHWPYOXwNSQUl31N0AD6zArCLQNWTjpULJqC6", ProfileImage = "staff.png", CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) },
                    new Users { UserId = 3, Name = "Manager User", Email = "manager@gmail.com", Role = "MANAGER", Password = "$2a$11$uQV1ZCpc0kirSkN5WHWPYOXwNSQUl31N0AD6zArCLQNWTjpULJqC6", ProfileImage = "staff.png", CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) },
                    new Users { UserId = 4, Name = "Student User", Email = "student@gmail.com", Role = "STUDENT", Password = "$2a$11$uQV1ZCpc0kirSkN5WHWPYOXwNSQUl31N0AD6zArCLQNWTjpULJqC6", ProfileImage = "staff.png", CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) }
                    // ...add 8 more users...
                );
            });

            modelBuilder.Entity<Competitions>(options =>
            {
                options.HasKey(c => c.CompetitionId);
                options.Property(c => c.CreatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(c => c.UpdatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(c => c.Status).IsRequired();
                // New fields
                options.Property(c => c.CreatedBy).IsRequired();
                options.Property(c => c.Image).HasMaxLength(255);
                options.HasData(
                    new Competitions { CompetitionId = 1, Title = "Competition 1", Status = "U", StartDate = new DateTime(2023, 1, 1), EndDate = new DateTime(2023, 2, 1), CreatedBy = 1, Image = "comp1.png", CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) },
                    new Competitions { CompetitionId = 2, Title = "Competition 2", Status = "O", StartDate = new DateTime(2023, 1, 1), EndDate = new DateTime(2023, 2, 1), CreatedBy = 2, Image = "comp2.png", CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) }
                    // ...add 8 more competitions...
                );
            });

            modelBuilder.Entity<Submissions>(options =>
            {
                options.HasKey(s => s.SubmissionId);
                options.HasOne(s => s.User).WithMany().HasForeignKey(s => s.UserId);
                options.HasOne(s => s.Competition).WithMany().HasForeignKey(s => s.CompetitionId);
                options.Property(s => s.CreatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(s => s.UpdatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(s => s.Status).IsRequired();
                options.HasData(
                    new Submissions { SubmissionId = 1, UserId = 1, CompetitionId = 1, FilePath = "file1.pdf", Title = "Submission 1", Status = "P", SubmitDate = new DateTime(2023, 1, 1), CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) },
                    new Submissions { SubmissionId = 2, UserId = 2, CompetitionId = 2, FilePath = "file2.pdf", Title = "Submission 2", Status = "A", SubmitDate = new DateTime(2023, 1, 1), CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) }
                    // ...add 8 more submissions...
                );
            });

            modelBuilder.Entity<Evaluations>(options =>
            {
                options.HasKey(e => e.EvaluationId);
                options.HasOne(e => e.Submission).WithMany().HasForeignKey(e => e.SubmissionId);
                options.HasOne(e => e.Staff)
                       .WithMany()
                       .HasForeignKey(e => e.StaffId)
                       .OnDelete(DeleteBehavior.Restrict);
                options.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(e => e.Status).IsRequired();
                options.HasData(
                    new Evaluations { EvaluationId = 1, SubmissionId = 1, StaffId = 1, Score = 85, Status = "P", EvaluationDate = new DateTime(2023, 1, 1), CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) },
                    new Evaluations { EvaluationId = 2, SubmissionId = 2, StaffId = 2, Score = 90, Status = "R", EvaluationDate = new DateTime(2023, 1, 1), CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) }
                    // ...add 8 more evaluations...
                );
            });

            modelBuilder.Entity<Awards>(options =>
            {
                options.HasKey(a => a.AwardId);
                options.HasOne(a => a.Competition).WithMany().HasForeignKey(a => a.CompetitionId);
                options.HasOne(a => a.User).WithMany().HasForeignKey(a => a.UserId);
                options.Property(a => a.CreatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(a => a.UpdatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(a => a.PrizeMoney).HasColumnType("decimal(10,2)");
                options.HasData(
                    new Awards { AwardId = 1, CompetitionId = 1, UserId = 1, AwardTitle = "Best Design", PrizeMoney = 1000.00m, DateAwarded = new DateTime(2023, 1, 1), CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) },
                    new Awards { AwardId = 2, CompetitionId = 2, UserId = 2, AwardTitle = "Best Innovation", PrizeMoney = 1500.00m, DateAwarded = new DateTime(2023, 1, 1), CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) }
                    // ...add 8 more awards...
                );
            });

            modelBuilder.Entity<Exhibitions>(options =>
            {
                options.HasKey(e => e.ExhibitionId);
                options.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(e => e.UpdatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(e => e.Status).IsRequired();
                options.HasData(
                    new Exhibitions { ExhibitionId = 1, Name = "Exhibition 1", Status = "U", Date = new DateTime(2023, 1, 1), CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) },
                    new Exhibitions { ExhibitionId = 2, Name = "Exhibition 2", Status = "O", Date = new DateTime(2023, 1, 1), CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) }
                    // ...add 8 more exhibitions...
                );
            });

            modelBuilder.Entity<ExhibitionSubmissions>(options =>
            {
                options.HasKey(es => es.ExhibitionSubmissionId);
                options.HasOne(es => es.Exhibition).WithMany().HasForeignKey(es => es.ExhibitionId);
                options.HasOne(es => es.Submission).WithMany().HasForeignKey(es => es.SubmissionId);
                options.Property(es => es.CreatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(es => es.UpdatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(es => es.Price).HasColumnType("decimal(10,2)");
                options.Property(es => es.Status).IsRequired().HasDefaultValue("Available");
                options.HasData(
                    new ExhibitionSubmissions { ExhibitionSubmissionId = 1, ExhibitionId = 1, SubmissionId = 1, Status = "A", CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) },
                    new ExhibitionSubmissions { ExhibitionSubmissionId = 2, ExhibitionId = 2, SubmissionId = 2, Status = "S", CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) }
                    // ...add 8 more exhibition submissions...
                );
            });

            modelBuilder.Entity<Sales>(options =>
            {
                options.HasKey(s => s.SaleId);
                options.HasOne(s => s.ExhibitionSubmission).WithMany().HasForeignKey(s => s.ExhibitionSubmissionId);
                options.Property(s => s.CreatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(s => s.UpdatedAt).HasDefaultValueSql("GETDATE()");
                options.Property(s => s.SoldPrice).HasColumnType("decimal(10,2)");
                options.Property(s => s.PaymentStatus).IsRequired();
                options.HasData(
                    new Sales { SaleId = 1, ExhibitionSubmissionId = 1, Buyer = "Buyer 1", SoldPrice = 500.00m, SoldDate = new DateTime(2023, 1, 1), PaymentStatus = "P", CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) },
                    new Sales { SaleId = 2, ExhibitionSubmissionId = 2, Buyer = "Buyer 2", SoldPrice = 750.00m, SoldDate = new DateTime(2023, 1, 1), PaymentStatus = "R", CreatedAt = new DateTime(2023, 1, 1), UpdatedAt = new DateTime(2023, 1, 1) }
                    // ...add 8 more sales...
                );
            });
        }
    }
}