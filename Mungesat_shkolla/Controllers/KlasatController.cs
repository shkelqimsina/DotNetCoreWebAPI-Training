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

            return Ok(klasadto);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetById(int id) // pse ketu vetem id brenda kllapave, a nuk ish deshte edhe FromBody
        {
            
            var klasatId = await klasatRepository.GetByIdAsync(id);
            var klasatdto = mapper.Map<KlasatDto>(klasatId); // pse ketu behet veq njeher mappingu
            if (klasatdto == null)
            {
                return NotFound();
            }
            
            return Ok(klasatdto);
            
        }

        [HttpPost]

        public async Task<IActionResult> CreateAsync([FromBody] KlasatDto klasatDto)
        {
            var kl = mapper.Map<Klasat>(klasatDto);// e ktu dy here
            await klasatRepository.CreateAsync(kl);
            var klasaDto = mapper.Map<KlasatDto>(kl);// dy here
            
            return Ok(klasaDto);

        }

        [HttpPut]
        [Route("{id}")]

        public async Task<IActionResult> update([FromRoute] int id, [FromBody] KlasatDto klasatDto)
        {
            
            var klasat = await klasatRepository.GetByIdAsync(id);
            klasat = mapper.Map<Klasat>(klasatDto);
            var klDto = mapper.Map<KlasatDto>(klasat);
            if (klasat != null)
            {
                klasat.Id = id;
                klasatRepository.Update(klasat);
                return Ok(klDto);

            }

            
            return NotFound();    
        }

        [HttpDelete]
        [Route("{id}")]

        public async Task<IActionResult> Delete(int id)
        {
            var klasat = await klasatRepository.GetByIdAsync(id);
            if(klasat != null)
            {
                var kl =await klasatRepository.DeleteByIdAsync(id);
                await dbContext.SaveChangesAsync();
                return Ok(kl);
            }

            return NotFound();
           
        }
    }
}
