using Microsoft.EntityFrameworkCore;

namespace api.Models;

public class KlasaLenda
{
    public int Id { get; set; }
    public int KlasaId { get; set; }
    [DeleteBehavior(DeleteBehavior.Restrict)]
    public Klasa Klasa { get; set; }
    public int LendaId { get; set; }
    [DeleteBehavior(DeleteBehavior.Restrict)]
    public Lenda Lenda { get; set; }
    public int Ora { get; set; }
    public int Dita { get; set; }

}