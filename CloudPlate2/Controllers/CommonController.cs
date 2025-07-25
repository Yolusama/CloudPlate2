﻿using Microsoft.AspNetCore.Mvc;


namespace CloudPlate2.Controllers;

[Route("Api/[controller]/[action]")]
public class CommonController : ControllerBase
{
    private readonly RedisCache redis;
    private readonly EmailService emailService;

    public CommonController(RedisCache redis,EmailService emailService)
    {
        this.redis = redis;
        this.emailService = emailService;
    }
    
    [HttpGet]
    public ActionResult<Result> Heartbeat()
    {
        return Ok(Result.OK("心跳请求..."));
    }
    
    [HttpGet("{count}")]
    public ActionResult<Result> GetCheckCode([FromRoute] int count, [FromQuery] string email)
    {
        string? res = GetCheckCode(count, email, redis);
        if (res == null)
            return Result.Fail("1分中内不能连续获取验证码！");
        if (res == string.Empty)
            return Result.Fail("验证码已过期！");
        emailService.Send(email,"验证码",$@"<html><body>
           <h3>这是本次登录/注册/验证行为的验证码{res},请在五分钟内使用！</h3> </body></html>");
        return Result.OK("验证码生成成功！");
    }

    [HttpGet]
    public async Task<ActionResult<Result<string>>> GetRandomStr()
    {
        int count = RandomGenerator.R.Next(6, 21);
        string res = await Task.Run(()=>RandomGenerator.GenerateByTable(count));
        return Result.OK<string>(res);
    }
    
    private string GetCheckCode(int count, string email, RedisCache redis)
    {
        string checkCode = RandomGenerator.GenerateNumberStr(count);
        string key = $"{email}_{Constants.CheckCodeKey}_{count}";
        string intervalKey = $"{email}_CheckCodeInterval";
        TimeSpan expire = redis.GetExpire(intervalKey);
        if (expire == TimeSpan.Zero) return string.Empty;
        if (expire == Constants.GetCheckCodeInterval) return null;
        redis.Set(key,checkCode,Constants.CheckCodeExpire);
        redis.Set(intervalKey,true,Constants.GetCheckCodeInterval);
        return checkCode;
    }
}