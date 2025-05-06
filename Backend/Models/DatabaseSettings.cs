using System;

namespace Backend.Models
{
    public class DatabaseSettings
    {
        public required string ConnectionString { get; set; }
        public required string DatabaseName { get; set; }
        public required string TaskCollectionName { get; set; }
        public required string UserCollectionName { get; set; }
        public required string ProjectCollectionName { get; set; }
    }
}