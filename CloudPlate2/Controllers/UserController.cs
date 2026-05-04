using Microsoft.AspNetCore.Mvc;

namespace CloudPlate2.Controllers;


[Route("Api/[controller]/[action]")]
public class UserController(RedisCache redis, UserService userService, JwtService jwtService)
    : ControllerBase
{
    [HttpPost]
    public ActionResult<Result<UserInfo>> Login([FromBody]UserLogin model)
    {
        var res = userService.Login(model.Identifier, model.Password,redis,jwtService,model.RememberPassword);
        if (res == null)
            return Result.Fail("不存在的用户！").Generics<UserInfo>();
        if (string.IsNullOrEmpty(res.Token))
            return Result.Fail("密码错误！").Generics<UserInfo>();
        return Ok(Result.OK(res));
    }

    [HttpPost]
    public ActionResult<Result<UserInfo>> CheckCodeLogin([FromBody] UserLogin model)
    {
        var res = userService.CheckCodeLogin(model.CheckCode, model.Identifier, redis, jwtService);
        if(res == null)
            return Result.Fail("验证码已过期！").Generics<UserInfo>();
        if(string.IsNullOrEmpty(res.Token))
            return Result.Fail("验证码错误").Generics<UserInfo>();
        return Ok(Result.OK(res));
    }

    [HttpPost]
    public ActionResult<Result<string>> Register([FromBody] UserRegister model)
    {
        var res = userService.Register(model.Nickname, model.Email,model.Password,model.CheckCode,redis);
        if (res == null)
            return Result.Fail("验证码错误或者已过期！").Generics<string>();
        if (res == string.Empty)
            return Result.Fail("注册失败！").Generics<string>();
        if(res == "邮箱已被注册！")
           return Result.Fail(res).Generics<string>();
        return Ok(Result.OK("注册成功！",res));
    }

    [HttpDelete("{userId}")]
    public ActionResult<Result> Logout([FromRoute] string userId)
    {
        if (userService.Logout(userId, redis))
            return new Result("退出登录成功！", true);
        return Result.Fail("退出登录操作出现异常！");
    }

    [HttpGet]
    public async Task<ActionResult<Result<UserFileSpaceVO>>> GetUserSpace([FromQuery]string account)
    {
        var sizeOpt =await userService.GetUserFileSpace(account);
        return Ok( Result.OK(sizeOpt));
    }
}