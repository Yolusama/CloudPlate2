using System.Reflection;

namespace Functional.Util;

public static class ObjectUtil
{
    /// <summary>
    /// 复制对象所有属性
    /// </summary>
    /// <param name="source"></param>
    /// <param name="target"></param>
    public static void MapTo(this object target, object source)
    {
        var targetType = target.GetType();
        var sourceType = source.GetType();
        var sourceProperties = sourceType
            .GetProperties(BindingFlags.Public | BindingFlags.Instance);
        var targetProperties = targetType
            .GetProperties(BindingFlags.Public | BindingFlags.Instance);

        foreach (var property in sourceProperties)
        {
            if (targetType.IsAssignableFrom(sourceType))
                property.SetValue(target, property.GetValue(source));
            else
            {
                var targetProperty = 
                    targetProperties.FirstOrDefault(p => p.Name == property.Name
                    && p.PropertyType.IsAssignableTo(property.PropertyType));
                if (targetProperty == null) continue;
                targetProperty.SetValue(target, property.GetValue(source));
            }
        }
    }
    
    public static void MapTo<T1,T2>(this T1 target, T2 source)
    {
        var targetType = typeof(T1);
        var sourceType = typeof(T2);
        var sourceProperties = sourceType
            .GetProperties(BindingFlags.Public | BindingFlags.Instance);
        var targetProperties = targetType
            .GetProperties(BindingFlags.Public | BindingFlags.Instance);

        foreach (var property in sourceProperties)
        {
            if (targetType == sourceType)
                property.SetValue(target, property.GetValue(source));
            else
            {
                var targetProperty = 
                    targetProperties.FirstOrDefault(p => p.Name == property.Name
                                                         && p.PropertyType.IsAssignableTo(property.PropertyType));
                if (targetProperty == null) continue;
                targetProperty.SetValue(target, property.GetValue(source));
            }
        }
    }
}
