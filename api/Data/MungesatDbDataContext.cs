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
    }

    public DbSet<Nxenesi> Nxenesit { get; set; }
    public DbSet<Klasa> Klasat { get; set; }
    public DbSet<Kujdestari> Kujdestaret { get; set; }
}