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

    public async Task Update(string id, Project updatedProject) =>
        await _projects.ReplaceOneAsync(Project => Project.Id == id, updatedProject);

    public async Task Delete(string id) =>
        await _projects.DeleteOneAsync(Project => Project.Id == id);

    public async Task<List<Project>> GetByAssignedUser(string userId)
    {
        return await _projects.Find(p => p.AssignedUsers.Contains(userId)).ToListAsync();
    }

}
