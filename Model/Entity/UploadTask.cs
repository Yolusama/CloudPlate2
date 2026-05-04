
using FreeSql.DataAnnotations;
using Model.Entity.Enum;

namespace Model.Entity;

public class UploadTask
{
    [Column(IsIdentity = true, IsPrimary = true)]
    public long Id { get; set; }
    public int Current { get; set; }
    public int Total { get; set; }
    [Column(DbType = "tinyint(1)")]
    public FileType FileType { get; set; }
    public string TempFileName { get; set; }
    public DateTime? CreateTime { get; set; }
    public DateTime? FinishTime { get; set; }
    [Column(DbType = "tinyint(1)")]
    public UploadStatus Status { get; set; }
    public string UserAccount { get; set; }
}