namespace api.DTOs;

public class NxenesiDto
{
    public int Id { get; set; }
    public required string Emri { get; set; }
    public required string Mbiemri { get; set; }
    public required int KlasaId { get; set; }
    public DateTime Ditelindja { get; set; }
    public required string Gjinia { get; set; }
    public string? Adresa { get; set; }
    public required string Prindi { get; set; }
}
