namespace CloudPlate2.Service.DB;

public class UploadTaskService
{
    private readonly IFreeSql freeSql;

    public UploadTaskService(IFreeSql freeSql)
    {
        this.freeSql = freeSql;
    }

    public List<UploadTask> GetUploadTasks(string userAccount, RedisCache redis)
    {
        int taskCount = freeSql.ExecuteScalar<int>(@"select count(1) from UploadTask where 
Account = @UserAccount and Status = @Status", 
            new { UserAccount = userAccount,Status = UploadStatus.Uploading });
        if (taskCount == Constants.MaxUploadTaskCount)
            return default;
        string key = $"{userAccount}_{CachingKeys.GetUploadTasks}";
        if (redis.KeyExists(key))
            return redis.Get<List<UploadTask>>(key);
        var res = freeSql.Select<UploadTask>()
            .Where(t=>t.UserAccount==userAccount)
            .ToList();
        redis.Set(key, res,Constants.GetUploadTasksExpire);
        return res;
    }

    public void SaveTask(UploadTask task)
    {
        freeSql.Transaction(() =>
        {
            if (task.Id == 0)
            {
                long id = freeSql.Insert(task).ExecuteIdentity();
                task.Id = id;
            }
            else
                freeSql.Update<UploadTask>()
                    .SetSource(task)
                    .IgnoreColumns(t=>t.Id)
                    .Execute();
        });
    }

    public Task UpdateProgress(long taskId, int current, int total)
    {
        return Task.Run(() =>
        {
            freeSql.Transaction(() =>
            {
                var update = freeSql.Update<UploadTask>()
                    .Set(t => t.Current, current);
                if(current == total)
                    update.Set(t=>t.Status,UploadStatus.Finished)
                        .Set(t => t.FinishTime,DateTime.Now);
                update.Where(t => t.Id == taskId)
                    .Execute();
            });
        });
    }

    public int UpdateStatus(long taskId, UploadStatus status,FileService fileService)
    {
        int rows = 0;
        UploadTask task = freeSql.Select<UploadTask>().Where(t => t.Id == taskId).First();
        freeSql.Transaction(() =>
        {
          task.Status = status;
          if(status == UploadStatus.Cancelled)
              fileService.RemoveTempFile(task.UserAccount, task.TempFileName);
          rows = freeSql.Update<UploadTask>().SetSource(task)
              .UpdateColumns(t => t.Status)
              .ExecuteAffrows();
        });
        return rows;
    }

    public int RemoveTask(long taskId)
    {
        int rows = 0;
        freeSql.Transaction(() =>
        {
           rows = freeSql.Delete<UploadTask>().Where(e => e.Id == taskId)
                .ExecuteAffrows();
        });
        return rows;
    }

    public int ReloadTask(long taskId,string userAccount)
    {
        int rows = 0;
        freeSql.Transaction(() =>
        {
            rows = freeSql.Update<UploadTask>()
                .Set(t => t.Status, UploadStatus.Uploading)
                .Set(t=>t.TempFileName,null)
                .Set(t=>t.Current,0)
                .Set(t => t.UserAccount,userAccount)
                .Set(t => t.CreateTime,DateTime.Now)
                .ExecuteAffrows();
        });
        return rows;
    }
    
}