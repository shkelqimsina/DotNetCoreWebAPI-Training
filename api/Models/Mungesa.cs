namespace api.Models;

public class Mungesa {
    public int Id { get; set; }
    public int NxenesiId { get; set; }
    public Nxenesi Nxenesi { get; set; }
    public DateTime Data { get; set; }
    public string Arsyeja { get; set; }
    public int KujdestariId { get; set; }
    public Kujdestari Kujdestari { get; set; }
    public string Oret { get; set;}
}