using System;
using System.Threading.Tasks;
using VGamepadWeb.Core; // Import the Core library

namespace ConsoleTester
{
    class Program
    {
        // Main was changed to async Task to support await
        static async Task Main(string[] args)
        {
            Console.WriteLine("Preparing the server...");

            // Create an instance of the server runner class
            ServerRunner server = new ServerRunner();

            try
            {
                // Start the server on port 5000 (or any port you choose)
                await server.StartServerAsync(5000);

                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("Server started successfully!");
                Console.ResetColor();
                Console.WriteLine("The server is now accepting connections from phones on the same Wi-Fi network.");
                Console.WriteLine("Press Enter at any time to stop the server and close the program...");

                // The program will pause here and wait for Enter to be pressed while the server runs in the background
                Console.ReadLine();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"An error occurred while starting the server: {ex.Message}");
                Console.ResetColor();
                Console.ReadLine();
            }
            finally
            {
                // Stop the server and clean up resources upon exit
                Console.WriteLine("Stopping the server...");
                await server.StopServerAsync();
                Console.WriteLine("Closed.");
            }
        }
    }
}