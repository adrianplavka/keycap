using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Keycap.DAL
{
    public class KeycapDbContext : DbContext
    {
        public KeycapDbContext(DbContextOptions<KeycapDbContext> options) : base(options)
        {

        }

        public DbSet<Game> Games { get; set; }
        public DbSet<GameStatistic> GameStatistics { get; set; }
    }

    public enum Label
    {
        Easy, Medium, Hard
    }

    [Table("Game")]
    public class Game
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string GameID { get; set; }

        [Required]
        public string Text { get; set; }

        [Required]
        public Label Label { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        public ICollection<GameStatistic> GameStatistics { get; set; }
    }

    [Table("GameStatistic")]
    public class GameStatistic
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string GameStatisticID { get; set; }

        [ForeignKey("Game")]
        public string GameID { get; set; }
        public Game Game { get; set; }
    }
}
