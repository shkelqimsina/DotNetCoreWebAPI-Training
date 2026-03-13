namespace Mungesat_shkolla.DTO
{
    public class KujdestariDto
    {
        public required string Emri { get; set; }
        public required string Mbiemri { get; set; }
        public required string Email { get; set; }
        /// <summary>Emri për kyçje (nëse bosh, përdoret Email).</summary>
        public string? UserName { get; set; }
        /// <summary>Fjalëkalimi për kyçje – obligativ kur shtohet kujdestar i ri.</summary>
        public string? Password { get; set; }
        /// <summary>Klasa ku ky kujdestar do të caktohet (opsional).</summary>
        public int? KlasatId { get; set; }
        /// <summary>Roli: "Kujdestar" (parazgjedhje) ose "Drejtori". Drejtorin mund ta shtojë vetëm Administratori.</summary>
        public string? Role { get; set; }
    }
}
