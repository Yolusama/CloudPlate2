namespace Model;

public class Result
{
    public string Message { get; set; }
    public bool ok {get; set;}
    public Result(string message, bool ok)
    {
        Message = message;
        this.ok = ok;
    }

    public static Result OK(String message)
    {
        return new Result(message, true);
    }

    public static Result OK()
    {
        return new Result("200 OK", true);
    }
    
    public static Result Fail()
    {
        return new Result("201 Fail", false);
    }

    public static Result Fail(string message)
    {
        return new Result(message, false);
    }

    public static Result ServerError => Fail("ServerError");
    
    public Result<T> Generics<T>()
    {
        return new Result<T>(Message, ok,default);
    }
    
    public static Result<T> OK<T>(T data)
    {
        Result<T> res = OK().Generics<T>();
        res.Data = data;
        return res;
    }

    public static Result<T> OK<T>(string message, T data)
    {
        return new Result<T>(message, true, data);
    }
}

public class Result<T> : Result
{
    public T Data { get; set; }
    public Result(string message, bool ok, T data):base(message, ok)
    {
        Data = data;
    }
}