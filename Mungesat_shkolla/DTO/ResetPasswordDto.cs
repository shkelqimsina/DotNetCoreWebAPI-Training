using System.ComponentModel.DataAnnotations;

namespace Mungesat_shkolla.DTO;

/// <summary>DTO për rivendosjen e fjalëkalimit nga administratori (kur përdoruesi e ka harruar).</summary>
public class ResetPasswordDto
{
    [Required(ErrorMessage = "Emri i përdoruesit është i detyrueshëm.")]
    public string UserName { get; set; } = "";

    [Required(ErrorMessage = "Fjalëkalimi i ri është i detyrueshëm.")]
    [MinLength(6, ErrorMessage = "Fjalëkalimi duhet të përmbajë të paktën 6 karaktere.")]
    public string NewPassword { get; set; } = "";
}
