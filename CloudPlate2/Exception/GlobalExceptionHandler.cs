using Microsoft.AspNetCore.Diagnostics;
using Model;

namespace CloudPlate2.ExceptionHandler;

public class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception,
        CancellationToken cancellationToken)
    {
        httpContext.Response.StatusCode = 500;
        httpContext.Response.ContentType = "application/json";
        await httpContext.Response.WriteAsJsonAsync(Result.ServerError,cancellationToken);
        
       KLoggerInstance.Instance.Error($"出现异常: {exception}");

        return false;
    }
}