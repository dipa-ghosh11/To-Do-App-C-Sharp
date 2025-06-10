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


    // public async Task<List<Project>> GetAll() => await _projects.Find(Project => true).ToListAsync();
    public async Task<List<Project>> GetAll(int page, int size, string? status, string? search)
    {
        var filterBuilder = Builders<Project>.Filter;
        var filter = filterBuilder.Empty;

        if (!string.IsNullOrEmpty(status))
        {
            filter &= filterBuilder.Eq(p => p.ProjectStatus, Enum.Parse<ProjectStatus>(status, true));
        }

        if (!string.IsNullOrEmpty(search))
        {
            filter &= filterBuilder.Or(
                filterBuilder.Regex(p => p.ProjectTitle, new MongoDB.Bson.BsonRegularExpression(search, "i")),
                filterBuilder.Regex(p => p.ProjectDescription, new MongoDB.Bson.BsonRegularExpression(search, "i"))
            );
        }

        return await _projects
            .Find(filter)
            .Skip((page - 1) * size)
            .Limit(size)
            .ToListAsync();
    }

    public async Task<long> GetTotalCount(string? status, string? search)
    {
        var filterBuilder = Builders<Project>.Filter;
        var filter = filterBuilder.Empty;

        if (!string.IsNullOrEmpty(status))
        {
            filter &= filterBuilder.Eq(p => p.ProjectStatus, Enum.Parse<ProjectStatus>(status, true));
        }

        if (!string.IsNullOrEmpty(search))
        {
            filter &= filterBuilder.Or(
                filterBuilder.Regex(p => p.ProjectTitle, new MongoDB.Bson.BsonRegularExpression(search, "i")),
                filterBuilder.Regex(p => p.ProjectDescription, new MongoDB.Bson.BsonRegularExpression(search, "i"))
            );
        }

        return await _projects.CountDocumentsAsync(filter);
    }



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
