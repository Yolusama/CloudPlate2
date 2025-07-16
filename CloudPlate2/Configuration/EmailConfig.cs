namespace CloudPlate2.Configuration;

public class EmailConfig
{
    public string Host { get; set; }
    public string AuthorizationCode { get; set; }
    public string SmtpServer { get; set; }
    public int SmtpPort { get; set; }
}