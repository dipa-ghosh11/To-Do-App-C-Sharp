using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Models;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Utils;

public class JwtUtil
{
    public static string GetJwtToken(User user, IConfiguration config){
        var claims = new[]
       {
            new Claim(JwtRegisteredClaimNames.Sub, config["Jwt:Subject"]),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("_id", user.Id.ToString()), 
            new Claim("email", user.Email),
            new Claim("fullName", user.FullName),
            new Claim("role", user.Role.ToString()),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("isActive", user.IsActive.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
