using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateTaskDto
    {
        // The title of the task is required and must be between 3 and 100 characters
        [Required(ErrorMessage = "Title is required.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters.")]
        public string Title { get; set; } = string.Empty;

        // Optional due date for the task (nullable)
        public DateTime? DueDate { get; set; }
    }
}
