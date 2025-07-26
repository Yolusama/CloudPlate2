namespace CloudPlate2.Service;

public class FileService
{
    public string RootPath { get; init; }

    public FileService(string rootPath)
    {
        RootPath = rootPath;
    }

    public string GetUserRootPath(string userAccount)
    {
        return $"{RootPath}/{userAccount}";
    }
}