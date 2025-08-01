using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateProjectDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }
    }
}
