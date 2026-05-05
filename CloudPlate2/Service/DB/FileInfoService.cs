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
        FileType _type;
        var values = Enum.GetValues<FileType>().Select(x => (int)x);
        var data =await freeSql.Select<FileInfoEntity>()
            .WhereIf(Enum.TryParse(type, out _type) && _type!=FileType.File,f=>f.Type==(int)_type)
            .WhereIf(Enum.TryParse(type, out _type)&&_type == FileType.File,
                f=>values.Contains(f.Type.Value))
            .WhereIf(!string.IsNullOrEmpty(search),f=>f.Name.Contains(search))
            .WhereIf(pid > 0, f => f.Pid == pid)
            .Where(f => f.UserId == userId && !f.DeleteFlag)
            .ToListAsync();
        return data;
    }

    public Task InsertUserFile(FileInfoEntity entity)
    {
        return  freeSql.TransactionAsync(async worker =>
        {
            await worker.Orm.Insert(entity).ExecuteAffrowsAsync();
        });
    }
}