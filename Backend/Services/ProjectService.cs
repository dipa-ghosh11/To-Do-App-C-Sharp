using System;
using Backend.Models;
using MongoDB.Driver;

namespace Backend.Services;

public class ProjectService
{
    private readonly IMongoCollection<Project> _projects;

    public ProjectService(DatabaseSettings settings)
    {
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _projects = database.GetCollection<Project>(settings.ProjectCollectionName);
    }


    public async Task<List<Project>> GetAll() => await _projects.Find(Project => true).ToListAsync();

    public async Task<Project> GetById(string id) => await _projects.Find(Project => Project.Id == id).FirstOrDefaultAsync();

    public async Task Add(Project Project) => await _projects.InsertOneAsync(Project);

    public async Task Update(string id, Project updatedProject)
    {
        var filter = Builders<Project>.Filter.Eq(p => p.Id, id);

        var update = Builders<Project>.Update
            .Set(p => p.ProjectTitle, updatedProject.ProjectTitle)
            .Set(p => p.ProjectDescription, updatedProject.ProjectDescription)
            .Set(p => p.ProjectStatus, updatedProject.ProjectStatus)
            .Set(p => p.StartDate, updatedProject.StartDate)
            .Set(p => p.EndDate, updatedProject.EndDate)
            .Set(p => p.AssignedUsers, updatedProject.AssignedUsers);

        await _projects.UpdateOneAsync(filter, update);
    }

    public async Task Delete(string id) =>
        await _projects.DeleteOneAsync(Project => Project.Id == id);

    public async Task<List<Project>> GetByAssignedUser(string userId)
    {
        return await _projects.Find(p => p.AssignedUsers.Contains(userId)).ToListAsync();
    }

}
