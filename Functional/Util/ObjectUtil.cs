using System.Reflection;

namespace Functional.Util;

public static class ObjectUtil
{
    /// <summary>
    /// 复制对象所有属性
    /// </summary>
    /// <param name="source"></param>
    /// <param name="target"></param>
    public static void CopyProperties(this object target, object source)
    {
        Type targetType = target.GetType();
        Type sourceType = source.GetType();
        PropertyInfo[] sourceProperties = sourceType.GetProperties(BindingFlags.Public | BindingFlags.Instance);
        PropertyInfo[] targetProperties = targetType.GetProperties(BindingFlags.Public | BindingFlags.Instance);

        foreach (var property in sourceProperties)
        {
            if (targetType == sourceType)
                property.SetValue(target, property.GetValue(source));
            else
            {
                PropertyInfo? targetProperty = targetProperties.FirstOrDefault(p => p.Name == property.Name);
                if (targetProperty == null) continue;
                targetProperty.SetValue(target, property.GetValue(source));
            }
        }
    }

    /// <summary>
    /// 复制字段
    /// </summary>
    /// <param name="source"></param>
    /// <param name="target"></param>
    public static void CopyFields(this object target, object source)
    {
        Type targetType = target.GetType();
        Type sourceType = source.GetType();
        FieldInfo[] sourceFields = sourceType.GetFields(BindingFlags.Public 
                                                        | BindingFlags.Instance | BindingFlags.NonPublic);
        FieldInfo[] targetFields = targetType.GetFields(BindingFlags.Public 
                                                        | BindingFlags.Instance | BindingFlags.NonPublic);

        foreach (var field in sourceFields)
        {
            if(targetType == sourceType)
                field.SetValue(target, field.GetValue(source));
            else
            {
               FieldInfo? targetField = targetFields.FirstOrDefault(f => f.Name == field.Name);
               if(targetField == null) continue;
               targetField.SetValue(target, field.GetValue(source));
            }
        }
    }
}
