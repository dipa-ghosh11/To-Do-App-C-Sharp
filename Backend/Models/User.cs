using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Backend.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("fullName")]
    public string FullName { get; set; } = null!;

    [BsonElement("email")]
    public string Email { get; set; } = null!;

    [BsonElement("password")]
    public string Password { get; set; } = null!;

    [BsonElement("role")]
    public UserRole Role { get; set; } 

    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public void HashPassword()
    {
        if (!string.IsNullOrWhiteSpace(Password))
        {
            Password = BCrypt.Net.BCrypt.HashPassword(Password);
        }
    }

    public bool ValidatePassword(string passwordToCheck)
    {
        return BCrypt.Net.BCrypt.Verify(passwordToCheck, Password);
    }
}

public enum UserRole{
    admin,
    user
}
