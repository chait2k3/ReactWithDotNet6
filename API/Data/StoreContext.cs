using API.Entities;
using API.Entities.OrderAggregrate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User, Role, int>
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
        }

        /*protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            //var connectionString = configuration.GetConnectionString("DefaultConnection");
            //optionsBuilder.UseSqlite(connectionString);
            
            var connectionString = configuration.GetConnectionString("PGServerConnection");
            optionsBuilder.UseNpgsql(connectionString);
        
        } */

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            
            // build one to one relationship between user and address
            builder.Entity<User>()
                .HasOne(a => a.Address)
                .WithOne()
                .HasForeignKey<UserAddress>(a => a.Id)
                .OnDelete(DeleteBehavior.Cascade);

            // create roles in the role table at the time of db creation
            // role table is created as a part of identity framework
            builder.Entity<Role>()
                .HasData(
                    new Role{Id = 1, Name = "MEMBER", NormalizedName = "MEMBER"},
                    new Role{Id = 2, Name = "ADMIN", NormalizedName = "ADMIN"}
                );
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<Order> Orders { get; set; }
    }
}