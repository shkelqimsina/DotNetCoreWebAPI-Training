﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using api.Data;

#nullable disable

namespace api.Migrations
{
    [DbContext(typeof(MungesatDbDataContext))]
    [Migration("20240610150522_migrimi_fillestar")]
    partial class migrimi_fillestar
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
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

                    b.ToTable("Klasat");
                });

            modelBuilder.Entity("api.Models.KlasaLenda", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Dita")
                        .HasColumnType("int");

                    b.Property<int>("KlasaId")
                        .HasColumnType("int");

                    b.Property<int>("LendaId")
                        .HasColumnType("int");

                    b.Property<int>("Ora")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("KlasaId");

                    b.HasIndex("LendaId");

                    b.ToTable("KlasaLendet");
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

                    b.HasIndex("KlasaId")
                        .IsUnique()
                        .HasFilter("[KlasaId] IS NOT NULL");

                    b.ToTable("Kujdestaret");
                });

            modelBuilder.Entity("api.Models.Lenda", b =>
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

                    b.Property<int>("Viti")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("KujdestariId");

                    b.ToTable("Lendet");
                });

            modelBuilder.Entity("api.Models.Mungesa", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Arsyeja")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Data")
                        .HasColumnType("datetime2");

                    b.Property<int>("KujdestariId")
                        .HasColumnType("int");

                    b.Property<int>("NxenesiId")
                        .HasColumnType("int");

                    b.Property<string>("Oret")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("KujdestariId");

                    b.HasIndex("NxenesiId");

                    b.ToTable("Mungesat");
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

            modelBuilder.Entity("api.Models.KlasaLenda", b =>
                {
                    b.HasOne("api.Models.Klasa", "Klasa")
                        .WithMany("KlasaLenda")
                        .HasForeignKey("KlasaId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("api.Models.Lenda", "Lenda")
                        .WithMany("KlasaLenda")
                        .HasForeignKey("LendaId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Klasa");

                    b.Navigation("Lenda");
                });

            modelBuilder.Entity("api.Models.Kujdestari", b =>
                {
                    b.HasOne("api.Models.Klasa", "Klasa")
                        .WithOne("Kujdestari")
                        .HasForeignKey("api.Models.Kujdestari", "KlasaId");

                    b.Navigation("Klasa");
                });

            modelBuilder.Entity("api.Models.Lenda", b =>
                {
                    b.HasOne("api.Models.Kujdestari", "Kujdestari")
                        .WithMany()
                        .HasForeignKey("KujdestariId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Kujdestari");
                });

            modelBuilder.Entity("api.Models.Mungesa", b =>
                {
                    b.HasOne("api.Models.Kujdestari", "Kujdestari")
                        .WithMany()
                        .HasForeignKey("KujdestariId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("api.Models.Nxenesi", "Nxenesi")
                        .WithMany()
                        .HasForeignKey("NxenesiId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Kujdestari");

                    b.Navigation("Nxenesi");
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
                    b.Navigation("KlasaLenda");

                    b.Navigation("Kujdestari")
                        .IsRequired();

                    b.Navigation("Nxenesit");
                });

            modelBuilder.Entity("api.Models.Lenda", b =>
                {
                    b.Navigation("KlasaLenda");
                });
#pragma warning restore 612, 618
        }
    }
}