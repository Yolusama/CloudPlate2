namespace CloudPlate2.Aspect;

[AttributeUsage(AttributeTargets.Method)]
public class ClearRedisCacheAttribute : Attribute
{
    
    public string[] Keys { get; }
    public ClearRedisCacheAttribute(string[] keys)
    {
        Keys = keys;
    }
}