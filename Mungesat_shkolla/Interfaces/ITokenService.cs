using Mungesat_shkolla.Models;

namespace Mungesat_shkolla.Interfaces;
public interface ITokenService
    {
        string CreateToken(Kujdestari user);
    }