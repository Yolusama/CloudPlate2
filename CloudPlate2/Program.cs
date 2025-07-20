global using System;
global using Model;
global using Model.Entity;
global using Model.Common;
global using Model.Entity.VO;
global using Model.DTO;
global using StackExchange.Redis;
global using CloudPlate2.Service;
global using System.Text;
global using CloudPlate2.Configuration;
global using Functional;
global using Functional.Util;
global using CloudPlate2.Service;
global using CloudPlate2.Service.DB;
global using FreeSql;
global using FreeSql.MySql;
using CloudPlate2.ExceptionHandler;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddCors(opt =>
{
    opt.AddDefaultPolicy(policy => policy.
        AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
ConnectionMultiplexer connection = ConnectionMultiplexer
        .Connect(builder.Configuration["Redis:Connection"]);
builder.Services.AddScoped<IDatabase>(provider =>
{
    int database = builder.Configuration.GetValue<int>("Redis:Database");
    return connection.GetDatabase(database);
});
builder.Services.AddScoped<RedisCache>();
builder.Services.AddSingleton<IFreeSql>(provider=>
{
    string connectionString = builder.Configuration.GetValue<string>("MySql:Connection");
    IFreeSql fsql = new FreeSql.FreeSqlBuilder()
        .UseConnectionString(FreeSql.DataType.MySql,connectionString)
        .UseAdoConnectionPool(true)
        .UseMonitorCommand(cmd => Console.WriteLine($"Sql Sentence：{cmd.CommandText}"))
        .UseAutoSyncStructure(true) //自动同步实体结构到数据库，只有CRUD时才会生成表
        .Build();
    fsql.CodeFirst.IsAutoSyncStructure = true;
    fsql.CodeFirst.ConfigEntity<Model.Entity.FileInfo>(builder =>
    {
        builder.AsTable(nameof(Model.Entity.FileInfo));
        builder.Property(f=>f.Id).DbType("bigint").IsPrimary(true).IsIdentity(true);
        builder.Property(f=>f.Pid).DbType("bigint").IsNullable(false);
        builder.Property(f => f.DeleteFlag).DbType("tinyint(1)").IsNullable(false)
            .InsertValueSql("0");
        builder.Property(f => f.UserId).DbType("varchar(16)").IsNullable(false);
        builder.Index("Index_UserId","UserId");
        builder.Index("Index_Pid","Pid");
        builder.Index("Index_DeleteFlag","DeleteFlag");
        builder.Property(f=>f.CreateTime).DbType("datetime").IsNullable(false)
            .InsertValueSql(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
        builder.Property(f => f.FileCover).DbType("varchar(50)")
            .InsertValueSql("default-cover.png");
        builder.Property(f => f.FileName).DbType("varchar(50)").IsNullable(false);
        builder.Property(f=>f.FileSize).DbType("bigint").IsNullable(false);
        builder.Property(f=>f.IsFolder).DbType("tinyint(1)").IsNullable(false);
        builder.Property(f => f.RecycleTime).DbType("datetime");
        builder.Property(f => f.RecoverTime).DbType("datetime");
        builder.Property(f => f.UserId).DbType("varchar(16)");
        builder.Property(f => f.Type).DbType("tinyint(1)");
        builder.Property(f=>f.UpdateTime).DbType("datetime");
    });

    fsql.CodeFirst.ConfigEntity<UploadTask>(builder =>
    {
          builder.AsTable(nameof(UploadTask));
          builder.Property(t=>t.Id).DbType("bigint").IsPrimary(true).IsIdentity(true);
          builder.Property(t=>t.UserId).DbType("varchar(16)").IsNullable(false);
          builder.Index("Index_UserId","UserId");
          builder.Property(t=>t.CreateTime).DbType("datetime")
              .InsertValueSql(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
          builder.Property(t=>t.Current).DbType("bigint").IsNullable(false);
          builder.Property(t=>t.Total).DbType("bigint").IsNullable(false);
          builder.Property(t=>t.Md5).DbType("varchar(125)").IsNullable(false);
          builder.Property(t => t.Status).DbType("tinyint(1)");
          builder.Index("Index_Status","Status");
          builder.Property(t => t.FinishTime).DbType("datetime");
    });
    return fsql;
});

KLoggerInstance.Assign(builder.Configuration["Logging:FilePath"]);

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
builder.Services.AddSingleton<JwtConfig>(builder.Configuration.GetSection("Jwt").Get<JwtConfig>());
builder.Services.AddSingleton<EmailConfig>(builder.Configuration.GetSection("Email").Get<EmailConfig>());
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<UserService>();
var app = builder.Build();

// Configure the HTTP request pipeline.
/*if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}*/

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles(new StaticFileOptions()
{
     RequestPath = builder.Configuration["Resource:Image:Patten"],
     FileProvider = new PhysicalFileProvider(builder.Configuration["Resource:Image:Path"])
});

app.UseCors();

app.MapControllers();

app.Run();