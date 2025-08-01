namespace backend.DTOs
{
    public class ProjectDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<TaskDto> Tasks { get; set; } = new();
        public int TaskCount { get; set; }
    }
}
