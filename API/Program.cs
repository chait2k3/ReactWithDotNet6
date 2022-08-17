using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Middleware;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors();
builder.Services.AddControllers();

// for identity framework
builder.Services.AddIdentityCore<User>(opt => {
                    opt.User.RequireUniqueEmail = true;
                })
                .AddRoles<Role>()
                .AddEntityFrameworkStores<StoreContext>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt => {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                                        .GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
                    };
                });

builder.Services.AddAuthorization();

// add token service
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<PaymentService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new OpenApiInfo{ Title = "API", Version= " V1"});
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT auth header",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>{}
        }
    });
});

// Add db context
builder.Services.AddDbContext<StoreContext>(); 

var app = builder.Build();

// migrate any database changes on startup (includes initial db creation)
// use logger to show any error messages
using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<StoreContext>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    await dbContext.Database.MigrateAsync();
    await DbInitializer.Initialize(dbContext, userManager);
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

app.UseRouting();

// serve static files for react app
app.UseDefaultFiles();
app.UseStaticFiles();


// global cors policy
app.UseCors(x =>
    x.AllowAnyHeader()
    .AllowAnyMethod()
    //.AllowAnyOrigin()
    .AllowCredentials()
    .WithOrigins("http://localhost:3000")
);

// autentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

await app.RunAsync();
