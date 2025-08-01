using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.Models
{
    public class TaskItem
    {
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; }

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; } = false;

        // Relationship
        public Guid ProjectId { get; set; }
        public Project Project { get; set; }
    }
}
