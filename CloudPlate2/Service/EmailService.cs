using System.Net;
using System.Net.Mail;

namespace CloudPlate2.Service;

public class EmailService
{
    private readonly EmailConfig config;

    public EmailService(EmailConfig config)
    {
        this.config = config;
    }

    public void Send(string emailTo, string subject, string body)
    {
        string smtpServer = config.SmtpServer; // SMTP服务器地址
        int smtpPort = config.SmtpPort; // 通常587是TLS端口，465是SSL端口

        try
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress(config.Host),
                Subject = subject,
                Body = body,
                IsBodyHtml = true // 设置为false发送纯文本
            };

            mailMessage.To.Add(emailTo);
            
            using var smtpClient = new SmtpClient(smtpServer)
            {
                Port = smtpPort,
                Credentials = new NetworkCredential(config.Host,config.AuthorizationCode),
                EnableSsl = true, // 大多数现代SMTP服务器需要SSL
                DeliveryMethod = SmtpDeliveryMethod.Network
            };
            
            smtpClient.Send(mailMessage);

            Console.WriteLine("邮件发送成功！");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"邮件发送失败: {ex.Message}");
        }
    }
}