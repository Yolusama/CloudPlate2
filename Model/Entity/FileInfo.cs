using Model.Entity.Enum;

namespace Model.Entity;

public class FileInfo
{
    public long Id { get; set; }
    public string UserId { get; set; }
    public long Pid { get; set; }
    //public long RootId { get; set; }
    public string Name { get; set; }
    public long Size { get; set; }
    public DateTime UploadTime { get; set; }
    public string Cover {get; set;}
    public bool DeleteFlag {get; set; }
    public DateTime? RecycleTime {get; set; }
    public DateTime? RecoverTime {get; set; }
    public FileType Type { get; set; }
    public DateTime? UpdateTime { get; set; }
    
}