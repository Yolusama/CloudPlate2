namespace Model.Entity.VO;

public class UserInfo
{
    public string Id { get; set; }
    public string Account { get; set; }
    public string Nickname { get; set; }
    public string Email { get; set; }
    public string Avatar { get; set; }
    public long CurrentSpace {get; set;}
    public long TotalSpace {get; set;}
    public string Token { get; set; }
    public string Pwd { get; set; }
}