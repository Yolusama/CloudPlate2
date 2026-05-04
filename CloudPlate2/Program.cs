global using System;
global using Model;
global using Model.Entity;
global using Model.Common;
global using Model.Entity.VO;
global using Model.Entity.Enum;
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
global using CloudPlate2.Expansion;
using CloudPlate2.ExceptionHandler;
using CloudPlate2.Filter;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using FileInfo = Model.Entity.FileInfo;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IExceptionHandler,GlobalExceptionHandler>();
builder.Services.AddCors(opt =>
{
    opt.AddDefaultPolicy(policy => policy.
        AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
builder.Services.AddRedis();
builder.Services.AddSingleton<IFreeSql>(_ =>
{
    var connectionString = builder.Configuration.GetValue<string>("MySql:Connection");
    var fsql = new FreeSqlBuilder()
        .UseConnectionString(DataType.MySql,connectionString)
        .UseAdoConnectionPool(true)
        .UseMonitorCommand(cmd => Console.WriteLine($"FreeSql执行sql语句：{cmd.CommandText}"))
        .UseAutoSyncStructure(false) //自动同步实体结构到数据库，只有CRUD时才会生成表
        .Build();
    //FreeSqlExpansion.FreeSql = fsql;
    return fsql;
});

builder.Services.AddAuthentication(options=>
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
builder.Services.AddSingleton<FileService>(_ => new FileService(builder.Configuration["Resource:FileRootPath"]));
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<UploadTaskService>();
builder.Services.AddScoped<FileInfoService>();
//builder.Services.AddScoped<ClearRedisCacheFilter>();
builder.Services.AddScoped<IKLogger, KLogger>(_=>new KLogger(builder.Configuration["Logging:FilePath"]));
var app = builder.Build();

// Configure the HTTP request pipeline.
/*if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}*/

//app.UseRouting();
app.UseCors();

//app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.UseStaticFiles(new StaticFileOptions
{
    RequestPath = builder.Configuration["Resource:Image:Pattern"],
    FileProvider = new PhysicalFileProvider(builder.Configuration["Resource:Image:Path"])
});

app.MapControllers();

app.Run();