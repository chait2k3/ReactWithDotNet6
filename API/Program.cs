using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors();
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add db context
builder.Services.AddDbContext<StoreContext>(); 

var app = builder.Build();

// migrate any database changes on startup (includes initial db creation)
// use logger to show any error messages
using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<StoreContext>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    dbContext.Database.Migrate();
    DbInitializer.Initialize(dbContext);
} catch(Exception ex) 
{
    logger.LogError(ex, "Problem in migrating data");
}

// Configure the HTTP request pipeline.
// error handling middleware
app.UseMiddleware<ExceptionMiddleware>();

// swagger middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// http request redirection
// app.UseHttpsRedirection();

// global cors policy
app.UseCors(x =>
    x.AllowAnyHeader()
    .AllowAnyMethod()
    //.AllowAnyOrigin()
    .AllowCredentials()
    .WithOrigins("http://localhost:3000")
);

// autentication and authorization middleware
app.UseAuthorization();

app.MapControllers();

app.Run();
