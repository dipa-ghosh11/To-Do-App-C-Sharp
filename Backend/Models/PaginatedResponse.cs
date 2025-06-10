using System;

namespace Backend.Models;

public class PaginatedResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = "";
    public List<T> Data { get; set; } = new();
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public long TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

