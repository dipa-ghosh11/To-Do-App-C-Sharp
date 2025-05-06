using System.Text;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Configure MongoDB settings and services
builder.Services.Configure<DatabaseSettings>(builder.Configuration.GetSection("MongoDB"));
builder.Services.AddSingleton(sp =>
{
    var settings = builder.Configuration.GetSection("MongoDB").Get<DatabaseSettings>();
    return new TaskService(settings);
});
// Uncomment this when UserService is ready
// builder.Services.AddSingleton(sp =>
// {
//     var settings = builder.Configuration.GetSection("MongoDB").Get<DatabaseSettings>();
//     return new UserService(settings);
// });

// Add controllers
builder.Services.AddControllers();

// Authentication and Authorization
builder.Services.AddAuthentication("CookieAuth")
    .AddCookie("CookieAuth", options =>
    {
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Strict;
    });

builder.Services.AddAuthorization();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Todo API",
        Version = "v1",
        Description = "A simple ASP.NET Core Web API for managing Todos",
        Contact = new OpenApiContact
        {
            Name = "Biswarup Naha",
            Email = "biswarupnaha@coding-junction.com",
            Url = new Uri("https://www.github.com/biswarup-naha")
        }
    });
});

var app = builder.Build();

// Use Swagger only in development (good practice)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // <== ✅ Missing line added here
}

// Middleware pipeline
app.UseHttpsRedirection();

app.UseCors(policy =>
{
    policy.AllowAnyOrigin()
          .AllowAnyHeader()
          .AllowAnyMethod();
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
