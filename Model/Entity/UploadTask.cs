namespace Model.Entity;

public class UploadTask
{
    public long Id { get; set; }
    public int Current { get; set; }
    public int Total { get; set; }
    public string Md5 { get; set; }
    public string CreateTime { get; set; }
    public DateTime? FinishTime { get; set; }
    public bool Status { get; set; }
    public string UserId { get; set; }
}