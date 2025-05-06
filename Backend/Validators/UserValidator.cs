using Backend.Models;
using FluentValidation;

namespace Backend.Validators
{
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            RuleFor(user => user.FullName).NotEmpty().WithMessage("Full name is required.");
            RuleFor(user => user.Email).NotEmpty().EmailAddress().WithMessage("Valid email is required.");
            RuleFor(user => user.Password).NotEmpty().WithMessage("Password is required.");
            RuleFor(user => user.Role).IsInEnum().WithMessage("Role must be either 'user' or 'admin'.");
        }
    }
}
