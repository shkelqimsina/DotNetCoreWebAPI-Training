using Microsoft.EntityFrameworkCore;
using Mungesat_shkolla.Data;
using Mungesat_shkolla.DTO;
using Mungesat_shkolla.Models;

namespace Mungesat_shkolla.Repositories
{
    public class SQLKujdestariRepository : IKujdestariRepository
    {
        private readonly MungesatDbContext dbContext;

        public SQLKujdestariRepository(MungesatDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<Kujdestari> CreateAsync(Kujdestari kujdestari)
        {
            await dbContext.AddAsync(kujdestari);
            await dbContext.SaveChangesAsync();
            return kujdestari;
        }

        public async Task<Kujdestari> GetAsync(int id)
        {
            return await dbContext.kujdestari.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }


        public void Update(Kujdestari kujdestari)
        {
            dbContext.kujdestari.Update(kujdestari);
        }

       
    }
}
