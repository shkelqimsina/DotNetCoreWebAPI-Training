using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Mungesat_shkolla.Models;

namespace Mungesat_shkolla.Data
{
    public class MungesatDbContext : IdentityDbContext<Kujdestari, IdentityRole<int>, int>
    {
        public MungesatDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Detyrojmë emrat e tabelave Identity të përputhen me DB (tabela është Kujdestari, jo AspNetUsers)
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (entityType.ClrType == typeof(Kujdestari))
                    entityType.SetTableName("Kujdestari");
                else if (entityType.ClrType == typeof(IdentityRole<int>))
                {
                    entityType.SetTableName("Roles");
                    entityType.FindProperty("Id")?.SetValueGenerationStrategy(Microsoft.EntityFrameworkCore.Metadata.SqlServerValueGenerationStrategy.IdentityColumn);
                }
                else if (entityType.ClrType == typeof(IdentityUserRole<int>))
                    entityType.SetTableName("UserRoles");
                else if (entityType.ClrType == typeof(IdentityUserClaim<int>))
                    entityType.SetTableName("UserClaims");
                else if (entityType.ClrType == typeof(IdentityUserLogin<int>))
                    entityType.SetTableName("UserLogins");
                else if (entityType.ClrType == typeof(IdentityRoleClaim<int>))
                    entityType.SetTableName("RoleClaims");
                else if (entityType.ClrType == typeof(IdentityUserToken<int>))
                    entityType.SetTableName("UserTokens");
            }

            modelBuilder.Entity<Klasat>()
                .HasOne(k => k.Kujdestari)
                .WithOne(kj => kj.Klasat)
                .HasForeignKey<Klasat>(k => k.KujdestariId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        public DbSet<Klasat> Klasat { get; set; }
        public DbSet<KlasaLenda> klasaLenda { get; set; }
        public DbSet<Kujdestari> kujdestari { get; set; }
        public DbSet<Lenda> lenda { get; set; }
        public DbSet<Mungesa> mungesa { get; set; }
        public DbSet<Nxenesi> nxenesi { get; set; }
    }
}
