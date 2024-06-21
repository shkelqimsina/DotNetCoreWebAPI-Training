using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Data;
using api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KlasaController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly MungesatDbDataContext _context;

        public KlasaController(MungesatDbDataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        // GET: api/Klasa
        [HttpGet]
        public async Task<ActionResult<IEnumerable<KlasaDto>>> GetKlasat()
        {
            var klasat = await _context.Klasat.ToListAsync();
            var klasatDto = _mapper.Map<List<KlasaDto>>(klasat);
            return Ok(klasatDto);
        }

        // GET: api/Klasa/5
        [HttpGet("{id}")]
        public async Task<ActionResult<KlasaDto>> GetKlasa(int id)
        {
            var klasa = await _context.Klasat.FindAsync(id);

            if (klasa == null)
            {
                return NotFound();
            }

            var klasaDto = _mapper.Map<KlasaDto>(klasa);
            return Ok(klasaDto);
        }
        // POST: api/Klasa
        [HttpPost]
        public async Task<ActionResult<KlasaDto>> PostKlasa(CreateKlasaRequestDto klasaRequestDto)
        {
            var klasa = _mapper.Map<Klasa>(klasaRequestDto);
            await _context.Klasat.AddAsync(klasa);
            await _context.SaveChangesAsync();

            var createdKlasaDto = _mapper.Map<KlasaDto>(klasa);
            return CreatedAtAction("GetKlasa", new { id = createdKlasaDto.Id }, createdKlasaDto);
        }

        // PUT: api/Klasa/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKlasa(int id, KlasaDto klasaDto)
        {
            if (id != klasaDto.Id)
            {
                return BadRequest();
            }

            var klasa = await _context.Klasat.FindAsync(id);
            if (klasa == null)
            {
                return NotFound();
            }

            _mapper.Map(klasaDto, klasa);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KlasaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Klasa/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKlasa(int id)
        {
            var klasa = await _context.Klasat.FindAsync(id);
            if (klasa == null)
            {
                return NotFound();
            }

            _context.Klasat.Remove(klasa);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool KlasaExists(int id)
        {
            return _context.Klasat.Any(e => e.Id == id);
        }
    }
}