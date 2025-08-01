using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        public Guid Id { get; set; }

        [Required]
        [MinLength(3)]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }
    
        public List<Project>? Projects { get; set; }

    }
}