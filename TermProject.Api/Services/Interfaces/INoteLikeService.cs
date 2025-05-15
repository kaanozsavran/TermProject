namespace TermProject.Api.Services.Interfaces
{
    public interface INoteLikeService
    {
        Task<bool> LikeNoteAsync(int noteId, int userId);
        Task<bool> UnlikeNoteAsync(int noteId, int userId);
        Task<int> GetLikeCountAsync(int noteId);
        Task<bool> HasUserLikedAsync(int noteId, int userId);
    }
}

