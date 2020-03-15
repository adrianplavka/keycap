using System.ComponentModel.DataAnnotations;

using Keycap.Models;

namespace Keycap.DAO
{
    public class GamePostRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; }

        [Required]
        public Label Label { get; set; }

        [Required]
        [StringLength(500, MinimumLength = 10)]
        public string Text { get; set; }
    }
}
