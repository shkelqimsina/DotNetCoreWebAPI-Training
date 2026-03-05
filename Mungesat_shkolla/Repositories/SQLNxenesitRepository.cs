using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mungesat_shkolla.Data;
using Mungesat_shkolla.Models;

namespace Mungesat_shkolla.Repositories
{
    public class SQLNxenesitRepository : INxenesitRepository
    {
        private readonly MungesatDbContext dbContext;
        public SQLNxenesitRepository(MungesatDbContext dbContext)
        {
            this.dbContext = dbContext;
        }




        public async Task<List<Nxenesi>> GetAllAsync()
        {
            return await dbContext.nxenesi.ToListAsync();
        }

        public async Task<Nxenesi?> GetByIdAsync(int id)
        {
            return await dbContext.nxenesi.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }
        public void Update(Nxenesi nxenesi)
        {
            dbContext.Update(nxenesi);
            dbContext.SaveChanges();
        }

        public async Task<Nxenesi?> DeleteByIdAsync(int id)
        {
            var nxenesi = await dbContext.nxenesi.FindAsync(id);
            if (nxenesi == null) return null;
            dbContext.nxenesi.Remove(nxenesi);
            await dbContext.SaveChangesAsync();
            return nxenesi;
        }

        async Task<Nxenesi?> INxenesitRepository.CreateAsync(Nxenesi nxenesi)
        {
            await dbContext.nxenesi.AddAsync(nxenesi);
            await dbContext.SaveChangesAsync();
            return nxenesi;
        }
    }
}
