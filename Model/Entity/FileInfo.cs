using FreeSql.DataAnnotations;
using Model.Entity.Enum;

namespace Model.Entity;

public class FileInfo
{
    [Column(IsIdentity = true, IsPrimary = true)]
    public long Id { get; set; }
    public string UserId { get; set; }
    public long Pid { get; set; }
    //public long RootId { get; set; }
    public string Name { get; set; }
    public long Size { get; set; }
    public DateTime UploadTime { get; set; }
    public string Cover {get; set;}
    [Column(DbType = "tinyint(1)")]
    public bool DeleteFlag {get; set; }
    public DateTime? RecycleTime {get; set; }
    public DateTime? RecoverTime {get; set; }
    public int? Type { get; set; }
    public string StoragePath {get; set;}
    public string IdentificationName {get; set;}
}