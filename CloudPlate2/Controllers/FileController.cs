using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudPlate2.Controllers;

[Route("Api/[controller]/[action]")]
public class FileController : ControllerBase
{
    private readonly FileService fileService;
    private readonly FileInfoService fileInfoService;
    private readonly UploadTaskService uploadTaskService;
    private readonly UserService userService;
    private readonly RedisCache redis;

    public FileController(FileService fileService, FileInfoService fileInfoService,
        UploadTaskService uploadTaskService,UserService userService,
        RedisCache redis)
    {
        this.fileService = fileService;
        this.fileInfoService = fileInfoService;
        this.uploadTaskService = uploadTaskService;
        this.userService = userService;
        this.redis = redis;
    }

    [Authorize]
    [HttpGet("{userId}/{pid}")]
    public async Task<ActionResult<Result<List<FileInfoEntity>>>> GetUserFiles([FromRoute] string userId,
        [FromRoute] int pid,
        [FromQuery]string? type,[FromQuery]string? search)
    {
        var data = await fileInfoService.GetUserFiles(userId,pid,type,search,redis);
        return Result.OK(data);
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult<Result<FileTaskVO>>> UploadFile([FromForm] IFormFile file,
        [FromForm]int current,[FromForm]int total,[FromForm]string? suffix,[FromForm]string userAccount,
        [FromForm]string? tempFileName,[FromForm]long? taskId,[FromForm]long pid,[FromForm]bool isFolder)
    {
        var res = await fileService.UploadFile(userAccount, current, total,
            taskId, pid, file, tempFileName, suffix, isFolder, fileInfoService, uploadTaskService, userService);
        return Result.OK(res);
    }

    [Authorize]
    [HttpPatch("{taskId}")]
    public ActionResult<Result> UpdateStatus([FromRoute] long taskId, [FromQuery] UploadStatus status)
    {
        int rows = uploadTaskService.UpdateStatus(taskId, status);
        if(rows > 0)
            return Result.OK("上传进度正常更新！");
        return Result.Fail("上传进度更新失败，出现问题！");
    }
}