using System.ComponentModel.DataAnnotations;

namespace Mungesat_shkolla.DTO;
public class RegisterDto
    {
        [Required]
        public string? Username { get; set; }
        [Required]
        public string? Emri { get; set; }
        [Required]
        public string? Mbiemri { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string? Password { get; set; }
        /// <summary>Roli i regjistrimit: "Kujdestar" ose "Prindi". Bosh = Kujdestar.</summary>
        public string? Role { get; set; }
        /// <summary>Kur roli është Prindi: emri i fëmijës për ta lidhur.</summary>
        public string? EmriFemijes { get; set; }
        /// <summary>Kur roli është Prindi: mbiemri i fëmijës.</summary>
        public string? MbiemriFemijes { get; set; }
        /// <summary>Kur roli është Prindi: id e klasës ku është fëmija.</summary>
        public int? KlasatId { get; set; }
        /// <summary>Kur regjistrohet Kujdestar ose Drejtori: emri i përdoruesit të Administratorit/Drejtorit që e autorizon.</summary>
        public string? AdminUserName { get; set; }
        /// <summary>Kur regjistrohet Kujdestar ose Drejtori: fjalëkalimi i Administratorit/Drejtorit.</summary>
        public string? AdminPassword { get; set; }
    }