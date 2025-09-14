
using Mysqlx.Expr;

namespace CloudPlate2.Service.DB;

public class UserService
{
    private readonly IFreeSql freeSql;

    public UserService(IFreeSql freeSql)
    {
        this.freeSql = freeSql;
    }

    public UserInfo Login(string identifier, string password, RedisCache redis, JwtService jwtService,
        bool rememberPassword = false)
    {
        User user = freeSql.Select<User>().Where(e => e.Account == identifier || e.Email == identifier)
            .First();
        if (user == null)
            return default;
        var res = new UserInfo();
        if (rememberPassword)
        {
            if (password == user.Password || StringEncrypt.Compare(password, user.Password))
            {
                res.CopyProperties(user);
                string token = jwtService.GenerateToken(user.Id, Constants.TokenExpire);
                redis.Set($"{user.Id}_{Constants.TokenKey}", token, Constants.TokenExpire);
                res.Token = token;
            }
            res.Pwd = user.Password;
        }
        else
        {
            if (StringEncrypt.Compare(password, user.Password))
            {
                res.CopyProperties(user);
                string token = jwtService.GenerateToken(user.Id, Constants.TokenExpire);
                redis.Set($"{user.Id}_{Constants.TokenKey}", token, Constants.TokenExpire);
                res.Token = token;
            }
        }

        freeSql.Transaction(() =>
        {
            freeSql.Update<User>().Set(u => u.LastLoginTime, DateTime.Now)
                .Where(u => u.Id == user.Id).ExecuteAffrows();
        });

        return res;
    }

    public UserInfo CheckCodeLogin(string checkCode, string email, RedisCache redis, JwtService jwtService)
    {
        string key = $"{email}_{Constants.CheckCodeKey}_4";
        if (!redis.KeyExists(key))
            return default;
        UserInfo res = new UserInfo();
        if (redis.Get<string>(key) == checkCode)
        {
            User user = freeSql.Select<User>().Where(e => e.Email == email).First();
            res.CopyProperties(user);
            string token = jwtService.GenerateToken(user.Id, Constants.TokenExpire);
            redis.Set($"{user.Id}_{Constants.TokenKey}", token, Constants.TokenExpire);
            res.Token = token;
        }

        freeSql.Transaction(() =>
        {
            freeSql.Update<User>().Set(u => u.LastLoginTime, DateTime.Now)
                .Where(u => u.Email == email).ExecuteAffrows();
        });
        redis.Remove(key);
        return res;
    }

    public string Register(string nickName, string email, string password, string checkCode, RedisCache redis)
    {
        User user = freeSql.Select<User>().Where(e => e.Email == email).First();
        if (user != null)
            return "邮箱已被注册！";
        user = new User();
        user.Id = RandomGenerator.GenerateUserId();
        user.Account = RandomGenerator.GenerateAccount();
        user.Email = email;
        user.Password = StringEncrypt.Encrypt(password);
        user.CurrentSpace = 0L;
        user.TotalSpace = 100L * Constants.GB;
        user.Avatar = Constants.DefaultAvatar;
        user.Nickname = nickName;
        user.RegisterTime = DateTime.Now;
        user.LastLoginTime = null;

        string key = $"{email}_{Constants.CheckCodeKey}_5";

        if (!redis.KeyExists(key) || redis.Get<string>(key) != checkCode)
            return null;

        int? rows = null;
        freeSql.Transaction(() => { rows = freeSql.Insert(user).ExecuteAffrows(); });
        redis.Remove(key);
        string intervalKey = $"{email}_CheckCodeInterval";
        if (redis.KeyExists(intervalKey))
            redis.Remove(intervalKey);

        if (rows != null && rows.Value > 0)
            return user.Account;
        return string.Empty;
    }

    public async Task<string> GetUserId(string? identifier)
    {
        //freesql参数化预编译查询，参数前缀使用?
        return await Task.Run(() =>
            freeSql.ExecuteScalar<string>("select Id from User where Account = ?Identifier or Email = ?Identifier", 
                new {Identifier  = identifier})
            );
    }

    public Task<int> UpdateSpace(long size, string account)
    {
       return freeSql.ExecuteNonQueryAsync(@"update User Set CurrentSpace = CurrentSpace + ?Size 
   where Account = ?Account", new { Size = size , Account = account });
    }

    public bool SizeFit(long size, string account)
    {
        var sizeOpt = freeSql.Select<User>()
            .Where(e => e.Account == account)
            .Take(1)
            .ToOne(u => new { u.CurrentSpace, u.TotalSpace });
        if(sizeOpt.CurrentSpace+size>sizeOpt.TotalSpace)
            return false;
        return true;
    }

    public bool Logout(string userId,RedisCache redis)
    {
        string key = $"{userId}_token";
        if(redis.KeyExists(key))
           return redis.Remove(key);
        return true;
    }
}