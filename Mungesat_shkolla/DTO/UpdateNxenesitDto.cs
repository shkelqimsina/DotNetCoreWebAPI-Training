namespace Mungesat_shkolla.DTO
{
    public class UpdateNxenesitDto
    {
        public required string Emri { get; set; }
        public required string Mbiemri { get; set; }

        public DateTime Ditelindja { get; set; }
        public required string Gjinia { get; set; }
        public string? Adresa { get; set; }
        public required string Prindi { get; set; }

        public required int KlasatId { get; set; }

    }
}
