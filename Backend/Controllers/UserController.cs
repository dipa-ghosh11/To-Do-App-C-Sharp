using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Utils;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly IConfiguration _configuration;

        public UserController(UserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (await _userService.GetByEmail(registerDto.Email) != null)
                {
                    return BadRequest(new ApiResponse<string>
                    {
                        Success = false,
                        Message = "User already exists"
                    });
                }
                var user = new User
                {
                    Id = "",
                    FullName = registerDto.FullName,
                    Email = registerDto.Email,
                    Role = registerDto.Role,
                    Password = registerDto.Password,
                    IsActive=registerDto.IsActive
                };

                await _userService.Add(user);

                var token = JwtUtil.GetJwtToken(user, _configuration);

                return Ok(new ApiResponse<UserDto>
                {
                    Success = true,
                    Message = "User registered",
                    Data = new UserDto
                    {
                        Id = user.Id,
                        FullName= user.FullName,
                        Email = user.Email,
                        Role = user.Role,
                        IsActive = user.IsActive
                    },
                    Token = token
                });
            }
            catch (System.Exception e)
            {
                return BadRequest(new ApiResponse<string>
                {
                    Success = false,
                    Message = "Something went wrong: " + e.Message
                });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var user = await _userService.GetByEmail(loginDto.Email);
                if (user != null && _userService.CheckPassword(user, loginDto.Password))
                {
                    var token = JwtUtil.GetJwtToken(user, _configuration);

                    return Ok(new ApiResponse<UserDto>
                    {
                        Success = true,
                        Message = "Login successful",
                        Data = new UserDto
                        {
                            Id = user.Id,
                            FullName = user.FullName,
                            Email = user.Email,
                            Role = user.Role,
                            IsActive = user.IsActive
                        },
                        Token = token
                    });
                }
                return BadRequest(new ApiResponse<string>
                {
                    Success = false,
                    Message = "Invalid credentials"
                });
            }
            catch (System.Exception e)
            {
                return BadRequest(new ApiResponse<string>
                {
                    Success = false,
                    Message = "Something went wrong: " + e.Message
                });
            }
        }

        [Authorize(Roles ="admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var users = await _userService.GetAll();
                return Ok(new ApiResponse<List<User>>
                {
                    Success = true,
                    Message = "Users fetched",
                    Data = users
                });
            }
            catch (System.Exception)
            {
                return BadRequest(new ApiResponse<List<User>>
                {
                    Success = false,
                    Message = "Users not found"
                });
            }
        }

        [Authorize(Roles ="admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var user = await _userService.GetById(id);
                return Ok(new ApiResponse<User>
                {
                    Success = true,
                    Message = "User fetched",
                    Data = user
                });
            }
            catch (System.Exception)
            {
                return BadRequest(new ApiResponse<User>
                {
                    Success = false,
                    Message = "User not found"
                });
            }
        }

        [Authorize(Roles ="admin")]
        [HttpPost]
        public async Task<IActionResult> Add(User user)
        {
            try
            {
                await _userService.Add(user);
                return Ok(new ApiResponse<User>
                {
                    Success = true,
                    Message = "User added",
                    Data = user
                });
            }
            catch (System.Exception)
            {
                return BadRequest(new ApiResponse<User>
                {
                    Success = false,
                    Message = "User not added"
                });
            }
        }

        [Authorize(Roles="admin,user")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, User user)
        {
            try
            {
                await _userService.Update(id, user);
                return Ok(new ApiResponse<User>
                {
                    Success = true,
                    Message = "User updated",
                    Data = user
                });
            }
            catch (System.Exception)
            {
                return NotFound(new ApiResponse<User>
                {
                    Success = false,
                    Message = "User with this id not found"
                });
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                await _userService.Delete(id);
                return Ok(new ApiResponse<User>
                {
                    Success = true,
                    Message = "User deleted"
                });
            }
            catch (System.Exception)
            {
                return NotFound(new ApiResponse<User>
                {
                    Success = false,
                    Message = "User with this id not found"
                });
            }
        }
    }
}
