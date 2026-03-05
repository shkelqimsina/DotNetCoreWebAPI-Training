using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mungesat_shkolla.Data;
using Mungesat_shkolla.DTO;
using Mungesat_shkolla.Models;
using System.Security.Claims;

namespace Mungesat_shkolla.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MungesatController : ControllerBase
    {
        private readonly MungesatDbContext _dbContext;
        private readonly IMapper _mapper;

        public MungesatController(MungesatDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        private int? GetCurrentUserId()
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(sub, out var id) ? id : null;
        }

        private async Task<int?> GetKujdestarKlasatIdAsync()
        {
            var userId = GetCurrentUserId();
            if (userId == null) return null;
            var klasa = await _dbContext.Klasat.AsNoTracking().FirstOrDefaultAsync(k => k.KujdestariId == userId);
            return klasa?.Id;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var klasatId = await GetKujdestarKlasatIdAsync();
            IQueryable<Mungesa> query = _dbContext.mungesa.Include(m => m.Nxenesi).OrderByDescending(m => m.Data);

            if (!User.IsInRole("Administrator") && klasatId.HasValue)
                query = query.Where(m => m.Nxenesi != null && m.Nxenesi.KlasatId == klasatId.Value);

            var mungesat = await query.ToListAsync();
            var dtos = _mapper.Map<List<MungesaDto>>(mungesat);
            for (var i = 0; i < mungesat.Count; i++)
            {
                if (mungesat[i].Nxenesi != null)
                {
                    dtos[i].EmriNxenesit = mungesat[i].Nxenesi.Emri;
                    dtos[i].MbiemriNxenesit = mungesat[i].Nxenesi.Mbiemri;
                }
            }
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var mungesa = await _dbContext.mungesa.Include(m => m.Nxenesi).FirstOrDefaultAsync(m => m.Id == id);
            if (mungesa == null) return NotFound();

            var klasatId = await GetKujdestarKlasatIdAsync();
            if (!User.IsInRole("Administrator") && klasatId.HasValue && (mungesa.Nxenesi == null || mungesa.Nxenesi.KlasatId != klasatId.Value))
                return Forbid();

            var dto = _mapper.Map<MungesaDto>(mungesa);
            if (mungesa.Nxenesi != null)
            {
                dto.EmriNxenesit = mungesa.Nxenesi.Emri;
                dto.MbiemriNxenesit = mungesa.Nxenesi.Mbiemri;
            }
            return Ok(dto);
        }

        [HttpPost]
        [Authorize(Roles = "Kujdestar,Administrator")]
        public async Task<IActionResult> Create([FromBody] AddMungesaDto addDto)
        {
            var nxenesi = await _dbContext.nxenesi.FindAsync(addDto.NxenesiId);
            if (nxenesi == null) return NotFound("Nxënësi nuk u gjet.");

            if (!User.IsInRole("Administrator"))
            {
                var klasatId = await GetKujdestarKlasatIdAsync();
                if (!klasatId.HasValue)
                    return Forbid();
                if (nxenesi.KlasatId != klasatId.Value)
                    return BadRequest("Mund të regjistroni mungesa vetëm për nxënësit e klasës tuaj.");
            }

            var mungesa = _mapper.Map<Mungesa>(addDto);
            mungesa.Arsyeja ??= "";
            mungesa.Oret ??= "";
            _dbContext.mungesa.Add(mungesa);
            await _dbContext.SaveChangesAsync();
            var dto = _mapper.Map<MungesaDto>(mungesa);
            dto.EmriNxenesit = nxenesi.Emri;
            dto.MbiemriNxenesit = nxenesi.Mbiemri;
            return Ok(dto);
        }
    }
}
