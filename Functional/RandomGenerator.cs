using System.Text;

namespace Functional;

public static class RandomGenerator
{
    public static Random R => Random.Shared;
    
    public static Guid RandomGUID => Guid.NewGuid();
    private const string table = "0123456789AaBbCcDdEeFfGgHhIiJjKkLlNnMmOoPpQqUuVvWwXxYyZz";

    public static String GenerateNumberStr(int count)
    {
        StringBuilder sb = new StringBuilder();
        sb.Append(R.Next(1, 10));
        for (int i = 1; i < count; i++) 
          sb.Append(R.Next(1, 10));
        return sb.ToString();
    }

    public static int[] GenerateNumbers(int count,int min = 0,int max = 10)
    {
        int[] numbers = new int[count];
        for (int i = 0; i < count; i++)
           numbers[i] = R.Next(min, max);
        return numbers;
    }

    public static string GenerateUserId()
    {
        StringBuilder sb = new StringBuilder();
        int num = R.Next(0, 2);
        if (num == 0)
            sb.Append('U');
        else
            sb.Append('u');
        int count = R.Next(9,15);
        for (int i = 0; i < count; i++)
           sb.Append(R.Next(0, 10));
        return sb.ToString();
    }

    public static string GenerateAccount()
    {
        StringBuilder sb = new StringBuilder();
        sb.Append(R.Next(1, 10));
        int count = R.Next(8, 12);
        for (int i = 0; i < count; i++)
            sb.Append(R.Next(0,10));
        return sb.ToString();
    }

    public static string GenerateByTable(int count)
    {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < count; i++)
        {
            int index = R.Next(0, table.Length);
            sb.Append(table[index]);
        }
        return sb.ToString();
    }

    public static string GenerateAlphaBet(int count,bool mixed = false, bool isLower=true)
    {
        StringBuilder sb = new StringBuilder();
        IEnumerable<char> template = table.Skip(10);
        if (!mixed)
        {
            if (isLower)
                template = table.Where(char.IsLower);
            else
                template = table.Where(char.IsUpper);
        }
        else
            template = table.Where(c=>!char.IsDigit(c));
        for (int i = 0; i < count; i++)
        {
            int index = R.Next(0,template.Count());
            sb.Append(template.ElementAt(index));
        }
        return sb.ToString();
    }
}