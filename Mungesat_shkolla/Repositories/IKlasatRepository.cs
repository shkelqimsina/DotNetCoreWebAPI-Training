using Mungesat_shkolla.Models;

namespace Mungesat_shkolla.Repositories
{
    public interface IKlasatRepository
    {
        Task<List<Klasat>> GetAsync();
        Task<Klasat> GetByIdAsync(int id);
        Task<Klasat?> CreateAsync(Klasat klasat);
        void Update(Klasat klasat);
        Task<Klasat> DeleteByIdAsync(int id);
        
    }
}
