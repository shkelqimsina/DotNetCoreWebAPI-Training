using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mungesat_shkolla.Data;
using Mungesat_shkolla.DTO;
using Mungesat_shkolla.Models;

namespace Mungesat_shkolla.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MungesatController : ControllerBase
    {
        private readonly MungesatDbContext _dbContext;
        private readonly IMapper _mapper;

        public MungesatController(MungesatDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var mungesat = await _dbContext.mungesa
                .Include(m => m.Nxenesi)
                .OrderByDescending(m => m.Data)
                .ToListAsync();
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
            var mungesa = await _dbContext.mungesa
                .Include(m => m.Nxenesi)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (mungesa == null)
                return NotFound();
            var dto = _mapper.Map<MungesaDto>(mungesa);
            if (mungesa.Nxenesi != null)
            {
                dto.EmriNxenesit = mungesa.Nxenesi.Emri;
                dto.MbiemriNxenesit = mungesa.Nxenesi.Mbiemri;
            }
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AddMungesaDto addDto)
        {
            var mungesa = _mapper.Map<Mungesa>(addDto);
            mungesa.Arsyeja ??= "";
            mungesa.Oret ??= "";
            _dbContext.mungesa.Add(mungesa);
            await _dbContext.SaveChangesAsync();
            var dto = _mapper.Map<MungesaDto>(mungesa);
            var nxenesi = await _dbContext.nxenesi.FindAsync(mungesa.NxenesiId);
            if (nxenesi != null)
            {
                dto.EmriNxenesit = nxenesi.Emri;
                dto.MbiemriNxenesit = nxenesi.Mbiemri;
            }
            return Ok(dto);
        }
    }
}
