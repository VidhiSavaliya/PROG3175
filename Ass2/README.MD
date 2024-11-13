
# Simple Web API with SQLite

## API Endpoints

- **POST /greet**
  - Request:
    ```json
    {
      "timeOfDay": "Morning",
      "language": "English",
      "tone": "Formal"
    }
    ```
  - Response:
    ```json
    {
      "greetingMessage": "Good Morning"
    }
    ```

- **GET /timesOfDay**
  - Response:
    ```json
    ["Morning", "Afternoon", "Evening"]
    ```

- **GET /languages**
  - Response:
    ```json
    ["English", "French", "Spanish"]
    ```

