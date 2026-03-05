namespace Mungesat_shkolla.DTO
{
    /// <summary>DTO për ndryshimin e të dhënave të kujdestarit (username, fjalëkalim, emër, klasë).</summary>
    public class UpdateKujdestariDto
    {
        public string? UserName { get; set; }
        /// <summary>Fjalëkalimi i ri (nëse bosh, nuk ndryshohet).</summary>
        public string? NewPassword { get; set; }
        public string? Emri { get; set; }
        public string? Mbiemri { get; set; }
        public string? Email { get; set; }
        public int? KlasatId { get; set; }
    }
}
