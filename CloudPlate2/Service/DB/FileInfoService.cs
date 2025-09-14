global using FileInfoEntity = Model.Entity.FileInfo;
namespace CloudPlate2.Service.DB;

public class FileInfoService
{
    private readonly IFreeSql freeSql;

    public FileInfoService(IFreeSql freeSql)
    {
        this.freeSql = freeSql;
    }

    public async Task<List<FileInfoEntity>> GetUserFiles(string userId,int pid,string? type,string? search,RedisCache redis)
    {
        string key = $"{userId}_{CachingKeys.GetUserFiles}";
        if (type == null)
        {
            if (redis.KeyExists(key))
            {
                var cachedData = await redis.GetAsync<List<FileInfoEntity>>(key);
                return cachedData;
            }
        }

        FileType _type;
        var data =await freeSql.Select<FileInfoEntity>()
            .Where(f => (f.UserId == userId && f.DeleteFlag)
                        &&(!FileType.TryParse(type, out _type)||f.Type==_type)&&(string.IsNullOrEmpty(search) || 
                                                         f.Name.Contains(search))&& f.Pid == pid)
            .ToListAsync();
        if(type == null)
           redis.Set(key,data,Constants.GetUserFilesExpire);
        return data;
    }

    public Task InsertUserFile(FileInfoEntity entity)
    {
        return  Task.Run(()=>freeSql.Transaction(()=>freeSql.Insert(entity).Execute()));
    }
}