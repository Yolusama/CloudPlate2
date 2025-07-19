namespace Model.Entity.VO;

public record UserLogin(string Identifier, string Password, string CheckCode, string CheckCodeLength,
    bool rememberPassword);
