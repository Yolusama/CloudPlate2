using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudPlate2.Controllers;

[Route("Api/[controller]/[action]")]
[Authorize]
public class FileController(
    FileService fileService,
    FileInfoService fileInfoService,
    UploadTaskService uploadTaskService,
    UserService userService,
    RedisCache redis)
    : ControllerBase
{
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
        return Result.OK("文件上传完成！",res);
    }

    [HttpPost]
    public async Task<ActionResult<Result<FileTaskVO>>> UploadSmallFile([FromForm]string userAccount,[FromForm] long pid,
        [FromForm]IFormFile file,[FromForm]string suffix)
    {
       var res = await fileService.UploadFile(userAccount, pid, file, suffix, userService,fileInfoService);
       if(res == null)
           return Result.Fail("空间不足，无法上传").Generics<FileTaskVO>();
       return Result.OK("文件上传完成！",res);
    }

    [HttpPut("{pid}")]
    public async Task<ActionResult<Result>> CreateFolder([FromQuery] string account,
        [FromRoute] long? pid = -1)
    {
        if(string.IsNullOrEmpty(account))
            return Result.Fail("用户账号不能为空！");
        var res = await fileService.CreateNewFolder(account,pid, userService, fileInfoService);
        if(res)
            return Result.Fail("创建文件夹失败！");
        return Result.OK("文件夹创建成功！");
    }
}
   