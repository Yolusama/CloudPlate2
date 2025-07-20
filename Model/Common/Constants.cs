namespace Model.Common;

public static class Constants
{
    public static TimeSpan TokenExpire { get; } = TimeSpan.FromDays(7);
    public const string TokenKey = "token";
    public const string CheckCodeKey = "check_code";
    public static TimeSpan CheckCodeExpire { get; } = TimeSpan.FromMinutes(3);
    public static TimeSpan GetCheckCodeInterval { get; } = TimeSpan.FromMinutes(1);
    public const int KB = 1024;
    public const int MB = 1024 * KB;
    public const int GB = 1024 * MB;
    public const string DefaultAvatar = "default.png";
    
}