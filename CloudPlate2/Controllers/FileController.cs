using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudPlate2.Controllers;

[Route("Api/[controller]/[action]")]
public class FileController : ControllerBase
{
    private readonly FileService fileService;
    private readonly FileInfoService fileInfoService;
    private readonly RedisCache redis;

    public FileController(FileService fileService, FileInfoService fileInfoService,RedisCache redis)
    {
        this.fileService = fileService;
        this.fileInfoService = fileInfoService;
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
}