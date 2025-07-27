using System.Reflection;
using CloudPlate2.Aspect;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;

namespace CloudPlate2.Filter;

public class ClearRedisCacheFilter : IAsyncActionFilter
{
    private readonly RedisCache redis;

    public ClearRedisCacheFilter(RedisCache redis)
    {
        this.redis = redis;
    }
    
    public  async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var action = context.ActionDescriptor as ControllerActionDescriptor;
        var clearRedisCache = action.MethodInfo.GetCustomAttribute<ClearRedisCacheAttribute>();
        if (clearRedisCache != null)
        {
            var keys = clearRedisCache.Keys;
            foreach (var key in keys)
               if(redis.KeyExists(key))
                   redis.Remove(key);
        
            KLoggerInstance.Instance.Info($"执行{action.ActionName}后，清理缓存");
        }
        await next();
    }
}