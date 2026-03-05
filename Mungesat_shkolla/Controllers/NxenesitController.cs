using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mungesat_shkolla.Data;
using Mungesat_shkolla.DTO;
using Mungesat_shkolla.Models;
using Mungesat_shkolla.Repositories;
using System.Security.Claims;

namespace Mungesat_shkolla.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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

        private int? GetCurrentUserId()
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            return sub != null && int.TryParse(sub, out var id) ? id : null;
        }

        private async Task<int?> GetKujdestarKlasatIdAsync()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return null;
            var klasa = await dbContext.Klasat.AsNoTracking().FirstOrDefaultAsync(k => k.KujdestariId == userId);
            return klasa?.Id;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var klasatId = await GetKujdestarKlasatIdAsync();
            List<Nxenesi> nxenesit;
            if (User.IsInRole("Administrator"))
                nxenesit = await nxenesitRepository.GetAllAsync();
            else if (klasatId.HasValue)
                nxenesit = await dbContext.nxenesi.Where(n => n.KlasatId == klasatId.Value).ToListAsync();
            else
                nxenesit = new List<Nxenesi>();

            var nxenesiDto = mapper.Map<List<NxenesitDto>>(nxenesit);
            return Ok(nxenesiDto);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var nxenesiDomain = await nxenesitRepository.GetByIdAsync(id);
            if (nxenesiDomain == null) return NotFound();

            var klasatId = await GetKujdestarKlasatIdAsync();
            if (!User.IsInRole("Administrator") && klasatId.HasValue && nxenesiDomain.KlasatId != klasatId.Value)
                return Forbid();

            return Ok(mapper.Map<NxenesitDto>(nxenesiDomain));
        }

        [HttpPost]
        [Authorize(Roles = "Kujdestar,Administrator")]
        public async Task<IActionResult> CreateAsync([FromBody] AddNxenesitDTO addNxenesitDTO)
        {
            if (!User.IsInRole("Administrator"))
            {
                var klasatId = await GetKujdestarKlasatIdAsync();
                if (!klasatId.HasValue)
                    return Forbid();
                if (addNxenesitDTO.KlasatId != klasatId.Value)
                    return BadRequest("Mund të shtoni nxënës vetëm në klasën tuaj.");
            }

            var nxenesitModel = mapper.Map<Nxenesi>(addNxenesitDTO);
            nxenesitModel = await nxenesitRepository.CreateAsync(nxenesitModel);
            var nxenesiDto = mapper.Map<NxenesitDto>(nxenesitModel);
            return Ok(nxenesiDto);
        }
        [HttpPut]
        [Route("{id}")]
        [Authorize(Roles = "Kujdestar,Administrator")]
        public async Task<IActionResult> UpdateAsync([FromRoute] int id, [FromBody] UpdateNxenesitDto nxenesitDto)
        {
            var nxenesiDomain = await nxenesitRepository.GetByIdAsync(id);
            if (nxenesiDomain == null) return NotFound();

            var klasatId = await GetKujdestarKlasatIdAsync();
            if (!User.IsInRole("Administrator") && (!klasatId.HasValue || nxenesiDomain.KlasatId != klasatId.Value))
                return Forbid();

            if (!User.IsInRole("Administrator") && nxenesitDto.KlasatId != klasatId.Value)
                return BadRequest("Kujdestari mund të ndryshojë vetëm nxënësit e klasës së vet; nuk mund t’ia ndryshoni klasën.");

            nxenesiDomain = mapper.Map<Nxenesi>(nxenesitDto);
            nxenesiDomain.Id = id;
            nxenesitRepository.Update(nxenesiDomain);
            await dbContext.SaveChangesAsync();
            return Ok(mapper.Map<NxenesitDto>(nxenesiDomain));
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = "Kujdestar,Administrator")]
        public async Task<IActionResult> DeleteByIdAsync([FromRoute] int id)
        {
            var nxenesiDomain = await nxenesitRepository.GetByIdAsync(id);
            if (nxenesiDomain == null) return NotFound();

            var klasatId = await GetKujdestarKlasatIdAsync();
            if (!User.IsInRole("Administrator") && (!klasatId.HasValue || nxenesiDomain.KlasatId != klasatId.Value))
                return Forbid();

            var deleted = await nxenesitRepository.DeleteByIdAsync(id);
            return deleted != null ? Ok(mapper.Map<NxenesitDto>(deleted)) : NotFound();
        }

    }
}
