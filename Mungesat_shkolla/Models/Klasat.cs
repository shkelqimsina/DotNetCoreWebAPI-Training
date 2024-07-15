namespace Mungesat_shkolla.Models
{
    public class Klasat
    {
        public int Id { get; set; }
        public required string Emri { get; set; }
        public int KujdestariId { get; set; }

        public Kujdestari Kujdestari { get; set; }
        public List<Nxenesi> Nxenesit { get; set; }
        public List<KlasaLenda> KlasaLenda { get; set; }
    }
}
