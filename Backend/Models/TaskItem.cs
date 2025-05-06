using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public class TaskItem
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [Required]
    [BsonElement("taskTitle")]
    public required string TaskTitle { get; set; }

    [BsonElement("taskDescription")]
    public string? TaskDescription { get; set; }

    [BsonElement("taskStatus")]
    public required string TaskStatus { get; set; }

    [BsonElement("startDate")]
    public DateTime StartDate { get; set; }

    [BsonElement("endDate")]
    public DateTime EndDate { get; set; }

    [BsonElement("isDelete")]
    public bool IsDelete { get; set; } = false;

    [BsonElement("projectId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProjectId { get; set; }

    [BsonElement("assignedUsers")]
    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> AssignedUsers { get; set; }

    [BsonElement("createdBy")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string CreatedBy { get; set; }

}
