using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudPlate2.Controllers;

[Route("Api/[controller]/[action]")]
[Authorize]
public class FileController : ControllerBase
{
    private readonly FileService fileService;
    private readonly FileInfoService fileInfoService;
    private readonly UploadTaskService uploadTaskService;
    private readonly UserService userService;
    private readonly RedisCache redis;

    public FileController(FileService fileService, FileInfoService fileInfoService,
        UploadTaskService uploadTaskService, UserService userService,
        RedisCache redis)
    {
        this.fileService = fileService;
        this.fileInfoService = fileInfoService;
        this.uploadTaskService = uploadTaskService;
        this.userService = userService;
        this.redis = redis;
    }
    
    [HttpGet("{userId}/{pid}")]
    public async Task<ActionResult<Result<List<FileInfoEntity>>>> GetUserFiles([FromRoute] string userId,
        [FromRoute] int pid,
        [FromQuery] string? type, [FromQuery] string? search)
    {
        var data = await fileInfoService.GetUserFiles(userId, pid, type, search, redis);
        return Result.OK(data);
    }
    
    [HttpPut]
    public async Task<ActionResult<Result<FileTaskVO>>> UploadFile([FromForm] IFormFile file,
        [FromForm] int current, [FromForm] int total, [FromForm] string? suffix, [FromForm] string userAccount,
        [FromForm] string? tempFileName, [FromForm] long? taskId, [FromForm] long pid, [FromForm] bool isFolder)
    {
        var res = await fileService.UploadFile(userAccount, current, total,
            taskId, pid, file, tempFileName, suffix, isFolder, fileInfoService, uploadTaskService, userService);
        if(res == null)
            return Result.Fail("空间不足，无法上传！").Generics<FileTaskVO>();
        return Result.OK(res);
    }

    [HttpPost]
    public async Task<ActionResult<Result<FileTaskVO>>> UploadSmallFile([FromForm]string userAccount,
        [FromForm]IFormFile file,[FromForm]string suffix)
    {
       var res = await fileService.UploadFile(userAccount, file, suffix, userService);
       if(res == null)
           return Result.Fail("空间不足，无法上传").Generics<FileTaskVO>();
       return Result.OK(res);
    }
}
   