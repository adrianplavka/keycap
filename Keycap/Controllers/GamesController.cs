using System;
using System.Net.Mime;
using System.Threading.Tasks;
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
                .FromSqlRaw("SELECT * FROM \"Game\" ORDER BY random() LIMIT 1")
                .ToListAsync()
                .ConfigureAwait(false);

            if (games.Count == 0)
            {
                Response.StatusCode = 404;
                return null;
            }

            return new GameResponse
            {
                GameID = games[0].GameID,
                Title = games[0].Title,
                Label = games[0].Label,
                Text = games[0].Text,
                CreatedAt = games[0].CreatedAt
            };
        }

        // POST api/games
        [HttpPost]
        [Produces(MediaTypeNames.Application.Json)]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
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
    }
}
