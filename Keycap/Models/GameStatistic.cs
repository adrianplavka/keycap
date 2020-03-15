using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Keycap.Models
{
    [Table("GameStatistic")]
    public class GameStatistic
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string GameStatisticID { get; set; }

        [ForeignKey("Game")]
        public string GameID { get; set; }
        public Game Game { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }
    }
}
