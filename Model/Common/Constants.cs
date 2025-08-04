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
    private static readonly string[] imageExtensions = ["png",
        "jpg", "jpeg", "gif", "bmp", "tiff", "tif", "tiff","ico","svg","webp"];

    private static readonly string[] documentExtensions = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv"];

    private static readonly string[] textExtensions =
    [
        "txt", "txtx", "log", "c", "cs", "cpp", "h", "java", "js",
        "ts", "jsx", "tsx", "py","html","xml","xaml","css","cshtml"
    ];

    private static readonly string[] audioExtensions = ["mp3", "ogg", "wav","acc","ape","m4r"];
    private static readonly string[] videoExtensions = ["mp4","m3u8","avi","m4s","mov","mkv","webm"];
    private static readonly string[] zipExtensions = ["zip","7z","gz","tar"];

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
   
    public static FileType GetFileType(string fileSuffix)
    {
        if(string.IsNullOrEmpty(fileSuffix))
            return FileType.File;
        if(imageExtensions.Contains(fileSuffix.ToLower()))
            return FileType.Image;
        if(documentExtensions.Contains(fileSuffix.ToLower()))
            return FileType.Document;
        if(textExtensions.Contains(fileSuffix.ToLower()))
            return FileType.Text;
        if(audioExtensions.Contains(fileSuffix.ToLower()))
            return FileType.Audio;
        if(videoExtensions.Contains(fileSuffix.ToLower()))
            return FileType.Video;
        if(zipExtensions.Contains(fileSuffix.ToLower()))
            return FileType.Zip;
        return FileType.File;
    }
    
}