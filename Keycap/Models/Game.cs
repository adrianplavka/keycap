using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Keycap.Models
{
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
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; }

        [Required]
        public Label Label { get; set; }

        [Required]
        [StringLength(500, MinimumLength = 10)]
        public string Text { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        public ICollection<GameStatistic> GameStatistics { get; set; }
    }
}
