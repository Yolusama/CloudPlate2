using System.Text.Json;

namespace CloudPlate2.Service;

public class RedisCache
{
   public IDatabase Database { get; }

   public RedisCache(IDatabase database)
   {
      Database = database;
   }

   public T? Get<T>(string key)
   {
      string json = Database.StringGet(key);
      if (string.IsNullOrEmpty(json)) return default;
      return JsonSerializer.Deserialize<T>(json);
   }

   public void Set(string key, object value,TimeSpan? expire = null)
   {
      string json = JsonSerializer.Serialize(value);
      Database.StringSet(key, json,expire);
   }

   public void SetIfNotExists(string key, object value, TimeSpan? expire = null)
   {
      if (KeyExists(key))return;
      Set(key, value, expire);
   }

   public bool KeyExists(string key)
   {
      return Database.KeyExists(key);
   }

   public bool Remove(string key)
   {
      return Database.KeyDelete(key);
   }
}