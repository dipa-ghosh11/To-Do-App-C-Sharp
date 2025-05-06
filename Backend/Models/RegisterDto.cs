using System;

namespace Backend.Models;

public class RegisterDto
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public UserRole Role { get; set; }
    public bool IsActive { get; set; }=true;
}
