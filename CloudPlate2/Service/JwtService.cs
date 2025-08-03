using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;


namespace CloudPlate2.Service;

public class JwtService
{
    private readonly JwtConfig config;

    public JwtService(JwtConfig config)
    {
        this.config = config;
    }

    public string GenerateToken(string userId,TimeSpan expire)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, userId)
            /*new Claim(ClaimTypes.Role,"User"),
            new Claim(ClaimTypes.Role,"Admin")*/
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        Console.WriteLine(DateTime.Now.Ticks);
        var token = new JwtSecurityToken(
            issuer: config.Issuer,
            audience: config.Audience,
            claims: claims,
            expires: DateTime.Now.AddDays(expire.TotalDays),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}