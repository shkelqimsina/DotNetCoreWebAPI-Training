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
    }