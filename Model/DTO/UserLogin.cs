namespace Model.DTO;

public record UserLogin(string Identifier, string Password, string CheckCode, string CheckCodeLength,
    bool RememberPassword);
