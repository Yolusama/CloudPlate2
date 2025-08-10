using CloudPlate2.Aspect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudPlate2.Controllers;

[Route("Api/[controller]/[action]")]
[Authorize]
public class UploadTaskController : ControllerBase
{
    private readonly UploadTaskService uploadTaskService;
    private readonly FileService fileService;
    private readonly RedisCache redis;

    public UploadTaskController(UploadTaskService uploadTaskService,FileService fileService, RedisCache redis)
    {
        this.uploadTaskService = uploadTaskService;
        this.fileService = fileService;
        this.redis = redis;
    }

    [HttpGet("{userAccount}")]
    public ActionResult<Result<List<UploadTask>>> GetUploadTasks([FromRoute] string userAccount)
    {
        var res = uploadTaskService.GetUploadTasks(userAccount,redis);
        if (res == null)
            return Result.Fail("上传任务数已超过最大上传任务数！").Generics<List<UploadTask>>();
        return Result.OK(res);
    }
    
    [HttpPatch("{taskId}")]
    [ClearRedisCache([CachingKeys.GetUploadTasks])]
    public ActionResult<Result> UpdateStatus([FromRoute] long taskId, [FromQuery] UploadStatus status)
    {
        int rows = uploadTaskService.UpdateStatus(taskId,status,fileService);
        if(rows > 0)
            return Result.OK("上传进度正常更新！");
        return Result.Fail("上传进度更新失败，出现问题！");
    }

    [HttpDelete("{taskId}")]
    [ClearRedisCache([CachingKeys.GetUploadTasks])]
    public ActionResult<Result> RemoveTask([FromRoute] long taskId)
    {
        int rows = uploadTaskService.RemoveTask(taskId);
        if (rows == 0)
            return Result.Fail("移除上传任务失败！");
        return Result.OK("移除上传任务成功！");
    }
    
    [HttpPost("{userAccount}/{taskId}")]
    [ClearRedisCache([CachingKeys.GetUploadTasks])]
    public ActionResult<Result> ReloadTask([FromRoute] string userAccount,[FromRoute] long taskId,
        [FromForm] string tempFileName)
    {
        fileService.RemoveTempFile(userAccount, tempFileName);
        int rows = uploadTaskService.ReloadTask(taskId,userAccount);
        if(rows == 0)
            return Result.Fail("重新下载任务创建失败！");
        return Result.OK("开始重新下载...");
    }
    
}