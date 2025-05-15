using Microsoft.EntityFrameworkCore;
using System;
using TermProject.Api.Data;
using TermProject.Api.Models;
using TermProject.Api.Services.Interfaces;

namespace TermProject.Api.Services
{
    public class NoteLikeService : INoteLikeService
    {
        private readonly NotelandDbContext _context;

        public NoteLikeService(NotelandDbContext context)
        {
            _context = context;
        }

        public async Task<bool> LikeNoteAsync(int noteId, int userId)
        {

            var alreadyLiked = await _context.NoteLikes
                .AnyAsync(l => l.NoteID == noteId && l.UserID == userId);

            if (alreadyLiked)
                return false;

            var like = new NoteLikes
            {
                NoteID = noteId,
                UserID = userId,
                LikedAt = DateTime.UtcNow
            };

            _context.NoteLikes.Add(like);


            var note = await _context.Notes.FindAsync(noteId);
            if (note != null)
            {
                note.LikeCount += 1;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnlikeNoteAsync(int noteId, int userId)
        {
            var like = await _context.NoteLikes
                .FirstOrDefaultAsync(l => l.NoteID == noteId && l.UserID == userId);

            if (like == null)
                return false;

            _context.NoteLikes.Remove(like);


            var note = await _context.Notes.FindAsync(noteId);
            if (note != null && note.LikeCount > 0)
            {
                note.LikeCount -= 1;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetLikeCountAsync(int noteId)
        {
            var note = await _context.Notes.FindAsync(noteId);
            return note?.LikeCount ?? 0;
        }


        public async Task<bool> HasUserLikedAsync(int noteId, int userId)
        {
            return await _context.NoteLikes
                .AnyAsync(l => l.NoteID == noteId && l.UserID == userId);
        }
    }

}
