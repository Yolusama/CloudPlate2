namespace Functional;

public class KLoggerInstance
{
    public static IKLogger Instance { get; private set; } = null;

    public static void Assign(string? folderPath)
    {
        if (Instance == null)
        {
            Instance = new KLogger(folderPath);
        }
    }
}