namespace CloudPlate2.ExceptionHandler;


public class NoEffectSQLException : Exception
{
    public NoEffectSQLException(string? message = "SQL execution has no effect!") : base(message)
    {
    }
}