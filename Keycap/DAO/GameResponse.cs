using System;

using Keycap.Models;

namespace Keycap.DAO
{
    public class GameResponse
    {
        public string GameID { get; set; }

        public string Title { get; set; }

        public Label Label { get; set; }

        public string Text { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
