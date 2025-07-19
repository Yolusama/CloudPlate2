namespace CloudPlate2.Service.DB;

public class UserService
{
    private readonly IFreeSql freeSql;

    public UserService(IFreeSql freeSql)
    {
        this.freeSql = freeSql;
    }

    public UserInfo Login(string identifier, string password,RedisCache redis,JwtService jwtService,
        bool rememberPassword = false)
    {
        User user = freeSql.Select<User>().Where(e => e.Account == identifier || e.Email == identifier)
            .First();
        if (user == null)
            return default;
        var res = new UserInfo();
        if (rememberPassword)
        {
            if(password == user.Password)
            { 
                res.CopyProperties(user);
                string token = jwtService.GenerateToken(user.Id,Constants.TokenExpire);
                redis.Set($"{user.Id}_{Constants.TokenKey}",token,Constants.TokenExpire);
                res.Token = token;
            }
        }
        else
        {
            if(StringEncrypt.Compare(password, user.Password))
            { 
                res.CopyProperties(user);
                string token = jwtService.GenerateToken(user.Id,Constants.TokenExpire);
                redis.Set($"{user.Id}_{Constants.TokenKey}",token,Constants.TokenExpire);
                res.Token = token;
            }
        }
        return res;
    }
}