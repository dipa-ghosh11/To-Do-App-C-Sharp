using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public class Project
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string ProjectTitle { get; set; } = null!;
    public string ProjectDescription { get; set; } = null!;
    public ProjectStatus ProjectStatus { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsDelete { get; set; } = false;

    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> AssignedUsers { get; set; } = new();

    [BsonRepresentation(BsonType.ObjectId)]
    public string CreatedBy { get; set; } = null!;
}

public enum ProjectStatus{
    Pending,
    InProgress,
    Completed
}