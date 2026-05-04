using Microsoft.AspNetCore.Mvc;

namespace CloudPlate2.Controllers;

[Route("api/[controller]/[action]")]
public class TestController : ControllerBase
{
    public ActionResult<Result<string>> Test()
    {
        return Ok(Result.OK("测试成功！"));
    }
}