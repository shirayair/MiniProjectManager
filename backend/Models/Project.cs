using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.Models
{
    public class Project
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relationship
        public Guid UserId { get; set; }
        public User User { get; set; }

        public List<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}
