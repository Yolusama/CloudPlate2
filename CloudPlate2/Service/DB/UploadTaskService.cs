namespace CloudPlate2.Service.DB;

public class UploadTaskService
{
    private readonly IFreeSql freeSql;

    public UploadTaskService(IFreeSql freeSql)
    {
        this.freeSql = freeSql;
    }

    public void SaveTask(UploadTask task)
    {
        freeSql.Transaction(() =>
        {
            if (task.Id == 0)
                freeSql.Insert(task).Execute();
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
}