using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
    public class KujdestaretController : ControllerBase
    {
        private readonly MungesatDbContext dbContext;
        private readonly IMapper mapper;
        private readonly IKujdestariRepository kujdestariRepository;
        private readonly UserManager<Kujdestari> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;

        public KujdestaretController(
            MungesatDbContext dbContext,
            IMapper mapper,
            IKujdestariRepository kujdestariRepository,
            UserManager<Kujdestari> userManager,
            RoleManager<IdentityRole<int>> roleManager)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
            this.kujdestariRepository = kujdestariRepository;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var list = await dbContext.kujdestari
                .Select(k => new KujdestariListDto { Id = k.Id, Emri = k.Emri, Mbiemri = k.Mbiemri })
                .ToListAsync();
            return Ok(list);
        }
        [HttpGet]
        [Route("{id}")]
        [Authorize]
        public async Task<IActionResult> GetAsync(int id)
        {
            var kujdestari = await kujdestariRepository.GetAsync(id);

            return Ok(kujdestari);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator,Drejtori")]
        public async Task<IActionResult> CreateAsync([FromBody] KujdestariDto kujdestaridto)
        {
            if (string.IsNullOrWhiteSpace(kujdestaridto.Password))
                return BadRequest(new { message = "Fjalëkalimi është i detyrueshëm që kujdestari të mund të kyqet më vonë." });

            var userName = (kujdestaridto.UserName ?? kujdestaridto.Email)?.Trim().ToLowerInvariant() ?? "";
            if (string.IsNullOrEmpty(userName))
                return BadRequest(new { message = "Shkruani emrin e përdoruesit ose email-in." });

            var roleName = (kujdestaridto.Role ?? "").Trim();
            if (roleName == "Drejtori")
            {
                if (!User.IsInRole("Administrator"))
                    return Forbid();
            }
            else
                roleName = "Kujdestar";

            var kujdestar = mapper.Map<Kujdestari>(kujdestaridto);
            kujdestar.UserName = userName;
            kujdestar.NormalizedUserName = userName.ToUpperInvariant();
            kujdestar.NormalizedEmail = (kujdestar.Email ?? "").Trim().ToUpperInvariant();
            kujdestar.SecurityStamp = Guid.NewGuid().ToString();

            var createResult = await userManager.CreateAsync(kujdestar, kujdestaridto.Password);
            if (!createResult.Succeeded)
            {
                var errors = createResult.Errors.Select(e => e.Description).ToList();
                return BadRequest(new { message = "Kujdestari nuk u krijua.", errors });
            }

            if (!await roleManager.RoleExistsAsync(roleName))
                await roleManager.CreateAsync(new IdentityRole<int>(roleName));
            await userManager.AddToRoleAsync(kujdestar, roleName);

            if (roleName == "Kujdestar" && kujdestaridto.KlasatId.HasValue && kujdestaridto.KlasatId.Value > 0)
            {
                var klasa = await dbContext.Klasat.FindAsync(kujdestaridto.KlasatId.Value);
                if (klasa != null)
                {
                    klasa.KujdestariId = kujdestar.Id;
                    await dbContext.SaveChangesAsync();
                }
            }

            var kujda = mapper.Map<KujdestariDto>(kujdestar);
            kujda.Password = null;
            kujda.UserName = kujdestar.UserName;
            return Ok(kujda);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateKujdestariDto dto)
        {
            var kujdestar = await userManager.FindByIdAsync(id.ToString());
            if (kujdestar == null)
                return NotFound(new { message = "Kujdestari nuk u gjet." });

            if (!string.IsNullOrWhiteSpace(dto.UserName))
            {
                var newUserName = dto.UserName.Trim().ToLowerInvariant();
                var setUserResult = await userManager.SetUserNameAsync(kujdestar, newUserName);
                if (!setUserResult.Succeeded)
                    return BadRequest(new { message = "Emri i përdoruesit nuk u ndryshua.", errors = setUserResult.Errors.Select(e => e.Description).ToList() });
                kujdestar.NormalizedUserName = newUserName.ToUpperInvariant();
            }

            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                await userManager.RemovePasswordAsync(kujdestar);
                var addPassResult = await userManager.AddPasswordAsync(kujdestar, dto.NewPassword);
                if (!addPassResult.Succeeded)
                    return BadRequest(new { message = "Fjalëkalimi i ri nuk u pranua.", errors = addPassResult.Errors.Select(e => e.Description).ToList() });
            }

            if (dto.Emri != null) kujdestar.Emri = dto.Emri;
            if (dto.Mbiemri != null) kujdestar.Mbiemri = dto.Mbiemri;
            if (dto.Email != null)
            {
                kujdestar.Email = dto.Email;
                kujdestar.NormalizedEmail = dto.Email.Trim().ToUpperInvariant();
            }

            var updateResult = await userManager.UpdateAsync(kujdestar);
            if (!updateResult.Succeeded)
                return BadRequest(new { message = "Ndryshimet nuk u ruajtën.", errors = updateResult.Errors.Select(e => e.Description).ToList() });

            await dbContext.SaveChangesAsync();

            if (dto.KlasatId.HasValue)
            {
                var klasa = await dbContext.Klasat.FindAsync(dto.KlasatId.Value);
                if (klasa != null)
                {
                    klasa.KujdestariId = kujdestar.Id;
                    await dbContext.SaveChangesAsync();
                }
            }

            var response = new KujdestariListDto { Id = kujdestar.Id, Emri = kujdestar.Emri, Mbiemri = kujdestar.Mbiemri };
            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Delete(int id)
        {
            var kujdestar = await userManager.FindByIdAsync(id.ToString());
            if (kujdestar == null)
                return NotFound(new { message = "Kujdestari nuk u gjet." });

            var klasatMeKeteKujdestar = await dbContext.Klasat.Where(k => k.KujdestariId == id).ToListAsync();
            foreach (var klasa in klasatMeKeteKujdestar)
            {
                klasa.KujdestariId = null;
            }
            await dbContext.SaveChangesAsync();

            var deleteResult = await userManager.DeleteAsync(kujdestar);
            if (!deleteResult.Succeeded)
            {
                var errors = deleteResult.Errors.Select(e => e.Description).ToList();
                return BadRequest(new { message = "Kujdestari nuk u fshi.", errors });
            }

            return NoContent();
        }

        [HttpPut]
        [Route("swapKujdestari/{kujestari1}/{kujestari2}")]

        public async Task<IActionResult> SwapKujdestari( int kujestari1, int kujestari2)
        {

            var listOfKujdestart = new List<int>
            {
                kujestari1,
                kujestari2
            };


            var getKujdestaret = await dbContext.kujdestari.Where(x=> listOfKujdestart.Contains(x.Id)).ToListAsync();

            //if (getKujdestaret.Any(x => x.Id == kujestari1) && getKujdestaret.Any(x => x.Id == kujestari2))
            //{
            //    var profa1 = getKujdestaret.FirstOrDefault(x => x.Id == kujestari1).KlasatId;
            //    var profa2 = getKujdestaret.FirstOrDefault(x => x.Id == kujestari2).KlasatId;

            //    var profaKlasaId1 = profa1;
            //    var profaKlasaId2 = profa2;

            //    profa1 = profaKlasaId2;
            //    profa2 = profaKlasaId1;

            //    dbContext.UpdateRange(getKujdestaret);
            //    await dbContext.SaveChangesAsync();
            //}
            return Ok(); 


            //var kujdestariIPare = (await dbContext.kujdestari.FirstOrDefaultAsync(k => k.Id == kujestari1)).KlasatId;
         
            //var kujdestariIDyte = (await dbContext.kujdestari.FirstOrDefaultAsync(k => k.Id == kujdestari2)).KlasatId;

            //var tempory = kujdestariIPare;
            //kujdestariIPare = kujdestariIDyte;
            //kujdestariIDyte = tempory;

            //dbContext.Update(kujdestariIPare);
            //dbContext.Update(kujdestariIDyte);



        }


       
    }
}
