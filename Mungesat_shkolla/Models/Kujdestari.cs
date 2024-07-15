using Microsoft.AspNetCore.Identity;

namespace Mungesat_shkolla.Models
{
    public class Kujdestari : IdentityUser
  {
        public int Id { get; set; }
        public required string Emri { get; set; }
        public required string Mbiemri { get; set; }
        
        public required string Email { get; set; }
        //public int KlasatId { get; set; }
        public Klasat Klasat { get; set; }

    }
}
