namespace api.Models;

public class Kujdestari
{
    public int Id { get; set; }
    public required string Emri { get; set; }
    public required string Mbiemri { get; set; }
    public int? KlasaId { get; set; }
    public required string Email { get; set; }

    public Klasa Klasa { get; set; }
}