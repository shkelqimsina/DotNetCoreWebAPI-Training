namespace Mungesat_shkolla.Models
{
    public class Nxenesi
    {
        public int Id { get; set; }
        public required string Emri { get; set; }
        public required string Mbiemri { get; set; }

        public DateTime Ditelindja { get; set; }
        public required string Gjinia { get; set; }
        public string? Adresa { get; set; }
        public required string Prindi { get; set; }

        public int KlasatId { get; set; }
        public Klasat Klasat { get; set; }

        /// <summary>Id e përdoruesit (Prindi) që ka qasje readonly për këtë nxënës. Null = asnjë prind i lidhur.</summary>
        public int? PrindiUserId { get; set; }

        public List<Mungesa>? MungesaList { get; set; }
    }
}
