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
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProjectsController> _logger;

        public ProjectsController(AppDbContext context, ILogger<ProjectsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ✅ GET: /api/projects?limit=5&offset=0
        // Returns paginated list of projects for the authenticated user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects(
            [FromQuery] int limit = 5,
            [FromQuery] int offset = 0)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                var projects = await _context.Projects
                    .Where(p => p.UserId == Guid.Parse(userId))
                    .OrderByDescending(p => p.CreatedAt)
                    .Skip(offset)
                    .Take(limit)
                    .ToListAsync();

                return Ok(projects.Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt,
                    TaskCount = _context.Tasks.Count(t => t.ProjectId == p.Id) 

                }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving projects.");
                return StatusCode(500, "An error occurred while fetching projects.");
            }
        }

        // ✅ GET: /api/projects/{id}
        // Returns a single project by ID including its tasks
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProject(Guid id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                var project = await _context.Projects
                    .Include(p => p.Tasks)
                    .FirstOrDefaultAsync(p => p.Id == id && p.UserId == Guid.Parse(userId));

                if (project == null)
                    return NotFound("Project not found.");

                return new ProjectDto
                {
                    Id = project.Id,
                    Title = project.Title,
                    Description = project.Description,
                    CreatedAt = project.CreatedAt,
                    Tasks = project.Tasks.Select(t => new TaskDto
                    {
                        Id = t.Id,
                        Title = t.Title,
                        IsCompleted = t.IsCompleted,
                        DueDate = t.DueDate,
                        ProjectId = t.ProjectId
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving project {id}.");
                return StatusCode(500, "An error occurred while fetching the project.");
            }
        }

        // ✅ POST: /api/projects
        // Creates a new project for the authenticated user
        // Handles double-clicks by checking if a project with same title exists
        [HttpPost]
        public async Task<ActionResult> CreateProject(CreateProjectDto dto)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                // 💡 Prevent duplicate project title for same user
                var existingProject = await _context.Projects
                    .FirstOrDefaultAsync(p => p.UserId == userId && p.Title == dto.Title);

                if (existingProject != null)
                {
                    return Conflict("A project with this title already exists.");
                }

                var project = new Project
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    UserId = userId
                };

                _context.Projects.Add(project);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProject), new { id = project.Id }, new ProjectDto
                {
                    Id = project.Id,
                    Title = project.Title,
                    Description = project.Description,
                    CreatedAt = project.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating project.");
                return StatusCode(500, "An error occurred while creating the project.");
            }
        }

        // ✅ DELETE: /api/projects/{id}
        // Deletes a project AND all its related tasks in a transaction
        // Safe to call even twice - second call will return 404
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProject(Guid id)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                // Start a transaction to ensure consistency
                using var transaction = await _context.Database.BeginTransactionAsync();

                // Load project with tasks
                var project = await _context.Projects
                    .Include(p => p.Tasks)
                    .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

                if (project == null)
                    return NotFound("Project not found."); // ✅ Second delete attempt returns this

                // Delete related tasks first
                _context.Tasks.RemoveRange(project.Tasks);

                // Then delete the project itself
                _context.Projects.Remove(project);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting project {id}.");
                return StatusCode(500, "An error occurred while deleting the project.");
            }
        }
    }
}
