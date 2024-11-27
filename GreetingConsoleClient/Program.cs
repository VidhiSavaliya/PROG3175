using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace GreetingConsoleClient
{
    public class GreetingRequest
    {
        public string? TimeOfDay { get; set; }
        public string? Language { get; set; }
        public string Tone { get; set; } = "Formal"; // Default tone
    }

    public class GreetingResponse
    {
        public string? GreetingMessage { get; set; }
    }

    class Program
    {
        private static readonly HttpClient client = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(30)
        };

        static async Task Main(string[] args)
        {
            // Set the base address to the Node.js API
            client.BaseAddress = new Uri("https://assignment3-vidhis-projects-32d5e075.vercel.app/");

            Console.WriteLine("Fetching available times of day and languages...");

            // Fetch available times of day and languages
            var timesOfDay = await GetTimesOfDayAsync();
            var languages = await GetLanguagesAsync();

            if (timesOfDay == null || languages == null)
            {
                Console.WriteLine("Failed to retrieve times of day or languages.");
                return;
            }

            // Display available options
            Console.WriteLine("\nAvailable times of day:");
            foreach (var time in timesOfDay)
            {
                Console.WriteLine($"- {time}");
            }

            Console.WriteLine("\nAvailable languages:");
            foreach (var language in languages)
            {
                Console.WriteLine($"- {language}");
            }

            // Get user input
            Console.Write("\nEnter time of day (e.g., Morning, Afternoon, Evening): ");
            var selectedTime = Console.ReadLine()?.Trim();

            Console.Write("Enter language (e.g., English, French, Spanish): ");
            var selectedLanguage = Console.ReadLine()?.Trim();

            Console.Write("Enter tone (Formal or Casual): ");
            var selectedTone = Console.ReadLine()?.Trim();

            if (string.IsNullOrWhiteSpace(selectedTime) || string.IsNullOrWhiteSpace(selectedLanguage) || string.IsNullOrWhiteSpace(selectedTone))
            {
                Console.WriteLine("Invalid input. Please provide valid values for time of day, language, and tone.");
                return;
            }

            // Fetch the greeting message using GetAsync with query parameters
            var greetingResponse = await GetGreetingAsync(selectedTime, selectedLanguage, selectedTone);

            if (greetingResponse != null && !string.IsNullOrEmpty(greetingResponse.GreetingMessage))
            {
                Console.WriteLine($"\nGreeting Message: {greetingResponse.GreetingMessage}");
            }
            else
            {
                Console.WriteLine("Greeting not found. Please try different inputs.");
            }
        }

        private static async Task<List<string>?> GetTimesOfDayAsync()
        {
            try
            {
                var response = await client.GetAsync("/timesOfDay");

                if (response.StatusCode == System.Net.HttpStatusCode.GatewayTimeout)
                {
                       Console.WriteLine("Gateway Timeout. The server took too long to respond.");
                      return null;
                }
                response.EnsureSuccessStatusCode();

                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<string>>(jsonResponse);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching times of day: {ex.Message}");
                return null;
            }
        }

        private static async Task<List<string>?> GetLanguagesAsync()
        {
            try
            {
                var response = await client.GetAsync("/languages");
                
                if (response.StatusCode == System.Net.HttpStatusCode.GatewayTimeout)
                {
                       Console.WriteLine("Gateway Timeout. The server took too long to respond.");
                      return null;
                }

                response.EnsureSuccessStatusCode();

                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<string>>(jsonResponse);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching languages: {ex.Message}");
                return null;
            }
        }

        private static async Task<GreetingResponse?> GetGreetingAsync(string timeOfDay, string language, string tone)
        {
            try
            {
                // Construct the query string for GetAsync
                var query = $"/greet?timeOfDay={Uri.EscapeDataString(timeOfDay)}&language={Uri.EscapeDataString(language)}&tone={Uri.EscapeDataString(tone)}";
                var response = await client.GetAsync(query);

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<GreetingResponse>(jsonResponse);
                }
                else
                {
                    Console.WriteLine($"API Error: {response.StatusCode} - {response.ReasonPhrase}");
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching greeting: {ex.Message}");
                return null;
            }
        }
    }
}
