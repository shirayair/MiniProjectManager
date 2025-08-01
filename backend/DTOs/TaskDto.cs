namespace backend.DTOs
{
    public class TaskDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? DueDate { get; set; }
        public Guid ProjectId { get; set; }
    }
}
