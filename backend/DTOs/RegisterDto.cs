using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class RegisterDto
    {
        [Required]
        [MinLength(3)]
        public string Username { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }
    }
}
