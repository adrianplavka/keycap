using System.ComponentModel.DataAnnotations;

namespace Keycap.DAO
{
    public class GameStatsPostRequest
    {
        [Required]
        public int KeyHits { get; set; }

        [Required]
        public int KeyMisses { get; set; }

        [Required]
        public double Accuracy { get; set; }

        [Required]
        public double WPM { get; set; }

        [Required]
        public double Time { get; set; }
    }
}
