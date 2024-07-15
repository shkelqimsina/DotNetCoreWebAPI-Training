namespace Mungesat_shkolla.DTO
{
    public class AddNxenesitDTO
    {
        public required string Emri { get; set; }
        public required string Mbiemri { get; set; }

        public DateTime Ditelindja { get; set; }
        public required string Gjinia { get; set; }
        public string? Adresa { get; set; }
        public required string Prindi { get; set; }
        public int KlasatId { get; set; }
    }
}
