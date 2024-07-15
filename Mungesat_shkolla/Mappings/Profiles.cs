using AutoMapper;
using Mungesat_shkolla.DTO;
using Mungesat_shkolla.Models;

namespace Mungesat_shkolla.Mappings
{
    public class Profiles : Profile
    {
        public Profiles()
        {
            CreateMap<Nxenesi, NxenesitDto>().ReverseMap();
            CreateMap<Nxenesi, UpdateNxenesitDto>().ReverseMap();
            CreateMap<AddNxenesitDTO, Nxenesi>().ReverseMap();
            CreateMap<KlasatDto, Klasat>().ReverseMap();
            CreateMap<KujdestariDto, Kujdestari>().ReverseMap();
            CreateMap<KujdestariUpdate, Kujdestari>().ReverseMap();
            
        }
    }
}
