using Microsoft.EntityFrameworkCore;
using API.Data;

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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

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

app.UseHttpsRedirection();

// global cors policy
app.UseCors(x =>
    x.AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod()
);

app.UseAuthorization();

app.MapControllers();

app.Run();
