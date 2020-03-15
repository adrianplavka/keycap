using Microsoft.EntityFrameworkCore;

namespace Keycap.Models.DAL
{
    public class KeycapDbContext : DbContext
    {
        public KeycapDbContext(DbContextOptions<KeycapDbContext> options) : base(options)
        {

        }

        public DbSet<Game> Games { get; set; }
        public DbSet<GameStatistic> GameStatistics { get; set; }
    }
}
