using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mungesat_shkolla.DTO;
using Mungesat_shkolla.Repositories;

namespace Mungesat_shkolla.DTO
{
    public class KujdestariUpdate
    {
        public int ActualKujdstari { get; set; }
        public int DestinationKujdestari { get; set; }
        //public int AkutalKlasaId { get; set; }
        //public int DestinationKlasaId { get; set; }
    }
}

