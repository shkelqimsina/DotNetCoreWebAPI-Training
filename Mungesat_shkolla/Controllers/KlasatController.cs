using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mungesat_shkolla.Data;
using Mungesat_shkolla.DTO;
using Mungesat_shkolla.Models;
using Mungesat_shkolla.Repositories;

namespace Mungesat_shkolla.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KlasatController : ControllerBase
    {
        private readonly MungesatDbContext dbContext;
        private readonly IMapper mapper;
        private readonly IKlasatRepository klasatRepository;

        public KlasatController(MungesatDbContext dbContext, IMapper mapper, IKlasatRepository klasatRepository)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
            this.klasatRepository = klasatRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            var klasat = await klasatRepository.GetAsync();
            var klasadto = mapper.Map<List<KlasatDto>>(klasat);
            for (int i = 0; i < klasat.Count; i++)
            {
                if (klasat[i].Kujdestari != null)
                {
                    klasadto[i].EmriKujdestari = klasat[i].Kujdestari.Emri;
                    klasadto[i].MbiemriKujdestari = klasat[i].Kujdestari.Mbiemri;
                }
            }
            return Ok(klasadto);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var klasa = await klasatRepository.GetByIdAsync(id);
            if (klasa == null)
                return NotFound();

            var dto = mapper.Map<KlasatDto>(klasa);
            if (klasa.Kujdestari != null)
            {
                dto.EmriKujdestari = klasa.Kujdestari.Emri;
                dto.MbiemriKujdestari = klasa.Kujdestari.Mbiemri;
            }
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] KlasatDto klasatDto)
        {
            var kl = mapper.Map<Klasat>(klasatDto);
            await klasatRepository.CreateAsync(kl);
            await dbContext.Entry(kl).Reference(k => k.Kujdestari).LoadAsync();

            var dto = mapper.Map<KlasatDto>(kl);
            if (kl.Kujdestari != null)
            {
                dto.EmriKujdestari = kl.Kujdestari.Emri;
                dto.MbiemriKujdestari = kl.Kujdestari.Mbiemri;
            }
            return Ok(dto);
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] KlasatDto klasatDto)
        {
            var existing = await klasatRepository.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            var klasat = mapper.Map<Klasat>(klasatDto);
            klasat.Id = id;
            klasatRepository.Update(klasat);

            var updated = await klasatRepository.GetByIdAsync(id);
            var dto = mapper.Map<KlasatDto>(updated);
            if (updated?.Kujdestari != null)
            {
                dto.EmriKujdestari = updated.Kujdestari.Emri;
                dto.MbiemriKujdestari = updated.Kujdestari.Mbiemri;
            }
            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var klasa = await klasatRepository.GetByIdAsync(id);
            if (klasa == null)
                return NotFound();

            var deleted = await klasatRepository.DeleteByIdAsync(id);
            await dbContext.SaveChangesAsync();
            var dto = mapper.Map<KlasatDto>(deleted);
            if (deleted?.Kujdestari != null)
            {
                dto.EmriKujdestari = deleted.Kujdestari.Emri;
                dto.MbiemriKujdestari = deleted.Kujdestari.Mbiemri;
            }
            return Ok(dto);
        }
    }
}
