global using FileInfoEntity = Model.Entity.FileInfo;
namespace CloudPlate2.Service.DB;

public class FileInfoService
{
    private readonly IFreeSql freeSql;

    public FileInfoService(IFreeSql freeSql)
    {
        this.freeSql = freeSql;
    }

    public async Task<List<FileInfoEntity>> GetUserFiles(string userId,string? type,string? search,RedisCache redis)
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

        int _type = string.IsNullOrEmpty(type) ? -1 : int.Parse(type);
        var data =await freeSql.Select<FileInfoEntity>()
            .Where(f => (f.UserId == userId && f.DeleteFlag)
                        &&(_type<0?true:f.Type==_type)&&(string.IsNullOrEmpty(search) || 
                                                         f.FileName.Contains(search)))
            .ToListAsync();
        if(type == null)
           redis.Set(key,data,Constants.GetUserFiles);
        return data;
    }
}