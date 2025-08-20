# Service Completion Time Prediction System

## System Architecture

```
┌─────────────────────┐                ┌─────────────────────┐
│    Next.js Frontend │                │   Flask API Backend │
│                     │                │                     │
│  ┌───────────────┐  │  HTTP/JSON     │  ┌───────────────┐  │
│  │     Pages     │◄─┼────────────────┼──┤    Flask      │  │
│  │   Components  │  │  REST API      │  │    Server     │  │
│  └───────┬───────┘  │                │  └───────┬───────┘  │
│          │          │                │          │          │
│  ┌───────▼───────┐  │                │  ┌───────▼───────┐  │
│  │  prediction-  │◄─┼────────────────┼──┤     app.py    │  │
│  │  service.ts   │  │  /predict      │  │               │  │
│  └───────────────┘  │  /health       │  └───────┬───────┘  │
│                     │                │          │          │
└─────────────────────┘                │  ┌───────▼───────┐  │
                                       │  │ model_predictor│  │
                                       │  │      .py      │  │
                                       │  └───────┬───────┘  │
                                       │          │          │
                                       │          ▼          │
                                       │  ┌───────────────┐  │
                                       │  │   Fallback    │  │
                                       │  │   Prediction  │  │
                                       │  │     Logic     │  │
                                       │  └───────────────┘  │
                                       │                     │
                                       └─────────────────────┘
```

## Data Flow

1. **Frontend Request**: The frontend application sends a prediction request with date, time, and task ID to the Flask API.
2. **API Processing**: The Flask API validates the input and passes it to the model predictor.
3. **Prediction Generation**: The model predictor uses the fallback prediction logic to generate an estimated completion time.
4. **Response**: The API returns the predicted completion time to the frontend.

## Components

### Frontend (Next.js)

- **Pages & Components**: User interface elements that display service information and predicted times
- **prediction-service.ts**: TypeScript service that communicates with the Flask API and handles fallbacks

### Backend (Flask)

- **Flask Server (app.py)**: Handles HTTP requests, input validation, and responses
- **Model Predictor (model_predictor.py)**: Core prediction logic with fallback mechanisms
- **Fallback Logic**: Rule-based estimation system that predicts service completion times

## Key Features

1. **Robust Error Handling**: Both frontend and backend implement error handling with fallback mechanisms
2. **Consistent Fallback Logic**: Backend and frontend use matching fallback mechanisms
3. **API Health Monitoring**: Health check endpoint to verify system status
4. **Input Validation**: Thorough validation to ensure proper date/time formats

## Testing Tools

- **test_api.py**: Tests the API endpoints with various inputs
- **test_model.py**: Tests the model predictor directly
- **test_standalone.py**: Simple script to test the predictor without Flask

## Setup Scripts

- **run_api.bat**: Sets up and runs the API server
- **setup_and_test.bat**: Sets up the environment and tests the model
- **start_server.bat**: Simple script to start the API server
