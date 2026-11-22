using BookHaven.Api.Extensions;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Services.AddBookHaven(builder.Configuration);

WebApplication app = builder.Build();
await app.UseBookHavenAsync();
app.Run();
