using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NxenesiController : ControllerBase
    {
        private readonly MungesatDbDataContext _context;

        public NxenesiController(MungesatDbDataContext context)
        {
            _context = context;
        }

        // GET: api/Nxenesi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Nxenesi>>> GetNxenesit()
        {
            return await _context.Nxenesit.ToListAsync();
        }

        // GET: api/Nxenesi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Nxenesi>> GetNxenesi(int id)
        {
            var nxenesi = await _context.Nxenesit.FindAsync(id);

            if (nxenesi == null)
            {
                return NotFound();
            }

            return nxenesi;
        }

        // POST: api/Nxenesi
        [HttpPost]
        public async Task<ActionResult<Nxenesi>> PostNxenesi(Nxenesi nxenesi)
        {
            await _context.Nxenesit.AddAsync(nxenesi);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNxenesi", new { id = nxenesi.Id }, nxenesi);
        }

        // PUT: api/Nxenesi/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNxenesi(int id, Nxenesi nxenesi)
        {
            if (id != nxenesi.Id)
            {
                return BadRequest();
            }

            _context.Entry(nxenesi).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NxenesiExists(id))
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

        // DELETE: api/Nxenesi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNxenesi(int id)
        {
            var nxenesi = await _context.Nxenesit.FindAsync(id);
            if (nxenesi == null)
            {
                return NotFound();
            }

            _context.Nxenesit.Remove(nxenesi);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NxenesiExists(int id)
        {
            return _context.Nxenesit.Any(e => e.Id == id);
        }
    }
}