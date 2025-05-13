using System.Linq;
using Backend.Models;
using Backend.Services;
using Backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ProjectController(ProjectService projectService) : ControllerBase
{
    private readonly ProjectService _projectService = projectService;

    private string GetUserId() => User.FindFirst("id")?.Value!;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<Project>>>> GetAll()
    {
        try
        {
            var projects = await _projectService.GetAll();
            return Ok(new ApiResponse<List<Project>>
            {
                Success = projects.Any(),
                Message = projects.Any() ? "Projects fetched" : "No projects found",
                Data = projects
            });
        }
        catch (Exception e)
        {
            return BadRequest(new ApiResponse<List<Project>>
            {
                Success = false,
                Message = e.Message
            });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<Project>>> GetById(string id)
    {
        try
        {
            var project = await _projectService.GetById(id);
            return Ok(new ApiResponse<Project>
            {
                Success = project != null,
                Message = project != null ? "Project fetched" : "Project not found",
                Data = project
            });
        }
        catch (Exception e)
        {
            return BadRequest(new ApiResponse<Project>
            {
                Success = false,
                Message = e.Message
            });
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<Project>>> Add([FromBody] Project project)
    {
        try
        {
            if (project.AssignedUsers == null || !project.AssignedUsers.All(id => ObjectId.TryParse(id, out _)))
            {
                return BadRequest(new ApiResponse<Project>
                {
                    Success = false,
                    Message = "Invalid user IDs in assignedUsers"
                });
            }

            project.CreatedBy = GetUserId();
            project.ProjectStatus = ProjectStatus.Pending;
            project.IsDelete = false;

            await _projectService.Add(project);

            return Ok(new ApiResponse<Project>
            {
                Success = true,
                Message = "Project added",
                Data = project
            });
        }
        catch (Exception e)
        {
            return BadRequest(new ApiResponse<Project>
            {
                Success = false,
                Message = e.Message
            });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<Project>>> Update(string id, [FromBody] Project project)
    {
        try
        {
            await _projectService.Update(id, project);
            return Ok(new ApiResponse<Project>
            {
                Success = true,
                Message = "Project updated",
                Data = project
            });
        }
        catch (Exception e)
        {
            return BadRequest(new ApiResponse<Project>
            {
                Success = false,
                Message = e.Message
            });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<Project>>> Delete(string id)
    {
        try
        {
            await _projectService.Delete(id);
            return Ok(new ApiResponse<Project>
            {
                Success = true,
                Message = "Project deleted"
            });
        }
        catch (Exception e)
        {
            return BadRequest(new ApiResponse<Project>
            {
                Success = false,
                Message = e.Message
            });
        }
    }

    [HttpGet("user")]
    public async Task<ActionResult<ApiResponse<List<Project>>>> GetProjectsByUser()
    {
        try
        {
            var userId = GetUserId();
            var projects = await _projectService.GetByAssignedUser(userId);

            return Ok(new ApiResponse<List<Project>>
            {
                Success = projects.Any(),
                Message = projects.Any() ? "Projects fetched" : "Projects not found",
                Data = projects
            });
        }
        catch (Exception e)
        {
            return BadRequest(new ApiResponse<List<Project>>
            {
                Success = false,
                Message = e.Message
            });
        }
    }
}
