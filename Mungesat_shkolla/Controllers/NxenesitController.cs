using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Mungesat_shkolla.Data;
using Mungesat_shkolla.DTO;
using Mungesat_shkolla.Models;
using Mungesat_shkolla.Repositories;

namespace Mungesat_shkolla.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NxenesitController : ControllerBase
    {
        private readonly MungesatDbContext dbContext;
        private readonly INxenesitRepository nxenesitRepository;
        private readonly IMapper mapper;


        public NxenesitController(MungesatDbContext dbContext, INxenesitRepository nxenesitRepository, IMapper mapper)
        {
            this.dbContext = dbContext;
            this.nxenesitRepository = nxenesitRepository;
            this.mapper = mapper;
        }

        [HttpGet]

        public async Task<IActionResult> GetAllAsync()
        {
            var nxenesit = await nxenesitRepository.GetAllAsync();

            var nxenesiDto = mapper.Map<List<NxenesitDto>>(nxenesit);
            return Ok(nxenesiDto);

        }

        [HttpGet]
        [Route("{id}")]

        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var nxenesiDomain = await nxenesitRepository.GetByIdAsync(id);
            if (nxenesiDomain == null)
            {
                return NotFound();
            }
            return Ok(mapper.Map<NxenesitDto>(nxenesiDomain));
        }
        [HttpPost]

        public async Task<IActionResult> CreateAsync([FromBody] AddNxenesitDTO addNxenesitDTO)
        {
            var nxenesitModel = mapper.Map<Nxenesi>(addNxenesitDTO);
            nxenesitModel = await nxenesitRepository.CreateAsync(nxenesitModel);
            var nxenesiDto = mapper.Map<NxenesitDto>(nxenesitModel);

            
            return Ok(nxenesiDto);

        }
        [HttpPut]
        [Route("{id}")]

        public async Task<IActionResult> UpdateAsync([FromRoute] int id, [FromBody] UpdateNxenesitDto nxenesitDto)
        {

            var nxenesiDomain = await nxenesitRepository.GetByIdAsync(id);
             nxenesiDomain = mapper.Map<Nxenesi>(nxenesitDto);
            if (nxenesiDomain != null)
            {
                nxenesiDomain.Id = id;
                nxenesitRepository.Update(nxenesiDomain);
                return Ok(nxenesiDomain);
            }
            
            
            var nxenesiDto = mapper.Map<NxenesitDto> (nxenesiDomain);
            return NotFound();
        }
        [HttpDelete]
        [Route("{id}")]

        public async Task<IActionResult> DeleteByIdAsync([FromRoute] int id)
        {
            var nxenesitModel = mapper.Map<Nxenesi>(id);
            nxenesitModel = await nxenesitRepository.DeleteByIdAsync(id);
            if (nxenesitModel != null)
            {
                nxenesitModel.Id = id;
                return Ok(nxenesitModel);
               
            }

            return NotFound();
        }

    }
}
