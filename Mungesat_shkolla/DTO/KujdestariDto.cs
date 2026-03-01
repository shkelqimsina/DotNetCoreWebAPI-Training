namespace Mungesat_shkolla.DTO
{
    public class KujdestariDto
    {
        public required string Emri { get; set; }
        public required string Mbiemri { get; set; }
        public required string Email { get; set; }
        /// <summary>Klasa ku ky kujdestar do të caktohet (opsional).</summary>
        public int? KlasatId { get; set; }
    }
}
