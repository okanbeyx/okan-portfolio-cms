using Microsoft.EntityFrameworkCore;
using OkanPortfolio.Domain.Entities;

namespace OkanPortfolio.Infrastructure.Data;

public class PortfolioDbContext : DbContext
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options)
        : base(options)
    {
    }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectTranslation> ProjectTranslations => Set<ProjectTranslation>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<ProjectImage> ProjectImages => Set<ProjectImage>();
    public DbSet<EducationItem> EducationItems => Set<EducationItem>();
    public DbSet<EducationTranslation> EducationTranslations => Set<EducationTranslation>();
    public DbSet<HeroContent> HeroContents => Set<HeroContent>();
    public DbSet<HeroTranslation> HeroTranslations => Set<HeroTranslation>();
    public DbSet<AboutContent> AboutContents => Set<AboutContent>();
    public DbSet<AboutTranslation> AboutTranslations => Set<AboutTranslation>();
    public DbSet<AboutFocusArea> AboutFocusAreas => Set<AboutFocusArea>();
    public DbSet<AboutFocusAreaTranslation> AboutFocusAreaTranslations => Set<AboutFocusAreaTranslation>();
    public DbSet<SkillGroup> SkillGroups => Set<SkillGroup>();
    public DbSet<SkillGroupTranslation> SkillGroupTranslations => Set<SkillGroupTranslation>();
    public DbSet<SkillItem> SkillItems => Set<SkillItem>();
    public DbSet<SiteTextItem> SiteTextItems => Set<SiteTextItem>();
    public DbSet<SiteTextTranslation> SiteTextTranslations => Set<SiteTextTranslation>();
    public DbSet<ContactItem> ContactItems => Set<ContactItem>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<TestimonialTranslation> TestimonialTranslations => Set<TestimonialTranslation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Project>(entity =>
        {
            entity.ToTable("Projects");

            entity.HasKey(p => p.Id);

            entity.Property(p => p.TitleTr)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(p => p.TitleEn)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(p => p.CategoryTr)
                .IsRequired()
                .HasMaxLength(120);

            entity.Property(p => p.CategoryEn)
                .IsRequired()
                .HasMaxLength(120);

            entity.Property(p => p.StatusTr)
                .IsRequired()
                .HasMaxLength(80);

            entity.Property(p => p.StatusEn)
                .IsRequired()
                .HasMaxLength(80);

            entity.Property(p => p.DescriptionTr)
                .IsRequired()
                .HasMaxLength(1000);

            entity.Property(p => p.DescriptionEn)
                .IsRequired()
                .HasMaxLength(1000);

            entity.Property(p => p.TechStack)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(p => p.GithubUrl)
                .HasMaxLength(500);

            entity.Property(p => p.LiveUrl)
                .HasMaxLength(500);

            entity.Property(p => p.ImageUrl)
                .HasMaxLength(500);

            entity.Property(p => p.IsActive)
                .HasDefaultValue(true);

            entity.Property(p => p.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
        });

        modelBuilder.Entity<ProjectTranslation>(entity =>
{
            entity.ToTable("ProjectTranslations");

            entity.HasKey(t => t.Id);

            entity.Property(t => t.LanguageCode)
                .IsRequired()
                .HasMaxLength(10);

            entity.Property(t => t.Title)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(t => t.Description)
                .IsRequired()
                .HasMaxLength(1000);

            entity.Property(t => t.Category)
                .IsRequired()
                .HasMaxLength(120);

            entity.Property(t => t.Status)
                .IsRequired()
                .HasMaxLength(80);

            entity.HasOne(t => t.Project)
                .WithMany(p => p.Translations)
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(t => new { t.ProjectId, t.LanguageCode })
                .IsUnique();
        });

        modelBuilder.Entity<AdminUser>(entity =>
        {
            entity.ToTable("AdminUsers");

            entity.HasKey(a => a.Id);

            entity.Property(a => a.FullName)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(a => a.UserName)
                .IsRequired()
                .HasMaxLength(80);

            entity.Property(a => a.Email)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(a => a.PasswordHash)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(a => a.IsActive)
                .HasDefaultValue(true);

            entity.Property(a => a.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.HasIndex(a => a.UserName)
                .IsUnique();

            entity.HasIndex(a => a.Email)
                .IsUnique();
        });

        modelBuilder.Entity<ProjectImage>(entity =>
        {
            entity.ToTable("ProjectImages");

            entity.HasKey(i => i.Id);

            entity.Property(i => i.ImageUrl)
                .IsRequired()
                .HasMaxLength(700);

            entity.Property(i => i.FileName)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(i => i.AltText)
                .HasMaxLength(200);

            entity.Property(i => i.IsCover)
                .IsRequired();

            entity.Property(i => i.DisplayOrder)
                .IsRequired();

            entity.Property(i => i.CreatedAt)
                .IsRequired();

            entity.HasOne(i => i.Project)
                .WithMany(p => p.Images)
                .HasForeignKey(i => i.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(i => i.ProjectId);
        });

        modelBuilder.Entity<EducationItem>(entity =>
{
    entity.HasKey(e => e.Id);

    entity.Property(e => e.StartYear)
        .IsRequired();

    entity.Property(e => e.EndYear)
        .IsRequired(false);

    entity.Property(e => e.IsCurrent)
        .IsRequired();

    entity.Property(e => e.IsActive)
        .IsRequired();

    entity.Property(e => e.DisplayOrder)
        .IsRequired();

    entity.Property(e => e.CreatedAt)
        .IsRequired();

    entity.HasMany(e => e.Translations)
        .WithOne(t => t.EducationItem)
        .HasForeignKey(t => t.EducationItemId)
        .OnDelete(DeleteBehavior.Cascade);
});

modelBuilder.Entity<EducationTranslation>(entity =>
{
    entity.HasKey(e => e.Id);

    entity.Property(e => e.LanguageCode)
        .HasMaxLength(10)
        .IsRequired();

    entity.Property(e => e.SchoolName)
        .HasMaxLength(150)
        .IsRequired();

    entity.Property(e => e.Department)
        .HasMaxLength(150)
        .IsRequired(false);

    entity.Property(e => e.Description)
        .HasMaxLength(1000)
        .IsRequired(false);

    entity.HasIndex(e => new { e.EducationItemId, e.LanguageCode })
        .IsUnique();
});

modelBuilder.Entity<AboutContent>(entity =>
{
    entity.ToTable("AboutContents");

    entity.HasKey(a => a.Id);

    entity.Property(a => a.IsActive)
        .IsRequired()
        .HasDefaultValue(true);

    entity.Property(a => a.CreatedAt)
        .IsRequired()
        .HasDefaultValueSql("GETUTCDATE()");

    entity.Property(a => a.UpdatedAt)
        .IsRequired(false);

    entity.HasMany(a => a.Translations)
        .WithOne(t => t.AboutContent)
        .HasForeignKey(t => t.AboutContentId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasMany(a => a.FocusAreas)
        .WithOne(f => f.AboutContent)
        .HasForeignKey(f => f.AboutContentId)
        .OnDelete(DeleteBehavior.Cascade);
});

modelBuilder.Entity<AboutTranslation>(entity =>
{
    entity.ToTable("AboutTranslations");

    entity.HasKey(a => a.Id);

    entity.Property(a => a.LanguageCode)
        .IsRequired()
        .HasMaxLength(10);

    entity.Property(a => a.Label)
        .IsRequired()
        .HasMaxLength(80);

    entity.Property(a => a.Title)
        .IsRequired()
        .HasMaxLength(180);

    entity.Property(a => a.Description)
        .IsRequired()
        .HasMaxLength(1000);

    entity.Property(a => a.Intro)
        .IsRequired()
        .HasMaxLength(2000);

    entity.HasIndex(a => new { a.AboutContentId, a.LanguageCode })
        .IsUnique();
});

modelBuilder.Entity<AboutFocusArea>(entity =>
{
    entity.ToTable("AboutFocusAreas");

    entity.HasKey(a => a.Id);

    entity.Property(a => a.IsActive)
        .IsRequired()
        .HasDefaultValue(true);

    entity.Property(a => a.DisplayOrder)
        .IsRequired();

    entity.Property(a => a.CreatedAt)
        .IsRequired()
        .HasDefaultValueSql("GETUTCDATE()");

    entity.HasMany(a => a.Translations)
        .WithOne(t => t.AboutFocusArea)
        .HasForeignKey(t => t.AboutFocusAreaId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasIndex(a => a.AboutContentId);
});

modelBuilder.Entity<AboutFocusAreaTranslation>(entity =>
{
    entity.ToTable("AboutFocusAreaTranslations");

    entity.HasKey(a => a.Id);

    entity.Property(a => a.LanguageCode)
        .IsRequired()
        .HasMaxLength(10);

    entity.Property(a => a.Title)
        .IsRequired()
        .HasMaxLength(150);

    entity.Property(a => a.Description)
        .IsRequired()
        .HasMaxLength(1000);

    entity.HasIndex(a => new { a.AboutFocusAreaId, a.LanguageCode })
        .IsUnique();
});

modelBuilder.Entity<SkillGroup>(entity =>
{
    entity.ToTable("SkillGroups");

    entity.HasKey(s => s.Id);

    entity.Property(s => s.IsActive)
        .IsRequired()
        .HasDefaultValue(true);

    entity.Property(s => s.DisplayOrder)
        .IsRequired();

    entity.Property(s => s.CreatedAt)
        .IsRequired()
        .HasDefaultValueSql("GETUTCDATE()");

    entity.Property(s => s.UpdatedAt)
        .IsRequired(false);

    entity.HasMany(s => s.Translations)
        .WithOne(t => t.SkillGroup)
        .HasForeignKey(t => t.SkillGroupId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasMany(s => s.Skills)
        .WithOne(i => i.SkillGroup)
        .HasForeignKey(i => i.SkillGroupId)
        .OnDelete(DeleteBehavior.Cascade);
});

modelBuilder.Entity<SkillGroupTranslation>(entity =>
{
    entity.ToTable("SkillGroupTranslations");

    entity.HasKey(s => s.Id);

    entity.Property(s => s.LanguageCode)
        .IsRequired()
        .HasMaxLength(10);

    entity.Property(s => s.Title)
        .IsRequired()
        .HasMaxLength(150);

    entity.Property(s => s.Description)
        .IsRequired()
        .HasMaxLength(1000);

    entity.HasIndex(s => new { s.SkillGroupId, s.LanguageCode })
        .IsUnique();
});

modelBuilder.Entity<SkillItem>(entity =>
{
    entity.ToTable("SkillItems");

    entity.HasKey(s => s.Id);

    entity.Property(s => s.Name)
        .IsRequired()
        .HasMaxLength(100);

    entity.Property(s => s.IsActive)
        .IsRequired()
        .HasDefaultValue(true);

    entity.Property(s => s.DisplayOrder)
        .IsRequired();

    entity.Property(s => s.CreatedAt)
        .IsRequired()
        .HasDefaultValueSql("GETUTCDATE()");

    entity.HasIndex(s => s.SkillGroupId);
});

modelBuilder.Entity<ContactItem>(entity =>
{
    entity.ToTable("ContactItems");

    entity.HasKey(c => c.Id);

    entity.Property(c => c.Type)
        .IsRequired()
        .HasMaxLength(50);

    entity.Property(c => c.Label)
        .IsRequired()
        .HasMaxLength(100);

    entity.Property(c => c.Value)
        .IsRequired()
        .HasMaxLength(300);

    entity.Property(c => c.Url)
        .IsRequired(false)
        .HasMaxLength(500);

    entity.Property(c => c.IconKey)
        .IsRequired(false)
        .HasMaxLength(80);

    entity.Property(c => c.IsActive)
        .IsRequired()
        .HasDefaultValue(true);

    entity.Property(c => c.DisplayOrder)
        .IsRequired();

    entity.Property(c => c.CreatedAt)
        .IsRequired()
        .HasDefaultValueSql("GETUTCDATE()");

    entity.Property(c => c.UpdatedAt)
        .IsRequired(false);

    entity.HasIndex(c => c.Type);

    entity.HasIndex(c => c.DisplayOrder);
});

modelBuilder.Entity<Testimonial>(entity =>
{
    entity.ToTable("Testimonials");

    entity.HasKey(t => t.Id);

    entity.Property(t => t.FullName)
        .IsRequired()
        .HasMaxLength(120);

    entity.Property(t => t.Title)
        .IsRequired(false)
        .HasMaxLength(120);

    entity.Property(t => t.Company)
        .IsRequired(false)
        .HasMaxLength(120);

    entity.Property(t => t.Rating)
        .IsRequired()
        .HasColumnType("decimal(3,1)");

    entity.Property(t => t.IsApproved)
        .IsRequired()
        .HasDefaultValue(false);

    entity.Property(t => t.IsActive)
        .IsRequired()
        .HasDefaultValue(true);

    entity.Property(t => t.DisplayOrder)
        .IsRequired();

    entity.Property(t => t.CreatedAt)
        .IsRequired()
        .HasDefaultValueSql("GETUTCDATE()");

    entity.Property(t => t.ApprovedAt)
        .IsRequired(false);

    entity.Property(t => t.UpdatedAt)
        .IsRequired(false);

    entity.HasMany(t => t.Translations)
        .WithOne(t => t.Testimonial)
        .HasForeignKey(t => t.TestimonialId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasIndex(t => t.IsApproved);

    entity.HasIndex(t => t.IsActive);

    entity.HasIndex(t => t.DisplayOrder);
});

modelBuilder.Entity<TestimonialTranslation>(entity =>
{
    entity.ToTable("TestimonialTranslations");

    entity.HasKey(t => t.Id);

    entity.Property(t => t.LanguageCode)
        .IsRequired()
        .HasMaxLength(10);

    entity.Property(t => t.Comment)
        .IsRequired()
        .HasMaxLength(1000);

    entity.HasIndex(t => new { t.TestimonialId, t.LanguageCode })
        .IsUnique();
});

modelBuilder.Entity<SiteTextItem>(entity =>
{
    entity.ToTable("SiteTextItems");

    entity.HasKey(s => s.Id);

    entity.Property(s => s.Key)
        .IsRequired()
        .HasMaxLength(120);

    entity.Property(s => s.GroupKey)
        .IsRequired()
        .HasMaxLength(80);

    entity.Property(s => s.Label)
        .IsRequired()
        .HasMaxLength(150);

    entity.Property(s => s.IsActive)
        .IsRequired()
        .HasDefaultValue(true);

    entity.Property(s => s.DisplayOrder)
        .IsRequired();

    entity.Property(s => s.CreatedAt)
        .IsRequired()
        .HasDefaultValueSql("GETUTCDATE()");

    entity.Property(s => s.UpdatedAt)
        .IsRequired(false);

    entity.HasMany(s => s.Translations)
        .WithOne(t => t.SiteTextItem)
        .HasForeignKey(t => t.SiteTextItemId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasIndex(s => s.Key)
        .IsUnique();

    entity.HasIndex(s => s.GroupKey);
});

modelBuilder.Entity<SiteTextTranslation>(entity =>
{
    entity.ToTable("SiteTextTranslations");

    entity.HasKey(s => s.Id);

    entity.Property(s => s.LanguageCode)
        .IsRequired()
        .HasMaxLength(10);

    entity.Property(s => s.Value)
        .IsRequired()
        .HasMaxLength(2000);

    entity.HasIndex(s => new { s.SiteTextItemId, s.LanguageCode })
        .IsUnique();
});

modelBuilder.Entity<HeroContent>(entity =>
{
    entity.ToTable("HeroContents");

    entity.HasKey(h => h.Id);

    entity.Property(h => h.PrimaryButtonUrl)
        .IsRequired()
        .HasMaxLength(500);

    entity.Property(h => h.SecondaryButtonUrl)
        .IsRequired()
        .HasMaxLength(500);

    entity.Property(h => h.IsActive)
        .IsRequired()
        .HasDefaultValue(true);

    entity.Property(h => h.CreatedAt)
        .IsRequired()
        .HasDefaultValueSql("GETUTCDATE()");

    entity.Property(h => h.UpdatedAt)
        .IsRequired(false);

    entity.HasMany(h => h.Translations)
        .WithOne(t => t.HeroContent)
        .HasForeignKey(t => t.HeroContentId)
        .OnDelete(DeleteBehavior.Cascade);
});


modelBuilder.Entity<HeroTranslation>(entity =>
{
    entity.ToTable("HeroTranslations");

    entity.HasKey(h => h.Id);

    entity.Property(h => h.LanguageCode)
        .IsRequired()
        .HasMaxLength(10);

    entity.Property(h => h.Label)
        .IsRequired()
        .HasMaxLength(80);

    entity.Property(h => h.Title)
        .IsRequired()
        .HasMaxLength(150);

    entity.Property(h => h.Subtitle)
        .IsRequired()
        .HasMaxLength(500);

    entity.Property(h => h.PrimaryButtonText)
        .IsRequired()
        .HasMaxLength(80);

    entity.Property(h => h.SecondaryButtonText)
        .IsRequired()
        .HasMaxLength(80);

    entity.HasOne(h => h.HeroContent)
        .WithMany(c => c.Translations)
        .HasForeignKey(h => h.HeroContentId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasIndex(h => new { h.HeroContentId, h.LanguageCode })
        .IsUnique();
});

        
    }
    
}
