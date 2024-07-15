using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Mungesat_shkolla.Models;

namespace Mungesat_shkolla.Data
{
    public class MungesatDbContext : IdentityDbContext<Kujdestari>

  {
    public MungesatDbContext(DbContextOptions options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

      modelBuilder.Entity<IdentityUserRole<string>>()
          .HasKey(p => new { p.UserId, p.RoleId });

      modelBuilder.Entity<IdentityUserLogin<string>>()
          .HasKey(p => new { p.LoginProvider, p.ProviderKey });

      modelBuilder.Entity<IdentityUserToken<string>>()
          .HasKey(p => new { p.UserId, p.LoginProvider, p.Name });

        }

    public DbSet<Klasat> Klasat { get; set; }
        public DbSet<KlasaLenda> klasaLenda { get; set; }
        public DbSet<Kujdestari> kujdestari { get; set; }
        public DbSet<Lenda> lenda { get; set; }
        public DbSet<Mungesa> mungesa { get; set; }
        public DbSet<Nxenesi> nxenesi { get; set; }

    }
}
