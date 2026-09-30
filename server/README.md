# DEEN AI Backend

This small Node.js server keeps the OpenAI API key on the server instead of inside the Flutter app.

## Environment variables

- PORT: optional server port; defaults to 3000.
- OPENAI_API_KEY: server-side API key.
- OPENAI_MODEL: optional model name; defaults to gpt-5.6-luna.

Never commit the API key to GitHub.

## Endpoints

- GET /health
- POST /chat with JSON body: {"message":"your question"}

The Flutter app can call the deployed /chat URL using the DEEN_AI_ENDPOINT Dart define.
