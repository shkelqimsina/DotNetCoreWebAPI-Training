namespace Mungesat_shkolla.DTO
{
    public class UpdateMungesaDto
    {
        public DateTime Data { get; set; }
        public string? Arsyeja { get; set; }
        public string? Oret { get; set; }
        public bool MeArsyje { get; set; }
        /// <summary>Orët që janë me arsyje (p.sh. "6" ose "1,6").</summary>
        public string? OretMeArsyje { get; set; }
    }
}
