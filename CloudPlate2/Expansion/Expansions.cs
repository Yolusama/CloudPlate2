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
        update.ExecuteAffrows();
    }

    public static void Execute<T>(this IInsert<T> insert) where T:class
    {
        insert.ExecuteAffrows();
    }

    public static T? ExecuteScalar<T>(this IAdo ado,string sql,object? param = null) where T:class
    {
        object result = ado.ExecuteScalar(sql,param);
        if(result == null)
            return default;
        return (T)result;
    }
}
