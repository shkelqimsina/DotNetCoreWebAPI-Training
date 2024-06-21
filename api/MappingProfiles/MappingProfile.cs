using AutoMapper;
using api.Models;
using api.DTOs;

namespace api.MappingProfiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Klasa, KlasaDto>().ReverseMap();
        CreateMap<Nxenesi, NxenesiDto>().ReverseMap();
        CreateMap<Kujdestari, KujdestariDto>().ReverseMap();
    }
}