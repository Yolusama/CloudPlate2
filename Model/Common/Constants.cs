using Model.Entity.Enum;

namespace Model.Common;

public static class Constants
{
    public static TimeSpan TokenExpire { get; } = TimeSpan.FromDays(7);
    public const string TokenKey = "token";
    public const string CheckCodeKey = "check_code";
    public static TimeSpan CheckCodeExpire { get; } = TimeSpan.FromMinutes(3);
    public static TimeSpan GetCheckCodeInterval { get; } = TimeSpan.FromMinutes(1);
    public static TimeSpan GetUserFiles { get; } = TimeSpan.FromMinutes(5);
    public const int KB = 1024;
    public const int MB = 1024 * KB;
    public const int GB = 1024 * MB;
    public const string DefaultAvatar = "default.png";

    public static string GetFileCover(FileType type)
    {
        switch (type)
        {
            case FileType.File: return "file.png";
            case FileType.Folder: return "folder.png";
            case FileType.Image: return "image.png";
            case FileType.Video: return "video.png";
            case FileType.Text: return "text.png";
            case FileType.Zip: return "zip.png";
        }
        return string.Empty;
    }
    
}