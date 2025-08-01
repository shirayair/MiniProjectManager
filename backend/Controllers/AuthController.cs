using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using System.Text;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;
        private readonly PasswordHasher<User> _passwordHasher = new();

        public AuthController(AppDbContext context, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterDto dto)
        {
            try
            {
                // Check if username already exists
                if (_context.Users.Any(u => u.Username == dto.Username))
                    return BadRequest("Username already exists.");

                // Create new user object
                var user = new User
                {
                    Username = dto.Username
                };

                // Hash the password before saving
                user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

                // Save the user in the database
                _context.Users.Add(user);
                _context.SaveChanges();

                // Generate JWT token for the newly registered user
                var token = GenerateJwtToken(user);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during user registration.");
                return StatusCode(500, "An unexpected error occurred while registering the user.");
            }
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            try
            {
                // Find user by username
                var user = _context.Users.FirstOrDefault(u => u.Username == dto.Username);
                if (user == null)
                    return Unauthorized("Invalid username or password.");

                // Verify the hashed password
                var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
                if (result == PasswordVerificationResult.Failed)
                    return Unauthorized("Invalid username or password.");

                // Generate and return JWT token
                var token = GenerateJwtToken(user);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during user login.");
                return StatusCode(500, "An unexpected error occurred while logging in.");
            }
        }

        // Generates a JWT token for the authenticated user
        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];

            if (string.IsNullOrWhiteSpace(jwtKey) || Encoding.UTF8.GetByteCount(jwtKey) < 32)
                throw new Exception("JWT Key must be at least 256 bits (32 characters).");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
