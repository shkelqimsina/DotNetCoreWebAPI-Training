using System.ComponentModel.DataAnnotations;

namespace Mungesat_shkolla.DTO;
public class LoginDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }