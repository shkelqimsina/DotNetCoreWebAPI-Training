
using AutoMapper;
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
    public class KujdestariUpdateController : ControllerBase
    {
        private readonly MungesatDbContext dbContext;
        private readonly IMapper mapper;
        private readonly IKujdestariRepository kujdestariRepository;

        public KujdestariUpdateController(MungesatDbContext dbContext, IMapper mapper, IKujdestariRepository kujdestariRepository)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
            this.kujdestariRepository = kujdestariRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var kujdestari = await dbContext.kujdestari.ToListAsync();
            return Ok(kujdestari);
        }

        [HttpGet("{id}")]
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
            return CreatedAtAction(nameof(GetAsync), new { id = kujdestar.Id }, kujda);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] KujdestariDto kujdestaridto)
        {
            var kujdestar = mapper.Map<Kujdestari>(kujdestaridto);
            var getData = await kujdestariRepository.GetAsync(id);
            if (getData != null)
            {
                kujdestar.Id = id;
                kujdestar.KlasatId = getData.KlasatId;
                kujdestariRepository.Update(kujdestar);
                await dbContext.SaveChangesAsync();
                return Ok();
            }
            return NotFound();
        }

        [HttpPut("updateKujdestariKlasa")]
        public async Task<IActionResult> UpdateKujdestariKlasa([FromBody] KujdestariUpdate updateDto)
        {
            try
            {
                var kujdestari1 = await dbContext.kujdestari.FindAsync(updateDto.ActualKujdstari);
                var kujdestari2 = await dbContext.kujdestari.FindAsync(updateDto.DestinationKujdestari);

                if (kujdestari1 == null || kujdestari2 == null)
                {
                    return NotFound("One or both of the specified Kujdestari entries do not exist.");
                }

                var klasa1 = await dbContext.Klasat.FindAsync(kujdestari1.KlasatId);
                var klasa2 = await dbContext.Klasat.FindAsync(kujdestari2.KlasatId);

                if (klasa1 == null || klasa2 == null)
                {
                    return NotFound("One or both of the specified Klasa entries do not exist.");
                }

                // Swap the KlasaId values
                var tempKlasaId = kujdestari1.KlasatId;
                kujdestari1.KlasatId = kujdestari2.KlasatId;
                kujdestari2.KlasatId = tempKlasaId;

                // Update the database
                dbContext.kujdestari.Update(kujdestari1);
                dbContext.kujdestari.Update(kujdestari2);
                await dbContext.SaveChangesAsync();

                return Ok();
            }
            catch (global::System.Exception)
            {

                throw;
            }

        }
    }
}

