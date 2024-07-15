using Microsoft.AspNetCore.Mvc;
using Mungesat_shkolla.Data;
using Mungesat_shkolla.Models;

namespace Mungesat_shkolla.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KlasaController : ControllerBase
    {
        private readonly MungesatDbContext dbContext;

        public KlasaController(MungesatDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]

        public IActionResult GetAll()
        {
            var klasa = dbContext.Klasat;
            return Ok(klasa);

        }
        [HttpGet]
        [Route("{id}")]

        public IActionResult GetById(int id) {

            var klasa = dbContext.Klasat.Find(id);
            if (klasa == null)
            {

                return NotFound();
            }
            return Ok(klasa);
            

        }

        [HttpPost]

        public IActionResult Create([FromBody] Klasat klasat)
        {
            var KlasaDomain = dbContext.Klasat.Add(klasat);
            dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetById), KlasaDomain);

        }
    }
}
