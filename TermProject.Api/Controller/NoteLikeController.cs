
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteLikeController : ControllerBase
    {
        private readonly INoteLikeService _likeService;

        public NoteLikeController(INoteLikeService likeService)
        {
            _likeService = likeService;
        }

        [HttpPost("like/{noteId}")]
        public async Task<IActionResult> LikeNote(int noteId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var result = await _likeService.LikeNoteAsync(noteId, userId);
            if (!result)
                return BadRequest("User already liked this note.");
            return Ok("Note liked.");
        }

        [HttpPost("unlike/{noteId}")]
        public async Task<IActionResult> UnlikeNote(int noteId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var result = await _likeService.UnlikeNoteAsync(noteId, userId);
            if (!result)
                return NotFound("Like not found.");
            return Ok("Note unliked.");
        }

        [HttpGet("count/{noteId}")]
        public async Task<IActionResult> GetLikeCount(int noteId)
        {
            var count = await _likeService.GetLikeCountAsync(noteId);
            return Ok(count);
        }
        [HttpGet("hasLiked/{noteId}")]
        public async Task<IActionResult> HasUserLiked(int noteId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var hasLiked = await _likeService.HasUserLikedAsync(noteId, userId);
            return Ok(new { hasLiked });
        }
    }
}

