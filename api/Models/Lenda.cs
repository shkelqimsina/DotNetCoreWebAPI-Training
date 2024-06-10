using Microsoft.EntityFrameworkCore;

namespace api.Models;

public class Lenda
{
    public int Id { get; set; }
    public string Emri { get; set; }
    public int KujdestariId { get; set; }
    public Kujdestari Kujdestari { get; set; }
    public int Viti { get; set; }
    public ICollection<KlasaLenda> KlasaLenda { get; set; }
}