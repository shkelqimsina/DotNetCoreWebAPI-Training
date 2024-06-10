using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Data;

public class MungesatDbDataContext : DbContext
{
    public MungesatDbDataContext(DbContextOptions<MungesatDbDataContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Nxenesi>()
            .HasOne(n => n.Klasa)
            .WithMany(k => k.Nxenesit)
            .HasForeignKey(n => n.KlasaId);

        modelBuilder.Entity<Klasa>()
            .HasOne(k => k.Kujdestari)
            .WithOne(k => k.Klasa)
            .HasForeignKey<Kujdestari>(k => k.KlasaId);
        
        modelBuilder.Entity<Kujdestari>()
            .HasOne(k => k.Klasa)
            .WithOne(k => k.Kujdestari)
            .HasForeignKey<Klasa>(k => k.KujdestariId);

        modelBuilder.Entity<KlasaLenda>()
            .HasOne(kl => kl.Klasa)
            .WithMany(k => k.KlasaLenda)
            .HasForeignKey(kl => kl.KlasaId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<KlasaLenda>()
            .HasOne(kl => kl.Lenda)
            .WithMany(l => l.KlasaLenda)
            .HasForeignKey(kl => kl.LendaId)
            .OnDelete(DeleteBehavior.Restrict);

    }

    public DbSet<Nxenesi> Nxenesit { get; set; }
    public DbSet<Klasa> Klasat { get; set; }
    public DbSet<Kujdestari> Kujdestaret { get; set; }
    public DbSet<Lenda> Lendet { get; set; }
    public DbSet<KlasaLenda> KlasaLendet { get; set; }
    public DbSet<Mungesa> Mungesat { get; set; }
}