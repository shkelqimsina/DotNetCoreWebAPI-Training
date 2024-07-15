using Microsoft.EntityFrameworkCore;

namespace Mungesat_shkolla.Models
{
    public class KlasaLenda
    {
        public int Id { get; set; }
        public int Ora { get; set; }
        public int Dita { get; set; }
        
        public int KlasatId { get; set; }
        [DeleteBehavior(DeleteBehavior.Restrict)]
        public Klasat Klasat { get; set; }
        public int LendaId { get; set; }
        [DeleteBehavior(DeleteBehavior.Restrict)]
        public Lenda Lenda { get; set; }
       


    }
}
