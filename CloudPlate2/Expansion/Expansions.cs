using CloudPlate2.ExceptionHandler;

namespace CloudPlate2.Expansion;

public static class FreeSqlExpansion
{
    /*private static IFreeSql freeSql = null;

    public static IFreeSql FreeSql
    {
        get=>freeSql;
        set
        {
            if(freeSql != null)
                freeSql = value;
        }
    */
    public static void Execute<T>(this IUpdate<T> update)
    {
        if(update.ExecuteAffrows()<=0)
            throw new NoEffectSQLException();
    }

    public static void Execute<T>(this IInsert<T> insert) where T:class
    {
        int rows = insert.ExecuteAffrows();
        if (rows <= 0)
            throw new NoEffectSQLException();
    }

    public static void Delete<T>(this IDelete<T> delete) where T : class
    {
        if(delete.ExecuteAffrows()<=0) throw new NoEffectSQLException();
    }

    public static T? ExecuteScalar<T>(this IFreeSql freeSql,string sql,object? param = null)
    {
        object result = freeSql.Ado.ExecuteScalar(sql,param);
        if(result == null)
            return default;
        return (T)result;
    }

    public static async Task<T?> ExecuteScalarAsync<T>(this IFreeSql freeSql, string sql, object? param = null)
    {
        object result = await freeSql.Ado.ExecuteScalarAsync(sql,param);
        if(result == null)
            return default;
        return (T)result;
    }

    public static int ExecuteNonQuery(this IFreeSql freeSql, string sql, object? param = null)
    {
        return freeSql.Ado.ExecuteNonQuery(sql, param);
    }

    public static Task<int> ExecuteNonQueryAsync(this IFreeSql freeSql, string sql, object? param = null)
    {
        return freeSql.Ado.ExecuteNonQueryAsync(sql, param);
    }
}
