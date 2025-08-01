using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class UpdateTaskDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? DueDate { get; set; }

    }
}
