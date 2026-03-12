namespace Mungesat_shkolla.Models
{
    public class Mungesa
    {
        public int Id { get; set; }

        public DateTime Data { get; set; }
        public string Arsyeja { get; set; }
        public string Oret { get; set; }
        public bool MeArsyje { get; set; }
        /// <summary>Orët e mungesës që janë me arsyje (p.sh. "6" ose "1,6"). Bosh = asnjë me arsyje.</summary>
        public string? OretMeArsyje { get; set; }

        public int NxenesiId { get; set; }
        public Nxenesi Nxenesi { get; set; }

        /// <summary>Arsyetimi i prindit për mungesën (tekst).</summary>
        public string? ArsyetimPrindi { get; set; }
        /// <summary>Emri i skedarit të ngarkuar nga prindi (p.sh. vertetim mjeku).</summary>
        public string? SkedarArsyetimit { get; set; }
    }
}
