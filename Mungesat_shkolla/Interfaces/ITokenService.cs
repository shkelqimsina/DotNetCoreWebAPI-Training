using Mungesat_shkolla.Models;

namespace Mungesat_shkolla.Interfaces;

public interface ITokenService
{
    Task<string> CreateTokenAsync(Kujdestari user);
}