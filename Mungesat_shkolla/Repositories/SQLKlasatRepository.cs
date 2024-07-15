using Microsoft.EntityFrameworkCore;
using Mungesat_shkolla.Data;
using Mungesat_shkolla.Models;

namespace Mungesat_shkolla.Repositories
{
    public class SQLKlasatRepository : IKlasatRepository
    {
        private readonly MungesatDbContext dbContext;

        public SQLKlasatRepository(MungesatDbContext  dbContext)
        {
            this.dbContext = dbContext;
        }

        async Task<Klasat?> IKlasatRepository.CreateAsync(Klasat klasat)
        {
            dbContext.Klasat.AddAsync(klasat);
            dbContext.SaveChanges();
            return klasat;
        }

        public async Task<List<Klasat>> GetAsync()
        {
            return await dbContext.Klasat.ToListAsync();
        }

        public async Task<Klasat> GetByIdAsync(int id)
        {
            return await dbContext.Klasat.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }

       

        public void Update(Klasat klasat)
        {
            dbContext.Update(klasat);
            dbContext.SaveChanges();
        }

        public async Task<Klasat> DeleteByIdAsync(int id)
        {
            return await dbContext.Klasat.FirstOrDefaultAsync(x => x.Id == id);
            
        }
    }
}
