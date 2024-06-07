﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using api.Data;

#nullable disable

namespace api.Migrations
{
    [DbContext(typeof(MungesatDbDataContext))]
    partial class MungesatDbDataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("api.Models.Klasa", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Emri")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("KujdestariId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("KujdestariId")
                        .IsUnique();

                    b.ToTable("Klasat");
                });

            modelBuilder.Entity("api.Models.Kujdestari", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Emri")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("KlasaId")
                        .HasColumnType("int");

                    b.Property<string>("Mbiemri")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Kujdestaret");
                });

            modelBuilder.Entity("api.Models.Nxenesi", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Adresa")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Ditelindja")
                        .HasColumnType("datetime2");

                    b.Property<string>("Emri")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Gjinia")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("KlasaId")
                        .HasColumnType("int");

                    b.Property<string>("Mbiemri")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Prindi")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("KlasaId");

                    b.ToTable("Nxenesit");
                });

            modelBuilder.Entity("api.Models.Klasa", b =>
                {
                    b.HasOne("api.Models.Kujdestari", "Kujdestari")
                        .WithOne("Klasa")
                        .HasForeignKey("api.Models.Klasa", "KujdestariId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Kujdestari");
                });

            modelBuilder.Entity("api.Models.Nxenesi", b =>
                {
                    b.HasOne("api.Models.Klasa", "Klasa")
                        .WithMany("Nxenesit")
                        .HasForeignKey("KlasaId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Klasa");
                });

            modelBuilder.Entity("api.Models.Klasa", b =>
                {
                    b.Navigation("Nxenesit");
                });

            modelBuilder.Entity("api.Models.Kujdestari", b =>
                {
                    b.Navigation("Klasa")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
