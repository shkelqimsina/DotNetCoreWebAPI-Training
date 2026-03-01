using Microsoft.AspNetCore.Identity;

namespace Mungesat_shkolla.Models
{
    public class Kujdestari : IdentityUser<int>
    {
        public required string Emri { get; set; }
        public required string Mbiemri { get; set; }
        public Klasat? Klasat { get; set; }
    }
}
