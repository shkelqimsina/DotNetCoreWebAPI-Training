using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
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
        private readonly IWebHostEnvironment _env;

        public MungesatController(MungesatDbContext dbContext, IMapper mapper, IWebHostEnvironment env)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _env = env;
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
            var klasa = await _dbContext.Klasat.AsNoTracking().FirstOrDefaultAsync(k => k.KujdestariId == userId);
            return klasa?.Id;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetCurrentUserId();
            var klasatId = await GetKujdestarKlasatIdAsync();
            IQueryable<Mungesa> query = _dbContext.mungesa.Include(m => m.Nxenesi).ThenInclude(n => n.Klasat).ThenInclude(k => k.Kujdestari).OrderByDescending(m => m.Data);

            if (User.IsInRole("Prindi") && userId.HasValue)
                query = query.Where(m => m.Nxenesi != null && m.Nxenesi.PrindiUserId == userId.Value);
            else if (!User.IsInRole("Administrator") && !User.IsInRole("Drejtori") && klasatId.HasValue)
                query = query.Where(m => m.Nxenesi != null && m.Nxenesi.KlasatId == klasatId.Value);

            var mungesat = await query.ToListAsync();
            var dtos = _mapper.Map<List<MungesaDto>>(mungesat);
            for (var i = 0; i < mungesat.Count; i++)
            {
                if (mungesat[i].Nxenesi != null)
                {
                    dtos[i].EmriNxenesit = mungesat[i].Nxenesi.Emri;
                    dtos[i].MbiemriNxenesit = mungesat[i].Nxenesi.Mbiemri;
                    dtos[i].EmriKlases = mungesat[i].Nxenesi.Klasat?.Emri;
                    if (mungesat[i].Nxenesi.Klasat?.Kujdestari != null)
                    {
                        dtos[i].EmriKujdestari = mungesat[i].Nxenesi.Klasat.Kujdestari.Emri;
                        dtos[i].MbiemriKujdestari = mungesat[i].Nxenesi.Klasat.Kujdestari.Mbiemri;
                    }
                }
            }
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var mungesa = await _dbContext.mungesa.Include(m => m.Nxenesi).ThenInclude(n => n.Klasat).FirstOrDefaultAsync(m => m.Id == id);
            if (mungesa == null) return NotFound();

            var userId = GetCurrentUserId();
            if (User.IsInRole("Prindi"))
            {
                if (!userId.HasValue || mungesa.Nxenesi == null || mungesa.Nxenesi.PrindiUserId != userId.Value)
                    return Forbid();
            }
            else
            {
                var klasatId = await GetKujdestarKlasatIdAsync();
                if (!User.IsInRole("Administrator") && klasatId.HasValue && (mungesa.Nxenesi == null || mungesa.Nxenesi.KlasatId != klasatId.Value))
                    return Forbid();
            }

            var dto = _mapper.Map<MungesaDto>(mungesa);
            if (mungesa.Nxenesi != null)
            {
                dto.EmriNxenesit = mungesa.Nxenesi.Emri;
                dto.MbiemriNxenesit = mungesa.Nxenesi.Mbiemri;
                dto.EmriKlases = mungesa.Nxenesi.Klasat?.Emri;
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
            mungesa.OretMeArsyje = addDto.OretMeArsyje;
            _dbContext.mungesa.Add(mungesa);
            await _dbContext.SaveChangesAsync();
            var dto = _mapper.Map<MungesaDto>(mungesa);
            dto.EmriNxenesit = nxenesi.Emri;
            dto.MbiemriNxenesit = nxenesi.Mbiemri;
            await _dbContext.Entry(nxenesi).Reference(n => n.Klasat).LoadAsync();
            dto.EmriKlases = nxenesi.Klasat?.Emri;
            return Ok(dto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Kujdestar,Administrator")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateMungesaDto updateDto)
        {
            var mungesa = await _dbContext.mungesa.Include(m => m.Nxenesi).FirstOrDefaultAsync(m => m.Id == id);
            if (mungesa == null) return NotFound("Mungesa nuk u gjet.");

            if (!User.IsInRole("Administrator"))
            {
                var klasatId = await GetKujdestarKlasatIdAsync();
                if (!klasatId.HasValue)
                    return Forbid();
                if (mungesa.Nxenesi == null || mungesa.Nxenesi.KlasatId != klasatId.Value)
                    return Forbid();
            }

            mungesa.Data = updateDto.Data;
            mungesa.Arsyeja = updateDto.Arsyeja ?? "";
            mungesa.Oret = updateDto.Oret ?? "";
            mungesa.MeArsyje = updateDto.MeArsyje;
            mungesa.OretMeArsyje = updateDto.OretMeArsyje;
            await _dbContext.SaveChangesAsync();

            await _dbContext.Entry(mungesa).Reference(m => m.Nxenesi).LoadAsync();
            await _dbContext.Entry(mungesa.Nxenesi).Reference(n => n.Klasat).LoadAsync();
            var dto = _mapper.Map<MungesaDto>(mungesa);
            dto.EmriNxenesit = mungesa.Nxenesi?.Emri;
            dto.MbiemriNxenesit = mungesa.Nxenesi?.Mbiemri;
            dto.EmriKlases = mungesa.Nxenesi?.Klasat?.Emri;
            return Ok(dto);
        }

        /// <summary>Prindi dërgon arsyetimin (tekst + skedar opsional) për një mungesë të fëmijës së vet.</summary>
        [HttpPost("{id}/arsyeto")]
        [Authorize(Roles = "Prindi")]
        public async Task<IActionResult> Arsyeto(int id, [FromForm] string? arsyetim, IFormFile? file)
        {
            var userId = GetCurrentUserId();
            if (!userId.HasValue) return Unauthorized();

            var mungesa = await _dbContext.mungesa.Include(m => m.Nxenesi).FirstOrDefaultAsync(m => m.Id == id);
            if (mungesa == null) return NotFound("Mungesa nuk u gjet.");
            if (mungesa.Nxenesi == null || mungesa.Nxenesi.PrindiUserId != userId.Value)
                return Forbid();

            mungesa.ArsyetimPrindi = arsyetim?.Trim();
            if (file != null && file.Length > 0)
            {
                var uploadsDir = Path.Combine(_env.ContentRootPath, "Uploads", "Arsyetime");
                Directory.CreateDirectory(uploadsDir);
                var ext = Path.GetExtension(file.FileName) ?? "";
                var safeName = $"{Guid.NewGuid():N}{ext}";
                var filePath = Path.Combine(uploadsDir, safeName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                    await file.CopyToAsync(stream);
                mungesa.SkedarArsyetimit = safeName;
            }

            await _dbContext.SaveChangesAsync();
            var dto = _mapper.Map<MungesaDto>(mungesa);
            dto.EmriNxenesit = mungesa.Nxenesi?.Emri;
            dto.MbiemriNxenesit = mungesa.Nxenesi?.Mbiemri;
            await _dbContext.Entry(mungesa.Nxenesi!).Reference(n => n.Klasat).LoadAsync();
            dto.EmriKlases = mungesa.Nxenesi?.Klasat?.Emri;
            return Ok(dto);
        }

        /// <summary>Shkarkon skedarin e arsyetimit të prindit (Kujdestar/Administrator për klasën, ose Prindi për fëmijën e vet).</summary>
        [HttpGet("{id}/skedar")]
        public async Task<IActionResult> GetSkedarArsyetimit(int id)
        {
            var mungesa = await _dbContext.mungesa.Include(m => m.Nxenesi).FirstOrDefaultAsync(m => m.Id == id);
            if (mungesa == null || string.IsNullOrEmpty(mungesa.SkedarArsyetimit)) return NotFound();

            var userId = GetCurrentUserId();
            if (User.IsInRole("Prindi"))
            {
                if (!userId.HasValue || mungesa.Nxenesi?.PrindiUserId != userId.Value) return Forbid();
            }
            else if (!User.IsInRole("Administrator"))
            {
                var klasatId = await GetKujdestarKlasatIdAsync();
                if (!klasatId.HasValue || mungesa.Nxenesi?.KlasatId != klasatId.Value) return Forbid();
            }

            var path = Path.Combine(_env.ContentRootPath, "Uploads", "Arsyetime", mungesa.SkedarArsyetimit);
            if (!System.IO.File.Exists(path)) return NotFound();
            var contentType = "application/octet-stream";
            return PhysicalFile(path, contentType, mungesa.SkedarArsyetimit);
        }
    }
}
