using System.ComponentModel.DataAnnotations;

namespace Mungesat_shkolla.DTO;

public class RegisterParentDto
{
    [Required(ErrorMessage = "Nxënësi duhet zgjedhur.")]
    public int NxenesiId { get; set; }

    [Required(ErrorMessage = "Emri i përdoruesit është i detyrueshëm.")]
    public string? UserName { get; set; }

    public string? Emri { get; set; }
    public string? Mbiemri { get; set; }

    [Required(ErrorMessage = "Email është i detyrueshëm.")]
    [EmailAddress]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Fjalëkalimi është i detyrueshëm.")]
    public string? Password { get; set; }
}
