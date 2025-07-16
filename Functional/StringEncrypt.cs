using System.Security.Cryptography;
using System.Text;

namespace Functional;

public static class StringEncrypt
{
    public static string Encrypt(string str)
    {
        using SHA256 sha256 = SHA256Managed.Create();
        byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(str));
        return Convert.ToBase64String(bytes);
    }

    public static bool Compare(string toCompare, string encrypted)
    {
        return string.Equals(encrypted, Encrypt(toCompare));
    }
}