namespace Model.Common;

public static class Constants
{
    public static TimeSpan TokenExpire { get; } = TimeSpan.FromDays(7);
    public const string TokenKey = "token";
}