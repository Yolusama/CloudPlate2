using CloudPlate2.ExceptionHandler;

namespace CloudPlate2.Expansion;

public static class AppExpansions
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

    public static async Task TransactionAsync(this IFreeSql freeSql, Func<IRepositoryUnitOfWork,Task> action)
    {
        using var worker = freeSql.CreateUnitOfWork();
        try
        {
           await action.Invoke(worker);
           worker.Commit();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            worker.Rollback();
            throw;
        }
    }

    public static void CodeFirst(this WebApplicationBuilder builder)
    {
        #region NotUsed

         /* string connectionString = builder.Configuration.GetValue<string>("MySql:Connection");
    IFreeSql fsql = new FreeSqlBuilder()
        .UseConnectionString(DataType.MySql,connectionString)
        .UseAdoConnectionPool(true)
        .UseMonitorCommand(cmd => Console.WriteLine($"FreeSql执行sql语句：{cmd.CommandText}"))
        .UseAutoSyncStructure(true) //自动同步实体结构到数据库，只有CRUD时才会生成表
        .Build();
    fsql.CodeFirst.IsAutoSyncStructure = true;
    fsql.CodeFirst.ConfigEntity<Model.Entity.FileInfo>(builder =>
    {
        builder.Name(nameof(Model.Entity.FileInfo));
        builder.Property(f=>f.Id).DbType("bigint").IsPrimary(true).IsIdentity(true);
        builder.Property(f=>f.Pid).DbType("bigint").IsNullable(false);
        builder.Property(f => f.DeleteFlag).DbType("tinyint(1)").IsNullable(false)
            .InsertValueSql("0");
        builder.Property(f => f.UserId).DbType("varchar(16)").IsNullable(false);
        builder.Index("Index_UserId","UserId");
        builder.Index("Index_Pid","Pid");
        builder.Index("Index_DeleteFlag","DeleteFlag");
        builder.Property(f=>f.UploadTime).DbType("datetime").IsNullable(false)
            .InsertValueSql($"\'{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}\'");
        builder.Property(f => f.Cover).DbType("varchar(50)")
            .IsNullable(false);
        builder.Property(f => f.Name).DbType("varchar(50)").IsNullable(false);
        builder.Property(f=>f.Size).DbType("bigint").IsNullable(false);
        builder.Property(f => f.RecycleTime).DbType("datetime");
        builder.Property(f => f.RecoverTime).DbType("datetime");
        builder.Property(f => f.Type).MapType(typeof(int)).IsNullable(false).
            DbType("tinyint(1)");
        builder.Property(f=>f.UpdateTime).DbType("datetime");
    });

    fsql.CodeFirst.ConfigEntity<UploadTask>(builder =>
    {
          builder.Name(nameof(UploadTask));
          builder.Property(t=>t.Id).DbType("bigint").IsPrimary(true).IsIdentity(true);
          builder.Property(t=>t.UserAccount).DbType("varchar(16)").IsNullable(false);
          builder.Index("Index_UserAccount","UserAccount");
          builder.Property(t=>t.CreateTime).DbType("datetime")
              .InsertValueSql($"\'{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}\'");
          builder.Property(t => t.FileType).MapType(typeof(int)).IsNullable(false).
              DbType("tinyint(1)");
          builder.Property(t=>t.Current).DbType("bigint").IsNullable(false);
          builder.Property(t=>t.Total).DbType("bigint").IsNullable(false);
          builder.Property(t=>t.TempFileName).DbType("varchar(125)").IsNullable(false);
          builder.Property(t => t.Status).DbType("tinyint(1)");
          builder.Index("Index_Status","Status");
          builder.Property(t => t.FinishTime).DbType("datetime");
    });
    //FreeSqlExpansion.FreeSql = fsql;
    return fsql;*/

        #endregion
    }

    public static void AddRedis(this IServiceCollection services)
    {
        try
        {
            // 方法1：使用 Singleton + 立即执行
            var config = services.BuildServiceProvider().GetRequiredService<IConfiguration>();
    
            // 立即创建连接
            var connection = ConnectionMultiplexer.Connect(config["Redis:Connection"]);
            var database = connection.GetDatabase(config.GetValue<int>("Redis:Database"));
    
            // 注册已创建的实例
            services.AddSingleton<IConnectionMultiplexer>(connection);
            services.AddSingleton(database);
            services.AddScoped<RedisCache>();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}
