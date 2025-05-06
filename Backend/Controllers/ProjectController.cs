using Backend.Models;
using Backend.Services;
using Backend.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController(ProjectService projectService) : ControllerBase
    {
        private readonly ProjectService _projectService=projectService;

        [HttpGet]
        public async Task<ActionResult<List<Project>>> GetAll()
        {
            try
            {
                var projects = await _projectService.GetAll();
                return Ok(new ApiResponse<List<Project>>
                {
                    Success = projects != null,
                    Message = projects != null ? "projects fetched" : "projects not found",
                    Data = projects
                });
            }
            catch (System.Exception e)
            {

                return BadRequest(new ApiResponse<List<Project>>
                {
                    Success = false,
                    Message = e.Message
                });
            }

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetById(string id)
        {
            try
            {
                var Project = await _projectService.GetById(id);
                return Ok(new ApiResponse<Project>
                {
                    Success = Project != null,
                    Message = Project != null ? "Project fetched" : "Project not found",
                    Data = Project
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
        public async Task<ActionResult<Project>> Add(Project Project)
        {
            try
            {
                await _projectService.Add(Project);
                return Ok(new ApiResponse<Project>
                {
                    Success = true,
                    Message = "Project added",
                    Data = Project
                });
            }
            catch (System.Exception e)
            {
                return BadRequest(new ApiResponse<Project>
                {
                    Success = false,
                    Message = e.Message
                });
            }

        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(string id, Project Project)
        {
            try
            {
                await _projectService.Update(id, Project);
                return Ok(new ApiResponse<Project>
                {
                    Success = true,
                    Message = "Project updated",
                    Data = Project
                });
            }
            catch (System.Exception e)
            {
                return BadRequest(new ApiResponse<Project>
                {
                    Success = false,
                    Message = e.Message
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
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
            catch (System.Exception e)
            {
                return BadRequest(new ApiResponse<Project>
                {
                    Success = false,
                    Message = e.Message
                });
            }
        }

    }
}
