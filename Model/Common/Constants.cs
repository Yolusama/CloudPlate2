using Model.Entity.Enum;

namespace Model.Common;

public static class Constants
{
    public static TimeSpan TokenExpire { get; } = TimeSpan.FromDays(7);
    public const string TokenKey = "token";
    public const string CheckCodeKey = "check_code";
    public static TimeSpan CheckCodeExpire { get; } = TimeSpan.FromMinutes(3);
    public static TimeSpan GetCheckCodeInterval { get; } = TimeSpan.FromMinutes(1);
    public static TimeSpan GetUserFilesExpire { get; } = TimeSpan.FromMinutes(5);
    public static TimeSpan GetFileTypesExpire { get; } = TimeSpan.FromMinutes(10);
    
    public const int KB = 1024;
    public const int MB = 1024 * KB;
    public const int GB = 1024 * MB;
    public const string DefaultAvatar = "default.png";
    public const int FileRootId = -1;

    public static string GetFileCover(FileType type)
    {
        switch (type)
        {
            case FileType.File: return "file.png";
            case FileType.Folder: return "folder.png";
            case FileType.Image: return "image.png";
            case FileType.Audio: return "audio.png";
            case FileType.Video: return "video.png";
            case FileType.Text: return "text.png";
            case FileType.Document: return "document.png";
            case FileType.Zip: return "zip.png";
        }
        return string.Empty;
    }

    public static string GetFileTypeName(FileType type)
    {
        switch (type)
        {
            case FileType.File: return "文件";
            case FileType.Text: return "文本";
            case FileType.Document: return "文档";
            case FileType.Image: return "图片";
            case FileType.Audio: return "音频";
            case FileType.Video: return "视频";
            case FileType.Folder: return "文件夹";
            case FileType.Zip: return "压缩文件";
        }
        return string.Empty;
    }
    
}