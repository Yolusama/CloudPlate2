using Microsoft.AspNetCore.Mvc;


namespace CloudPlate2.Controllers;

[Route("Api/[controller]/[action]")]
public class CommonController : ControllerBase
{
    [HttpGet]
    public ActionResult<Result> Heartbeat()
    {
        return Ok(Result.OK("心跳请求..."));
    }
}