using System;
using Backend.Models;
using MongoDB.Driver;

namespace Backend.Services;

public class TaskService
{
    private readonly IMongoCollection<TaskItem> _taskItems;

    public TaskService(DatabaseSettings settings)
    {
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _taskItems = database.GetCollection<TaskItem>(settings.TaskCollectionName);
    }

    // public async Task<List<TaskItem>> GetAll() => await _taskItems.Find(TaskItem => true).ToListAsync();

    public async Task<List<TaskItem>> GetFilteredPaginated(
    int page = 1,
    int pageSize = 10,
    string? search = null,
    string? status = null)
    {
        var filterBuilder = Builders<TaskItem>.Filter;
        var filter = filterBuilder.Empty;

        if (!string.IsNullOrEmpty(search))
        {
            var searchFilter = filterBuilder.Or(
                filterBuilder.Regex(t => t.TaskTitle, new MongoDB.Bson.BsonRegularExpression(search, "i")),
                filterBuilder.Regex(t => t.TaskDescription, new MongoDB.Bson.BsonRegularExpression(search, "i"))
            );
            filter &= searchFilter;
        }

        if (!string.IsNullOrEmpty(status))
        {
            filter &= filterBuilder.Eq(t => t.TaskStatus, status);
        }

        return await _taskItems
            .Find(filter)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();
    }

    public async Task<long> GetFilteredCount(string? search = null, string? status = null)
    {
        var filterBuilder = Builders<TaskItem>.Filter;
        var filter = filterBuilder.Empty;

        if (!string.IsNullOrEmpty(search))
        {
            var searchFilter = filterBuilder.Or(
                filterBuilder.Regex(t => t.TaskTitle, new MongoDB.Bson.BsonRegularExpression(search, "i")),
                filterBuilder.Regex(t => t.TaskDescription, new MongoDB.Bson.BsonRegularExpression(search, "i"))
            );
            filter &= searchFilter;
        }

        if (!string.IsNullOrEmpty(status))
        {
            filter &= filterBuilder.Eq(t => t.TaskStatus, status);
        }

        return await _taskItems.CountDocumentsAsync(filter);
    }


    public async Task<TaskItem> GetById(string id) => await _taskItems.Find(TaskItem => TaskItem.Id == id).FirstOrDefaultAsync();

    public async Task Add(TaskItem TaskItem) => await _taskItems.InsertOneAsync(TaskItem);

    public async Task Update(string id, TaskItem updatedTodo)
    {
        var filter = Builders<TaskItem>.Filter.Eq(t => t.Id, id);

        var update = Builders<TaskItem>.Update
            .Set(t => t.TaskTitle, updatedTodo.TaskTitle)
            .Set(t => t.TaskDescription, updatedTodo.TaskDescription)
            .Set(t => t.TaskStatus, updatedTodo.TaskStatus)
            .Set(t => t.EndDate, updatedTodo.EndDate)
            .Set(t => t.AssignedUsers, updatedTodo.AssignedUsers);

        await _taskItems.UpdateOneAsync(filter, update);
    }


    public async Task Delete(string id) =>
        await _taskItems.DeleteOneAsync(TaskItem => TaskItem.Id == id);

    public async Task<List<TaskItem>> GetByAssignedUser(string userId)
    {
        return await _taskItems.Find(p => p.AssignedUsers.Contains(userId)).ToListAsync();
    }
}

