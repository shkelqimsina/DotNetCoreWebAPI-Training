namespace Mungesat_shkolla.DTO
{
    public class KlasatDto
    {
        public int Id { get; set; }
        public required string Emri { get; set; }
        public int KujdestariId { get; set; }
        public string? EmriKujdestari { get; set; }
        public string? MbiemriKujdestari { get; set; }
    }
}
