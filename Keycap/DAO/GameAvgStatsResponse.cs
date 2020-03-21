namespace Keycap.DAO
{
    public class GameAvgStatsResponse
    {
        public double AvgKeyHits { get; set; } = 0.0;

        public double AvgKeyMisses { get; set; } = 0.0;

        public double AvgAccuracy { get; set; } = 0.0;

        public double AvgWPM { get; set; } = 0.0;

        public double AvgTime { get; set; } = 0.0;
    }
}
