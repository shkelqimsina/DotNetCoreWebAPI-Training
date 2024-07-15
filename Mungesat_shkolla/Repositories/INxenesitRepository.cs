using Mungesat_shkolla.Models;

namespace Mungesat_shkolla.Repositories
{
    public interface INxenesitRepository
    {
       Task <List<Nxenesi>>GetAllAsync();
       Task<Nxenesi?> GetByIdAsync(int id);
       Task<Nxenesi?> CreateAsync(Nxenesi nxenesi);
        void Update(Nxenesi nxenesi);
    Task<Nxenesi?> DeleteByIdAsync(int id);

    }
}
