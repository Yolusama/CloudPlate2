using FreeSql.DataAnnotations;

namespace Model.Entity;

using FreeSql;

[Table(Name = nameof(User))]
[Index("Index_Email", nameof(Email), IsUnique = true)]
public class User
{
    [Column(IsPrimary = true,DbType = "varchar(16)")]
    public string Id { get; set; }
    [Column(DbType = "varchar(25)",IsNullable = false)]
    public string Email { get; set; }
    [Column(DbType = "varchar(13)",IsNullable = false)]
    public string Account { get; set; }
    [Column(DbType = "varchar(125)",IsNullable = false)]
    public string Password { get; set; }
    [Column(DbType = "varchar(50)",IsNullable = false)]
    public string Nickname { get; set; }
    [Column(DbType = "varchar(100)",IsNullable = false)]
    public string UserAvatar { get; set; }
    [Column(IsNullable = true,DbType = "datetime")]
    public DateTime? LastLoginTime { get; set; }
    [Column(IsNullable = true,DbType = "datetime")]
    public DateTime RegisterTime { get; set; }
    [Column(DbType = "tinyint(1)",InsertValueSql = "1")]
    public bool Status { get; set; }
    [Column(DbType = "tinyint(1)",IsNullable = false)]
    public int Role { get; set; }
    public long CurrentSpace  { get; set; }
    public long TotalSpace { get; set; }
}