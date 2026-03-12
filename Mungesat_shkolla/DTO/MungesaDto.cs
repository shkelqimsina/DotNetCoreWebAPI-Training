namespace Mungesat_shkolla.DTO
{
    public class MungesaDto
    {
        public int Id { get; set; }
        public DateTime Data { get; set; }
        public string? Arsyeja { get; set; }
        public string? Oret { get; set; }
        public bool MeArsyje { get; set; }
        /// <summary>Orët që janë me arsyje (p.sh. "6" ose "1,6").</summary>
        public string? OretMeArsyje { get; set; }
        public int NxenesiId { get; set; }
        public string? EmriNxenesit { get; set; }
        public string? MbiemriNxenesit { get; set; }
        public string? EmriKlases { get; set; }
        /// <summary>Emri i kujdestarit të klasës (për pamjen e Drejtorit).</summary>
        public string? EmriKujdestari { get; set; }
        public string? MbiemriKujdestari { get; set; }
        public string? ArsyetimPrindi { get; set; }
        public string? SkedarArsyetimit { get; set; }
    }
}
