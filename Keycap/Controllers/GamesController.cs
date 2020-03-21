using System;
using System.Net.Mime;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

using Keycap.Models.DAL;
using Keycap.Models;
using Keycap.DAO;

namespace Keycap.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GamesController : ControllerBase
    {
        private readonly ILogger<GamesController> _logger;
        private readonly KeycapDbContext _context;

        public GamesController(ILogger<GamesController> logger, KeycapDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        // GET api/games/:id
        [HttpGet("{id}")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<GameResponse> Get(string id)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null)
            {
                Response.StatusCode = 404;
                return null;
            }

            return new GameResponse
            {
                GameID = game.GameID,
                Title = game.Title,
                Label = game.Label,
                Text = game.Text,
                CreatedAt = game.CreatedAt
            };
        }

        // GET api/games/random
        [HttpGet("random")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<GameResponse> GetRandom()
        {
            var games = await _context.Games
                .FromSqlRaw(
                    "SELECT * FROM \"Game\" " +
                    "ORDER BY random() " +
                    "LIMIT 1"
                )
                .ToListAsync()
                .ConfigureAwait(false);

            if (games.Count == 0)
            {
                Response.StatusCode = 404;
                return null;
            }

            var randomGame = games[0];

            return new GameResponse
            {
                GameID = randomGame.GameID,
                Title = randomGame.Title,
                Label = randomGame.Label,
                Text = randomGame.Text,
                CreatedAt = randomGame.CreatedAt
            };
        }

        // POST api/games
        [HttpPost]
        [Produces(MediaTypeNames.Application.Json)]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<string> Post(GamePostRequest body)
        {
            if (!ModelState.IsValid)
            {
                Response.StatusCode = 400;
                return null;
            }
            else
            {
                var id = Guid.NewGuid().ToString();

                await _context.AddAsync(new Game
                {
                    GameID = id,
                    Title = body.Title,
                    Label = body.Label,
                    Text = body.Text,
                    CreatedAt = DateTime.Now
                });
                await _context.SaveChangesAsync()
                    .ConfigureAwait(false);

                Response.StatusCode = 201;
                return id;
            }
        }

        // GET api/games/:id/stats/avg
        [HttpGet("{id}/stats/avg")]
        [Produces(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<GameAvgStatsResponse> GetAvgGameStats(string id)
        {
            if (await _context.Games.FindAsync(id) == null)
            {
                Response.StatusCode = 404;
                return null;
            }

            var query = _context.GameStatistics.Where(x => x.GameID == id);
            var averages = new GameAvgStatsResponse
            { 
                AvgTime = await query.AverageAsync(x => (double?)x.Time).ConfigureAwait(false) ?? 0.0,
                AvgKeyHits = await query.AverageAsync(x => (int?)x.KeyHits).ConfigureAwait(false) ?? 0,
                AvgKeyMisses = await query.AverageAsync(x => (int?)x.KeyMisses).ConfigureAwait(false) ?? 0,
                AvgAccuracy = await query.AverageAsync(x => (double?)x.Accuracy).ConfigureAwait(false) ?? 0.0,
                AvgWPM = await query.AverageAsync(x => (double?)x.WPM).ConfigureAwait(false) ?? 0.0
            };

            return averages;
        }

        // POST api/games/:id/stats
        [HttpPost("{id}/stats")]
        [Produces(MediaTypeNames.Application.Json)]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<object> PostGameStats(string id, GameStatsPostRequest body)
        {
            if (!ModelState.IsValid)
            {
                Response.StatusCode = 400;
                return null;
            }
            else
            {
                if (await _context.Games.FindAsync(id) == null)
                {
                    Response.StatusCode = 404;
                    return null;
                }

                await _context.AddAsync(new GameStatistic
                {
                    GameID = id,
                    Time = body.Time,
                    Accuracy = body.Accuracy,
                    KeyHits = body.KeyHits,
                    KeyMisses = body.KeyMisses,
                    WPM = body.WPM,
                    CreatedAt = DateTime.Now,
                });
                await _context.SaveChangesAsync()
                    .ConfigureAwait(false);

                Response.StatusCode = 201;
                return null;
            }
        }
    }
}
