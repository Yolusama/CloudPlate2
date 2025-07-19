using Microsoft.AspNetCore.Mvc;

namespace CloudPlate2.Controllers;


[Route("Api/[controller]/[action]")]
public class UserController : ControllerBase
{
    private readonly RedisCache redis;
    private readonly UserService userService;
    private readonly JwtService jwtService;

    public UserController(RedisCache redis,UserService userService,JwtService jwtService)
    {
        this.redis = redis;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    [HttpPost]
    public ActionResult<Result<UserInfo>> Login([FromBody]UserLogin model)
    {
        var res = userService.Login(model.Identifier, model.Password,redis,jwtService,model.rememberPassword);
        if (res == null)
            return Result.Fail("不存在的用户！").Generics<UserInfo>();
        if (string.IsNullOrEmpty(res.Token))
            return Result.Fail("密码错误！").Generics<UserInfo>();
        return Ok(Result.OK(res));
    }
    
    
}