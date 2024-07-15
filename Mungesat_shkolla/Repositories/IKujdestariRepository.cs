using Mungesat_shkolla.Models;

namespace Mungesat_shkolla.Repositories
{
    public interface IKujdestariRepository
    {
        Task<Kujdestari> CreateAsync(Kujdestari kujdestari);
        Task<Kujdestari> GetAsync(int id);
        void Update(Kujdestari kujdestari);
       // Task<Kujdestari> UpdateKujdestariKlasa(Kujdestari kujdestari);

    }
}
