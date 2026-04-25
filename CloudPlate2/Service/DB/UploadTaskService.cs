namespace CloudPlate2.Service.DB;

public class UploadTaskService(IFreeSql freeSql)
{
    public List<UploadTask> GetUploadTasks(string userAccount, RedisCache redis)
    {
        int taskCount = Convert.ToInt32(freeSql.Select<UploadTask>()
            .Where(e => e.UserAccount == userAccount
                        && e.Status == UploadStatus.Uploading)
            .Count());
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

    public async Task SaveTask(UploadTask task)
    {
      await freeSql.TransactionAsync( async worker =>
        {
            if (task.Id == 0)
            {
                long id = await worker.Orm.Insert(task).ExecuteIdentityAsync();
                task.Id = id;
            }
            else
               await worker.Orm.Update<UploadTask>()
                    .SetSource(task)
                    .IgnoreColumns(t=>t.Id)
                    .ExecuteAffrowsAsync();
        });
    }

    public Task UpdateProgress(long taskId, int current, int total)
    {
        return
            freeSql.TransactionAsync(async worker =>
            {
                await worker.Orm.Update<UploadTask>()
                    .Set(t => t.Current, current)
                    .SetIf(current == total,t => t.Status, UploadStatus.Finished)
                    .SetIf(current == total,t => t.FinishTime, DateTime.Now)
                    .Where(t => t.Id == taskId)
                    .ExecuteAffrowsAsync();
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