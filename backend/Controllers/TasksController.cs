// ✅ Updated TasksController.cs with minimal improvements and inline English comments
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<TasksController> _logger;

        public TasksController(AppDbContext context, ILogger<TasksController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ✅ POST: /api/projects/{projectId}/tasks
        [HttpPost("projects/{projectId}/tasks")]
        public async Task<ActionResult<TaskDto>> AddTask(Guid projectId, CreateTaskDto dto)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                // 🔐 Make sure the project belongs to the current user
                var project = await _context.Projects
                    .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

                if (project == null)
                    return NotFound("Project not found.");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState); // ✅ Ensure validation errors are returned properly

                var task = new TaskItem
                {
                    Title = dto.Title,
                    ProjectId = projectId,
                    DueDate = dto.DueDate,
                    IsCompleted = false
                };

                _context.Tasks.Add(task);
                await _context.SaveChangesAsync();

                return Ok(new TaskDto
                {
                    Id = task.Id,
                    Title = task.Title,
                    ProjectId = task.ProjectId,
                    IsCompleted = task.IsCompleted,
                    DueDate = task.DueDate
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding task to project {projectId}.");
                return StatusCode(500, "An error occurred while adding the task.");
            }
        }

        // ✅ PUT: /api/tasks/{taskId}
        [HttpPut("tasks/{taskId}")]
        public async Task<IActionResult> UpdateTask(Guid taskId, UpdateTaskDto dto)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                // 🔐 Ensure user owns the task via project
                var task = await _context.Tasks
                    .Include(t => t.Project)
                    .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

                if (task == null)
                    return NotFound("Task not found.");

                task.Title = dto.Title;
                task.IsCompleted = dto.IsCompleted;
                task.DueDate = dto.DueDate;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating task {taskId}.");
                return StatusCode(500, "An error occurred while updating the task.");
            }
        }

        // ✅ DELETE: /api/tasks/{taskId}
        [HttpDelete("tasks/{taskId}")]
        public async Task<IActionResult> DeleteTask(Guid taskId)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                // 🔐 Make sure the task belongs to this user's project
                var task = await _context.Tasks
                    .Include(t => t.Project)
                    .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

                if (task == null)
                    return NotFound("Task not found.");

                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting task {taskId}.");
                return StatusCode(500, "An error occurred while deleting the task.");
            }
        }
    }
}
