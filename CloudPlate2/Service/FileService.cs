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
        DirectoryInfo directory= new DirectoryInfo($"{RootPath}/{userAccount}");
        if(!directory.Exists)
            directory.Create();
        return directory.FullName;
    }

    public void RemoveTempFile(string userAccount,string tempFileName)
    {
        var fileInfo = new FileInfo($"{tempFilePath}/{tempFileName}");
        fileInfo.Delete();
    }

    public async Task<FileTaskVO> UploadFile(string userAccount,long pid, IFormFile file,string suffix,UserService userService,FileInfoService fileInfoService)
    {
        if(!await userService.SizeFit(file.Length, userAccount))
            return null;
        string newFileName = $"{RandomGenerator.RandomGUID}.{suffix}";
        var stream = new FileStream($"{GetUserRootPath(userAccount)}/{newFileName}", FileMode.Create,FileAccess.Write
            ,FileShare.Write);
        await file.CopyToAsync(stream);
        await stream.DisposeAsync();
        var fileType = Constants.GetFileType(suffix);
        var fileInfo = new FileInfoEntity
        {
           Name = file.FileName,
           Size = file.Length,
           Type = (int)fileType,
           UploadTime = DateTime.Now,
           Pid = pid,
           Cover = Constants.GetFileCover(fileType),
           UserId = await userService.GetUserId(userAccount),
           IdentificationName = newFileName,
           StoragePath = stream.Name
        };
        await fileInfoService.InsertUserFile(fileInfo);
        await userService.UpdateSpace(fileInfo.Size, userAccount);
        return new FileTaskVO
        {
           FileName = newFileName
        };
    }

    public async Task<FileTaskVO> UploadFile(string userAccount,int current, int total,long? taskId,
        long? pid, IFormFile file,string? tempFileName,string? suffix,bool isFolder,
        FileInfoService fileInfoService, UploadTaskService uploadTaskService,UserService userService)
    {
        if (!await userService.SizeFit(file.Length, userAccount))
            return null;
        if (current == 0)
        {
            string randomName = $"{userAccount}-{RandomGenerator.RandomGUID}.{suffix}";
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
                var userFilePath = $"{GetUserRootPath(userAccount)}/{tempFileName}";
                var stream = new FileStream(userFilePath,FileMode.OpenOrCreate,
                    FileAccess.Write, FileShare.Write);
                var input = fileInfo.Open(FileMode.Open, FileAccess.Read, FileShare.Read);
                input.Seek(0, SeekOrigin.Begin);
                await input.CopyToAsync(stream);
                await input.DisposeAsync();
                await stream.DisposeAsync();
                fileInfo.Delete();
                var fileType = isFolder? FileType.Folder : Constants.GetFileType(suffix);
                fileInfoService.InsertUserFile(new FileInfoEntity
                {
                   Name = file.FileName,
                   UserId = await userService.GetUserId(userAccount),
                   UploadTime = DateTime.Now,
                   Pid = pid.Value,
                   Size = fileInfo.Length,
                   Type = (int)fileType,
                   Cover = Constants.GetFileCover(fileType),
                   IdentificationName = tempFileName,
                   StoragePath = stream.Name
                });
                await userService.UpdateSpace(fileInfo.Length,userAccount);
            }
            await uploadTaskService.UpdateProgress(taskId.Value, current, total);
            return new FileTaskVO{TaskId = taskId.Value,FileName = fileName};
        }
    }

    public async Task<bool> CreateNewFolder(string userAccount,long? pid,UserService userService,
        FileInfoService fileInfoService)
    {
        var randomId = RandomGenerator.RandomGUID.ToString();
        var folderName =  $"新建文件夹-{randomId}";
        var dir = new DirectoryInfo($"{GetUserRootPath(userAccount)}/{randomId}");
        if(!dir.Exists)
            dir.Create();
        else 
           return false;
        var file = new FileInfoEntity
        {
            Name =folderName,
            UserId = await userService.GetUserId(userAccount),
            UploadTime = DateTime.Now,
            Pid = pid ?? -1,
            Size = 0,
            Type = (int)FileType.Folder,
            Cover = Constants.GetFileCover(FileType.Folder),
            IdentificationName = randomId,
            StoragePath = dir.FullName
        };
        await fileInfoService.InsertUserFile(file);
        return true;
    }
}