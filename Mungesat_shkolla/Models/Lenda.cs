namespace Mungesat_shkolla.Models
{
    public class Lenda
    {
        public int Id { get; set; }
        public string Emri { get; set; }
        public int Viti { get; set; }
        public List<KlasaLenda> KlasaLenda { get; set; }
    }
}
