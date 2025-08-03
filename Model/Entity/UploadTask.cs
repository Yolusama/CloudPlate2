using Model.Entity.Enum;

namespace Model.Entity;

public class UploadTask
{
    public long Id { get; set; }
    public int Current { get; set; }
    public int Total { get; set; }
    public string TempFileName { get; set; }
    public DateTime? CreateTime { get; set; }
    public DateTime? FinishTime { get; set; }
    public UploadStatus Status { get; set; }
    public string UserAccount { get; set; }
}