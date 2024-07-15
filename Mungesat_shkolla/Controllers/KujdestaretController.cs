using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mungesat_shkolla.Data;
using Mungesat_shkolla.DTO;
using Mungesat_shkolla.Models;
using Mungesat_shkolla.Repositories;
using System.Net.WebSockets;

namespace Mungesat_shkolla.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KujdestaretController : ControllerBase
    {
        private readonly MungesatDbContext dbContext;
        private readonly IMapper mapper;
        private readonly IKujdestariRepository kujdestariRepository;

        public KujdestaretController(MungesatDbContext dbContext, IMapper mapper, IKujdestariRepository kujdestariRepository)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
            this.kujdestariRepository = kujdestariRepository;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var kujdestari = await dbContext.kujdestari.ToListAsync();
            return Ok(kujdestari);
        }
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetAsync(int id)
        {
            var kujdestari = await kujdestariRepository.GetAsync(id);

            return Ok(kujdestari);
        }

        [HttpPost]

        public async Task<IActionResult> CreateAsync([FromBody] KujdestariDto kujdestaridto)
        {
            var kujdestar = mapper.Map<Kujdestari>(kujdestaridto);
            await kujdestariRepository.CreateAsync(kujdestar);
            var kujda = mapper.Map<KujdestariDto>(kujdestar);

            return Ok(kujda);

        }

        [HttpPut]
        [Route("{id}")]

        //public async Task<IActionResult> Update([FromRoute] int id, [FromBody] KujdestariDto kujdestaridto)
        //{
        //    var kujdestar = mapper.Map<Kujdestari>(kujdestaridto);

        //    var getData = await kujdestariRepository.GetAsync(id);
        //    if (getData != null)
        //    {
        //        kujdestar.Id = id;
        //        kujdestar.KlasatId = getData.KlasatId;
        //        kujdestariRepository.Update(kujdestar);

        //        await dbContext.SaveChangesAsync();
        //        return Ok();

        //    }


        //    //var kujdestarii = mapper.Map<KujdestariDto>(kujdestar);


        //    return NotFound();



        //}

        [HttpPut]
        [Route("swapKujdestari/{kujestari1}/{kujestari2}")]

        public async Task<IActionResult> SwapKujdestari( int kujestari1, int kujestari2)
        {

            var listOfKujdestart = new List<int>
            {
                kujestari1,
                kujestari2
            };


            var getKujdestaret = await dbContext.kujdestari.Where(x=> listOfKujdestart.Contains(x.Id)).ToListAsync();

            //if (getKujdestaret.Any(x => x.Id == kujestari1) && getKujdestaret.Any(x => x.Id == kujestari2))
            //{
            //    var profa1 = getKujdestaret.FirstOrDefault(x => x.Id == kujestari1).KlasatId;
            //    var profa2 = getKujdestaret.FirstOrDefault(x => x.Id == kujestari2).KlasatId;

            //    var profaKlasaId1 = profa1;
            //    var profaKlasaId2 = profa2;

            //    profa1 = profaKlasaId2;
            //    profa2 = profaKlasaId1;

            //    dbContext.UpdateRange(getKujdestaret);
            //    await dbContext.SaveChangesAsync();
            //}
            return Ok(); 


            //var kujdestariIPare = (await dbContext.kujdestari.FirstOrDefaultAsync(k => k.Id == kujestari1)).KlasatId;
         
            //var kujdestariIDyte = (await dbContext.kujdestari.FirstOrDefaultAsync(k => k.Id == kujdestari2)).KlasatId;

            //var tempory = kujdestariIPare;
            //kujdestariIPare = kujdestariIDyte;
            //kujdestariIDyte = tempory;

            //dbContext.Update(kujdestariIPare);
            //dbContext.Update(kujdestariIDyte);
            await dbContext.SaveChangesAsync();
            return Ok();



        }


       
    }
}
