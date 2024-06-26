using Microsoft.EntityFrameworkCore;

namespace api.Models;

public class Klasa
{
    public int Id { get; set; }
    public required string Emri { get; set; }
    public int KujdestariId { get; set; }

    public Kujdestari Kujdestari { get; set; }
    public List<Nxenesi> Nxenesit { get; set; }
    public ICollection<KlasaLenda> KlasaLenda { get; set; }

}