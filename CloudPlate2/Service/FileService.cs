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

    public async Task<FileTaskVO> UploadFile(string userAccount,int current, int total,long? taskId,
        long? pid, IFormFile file,string? tempFileName,string? suffix,bool isFolder,
        FileInfoService fileInfoService, UploadTaskService uploadTaskService,UserService userService)
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
            return new FileTaskVO{TaskId = task.Id,FileName = randomName};
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
                FileType fileType = isFolder? FileType.Folder : Constants.GetFileType(suffix);
                fileInfoService.InsertUserFile(new FileInfoEntity
                {
                   Name = tempFileName,
                   UserId = await userService.GetUserId(userAccount),
                   UploadTime = DateTime.Now,
                   Pid = pid.Value,
                   Size = fileInfo.Length,
                   Type = fileType,
                   Cover = Constants.GetFileCover(fileType)
                });
            }
            await uploadTaskService.UpdateProgress(taskId.Value, current, total);
            return new FileTaskVO{TaskId = taskId.Value,FileName = fileName};
        }
    }
}