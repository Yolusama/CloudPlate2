using System.IO.Pipelines;
using FileInfo = System.IO.FileInfo;

namespace CloudPlate2.Service;

public class FileService
{
    public string RootPath { get; init; }
    private readonly string tempFilePath = "/Temp";

    public FileService(string rootPath)
    {
        RootPath = rootPath;
    }

    public string GetUserRootPath(string userAccount)
    {
        return $"{RootPath}/{userAccount}";
    }

    public async Task<string> UploadFile(string userAccount,int current, int total,long? taskId,
        long? pid, IFormFile file,string? tempFileName,string? suffix,
        FileInfoService fileInfoService, UploadTaskService uploadTaskService)
    {
        if (current == 0)
        {
            string randomName = $"{RandomGenerator.RandomGUID}.{suffix}";
            using FileStream fs = new FileStream($"{tempFilePath}/{randomName}", FileMode.Create);
            await file.CopyToAsync(fs);
            UploadTask task = new UploadTask
            {
                Id = 0,
                CreateTime = DateTime.Now,
                Status = UploadStatus.Uploading,
                UserAccount = userAccount,
                Current = 0,
                Total = total,
                TempFileName = randomName
            };
            uploadTaskService.SaveTask(task);
            return randomName;
        }
        else
        {
            string fileName = $"{tempFilePath}/{tempFileName}";
            FileInfo fileInfo = new FileInfo(fileName);
            FileStream fs = fileInfo.Open(FileMode.Append, FileAccess.Write, FileShare.Write);
            await file.CopyToAsync(fs);
            await fs.DisposeAsync();
            if (current == total)
            {
                string userFilePath = $"{GetUserRootPath(userAccount)}/{fileName}";
                using FileStream stream = new FileStream(userFilePath,FileMode.OpenOrCreate,
                    FileAccess.Read, FileShare.Read);
                using Stream input = fileInfo.Open(FileMode.Open, FileAccess.Read, FileShare.Read);
                input.Seek(0, SeekOrigin.Begin);
                await input.CopyToAsync(stream);
                fileInfo.Delete();
                await fileInfoService.InsertUserFile(new FileInfoEntity
                {
                   Name = tempFileName,
                   UploadTime = DateTime.Now,
                   Pid = pid.Value,
                   Size = fileInfo.Length
                });
            }
            await uploadTaskService.UpdateProgress(taskId.Value, current, total);
            return fileName;
        }
    }
}