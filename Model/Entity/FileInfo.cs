namespace Model.Entity;

public class FileInfo
{
    public long Id { get; set; }
    public string UserId { get; set; }
    public long Pid { get; set; }
    public string FileName { get; set; }
    public long FileSize { get; set; }
    public DateTime CreateTime { get; set; }
    public string FileCover {get; set; }
    public bool IsFolder {get; set; }
    public bool DeleteFlag {get; set; }
    public DateTime RecycleTime {get; set; }
    public DateTime RecoverTime {get; set; }
    public int Type { get; set; }
    public DateTime UpdateTime { get; set; }
}