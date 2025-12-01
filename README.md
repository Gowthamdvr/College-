# Gowtham Hospital App

## Backend Setup (Node.js + MongoDB)

This project includes a backend server located in the `server/` directory. By default, the frontend runs in "Mock Mode" using browser local storage.

To switch to the real backend:

1.  **Prerequisites**:
    *   Node.js installed
    *   MongoDB installed and running locally on default port 27017

2.  **Install Dependencies**:
    Navigate to the project root and install the necessary backend packages:
    ```bash
    npm install express mongoose cors jsonwebtoken bcryptjs
    ```

3.  **Run the Server**:
    ```bash
    node server/server.js
    ```
    The server will start on `http://localhost:5000`.

4.  **Connect Frontend**:
    In `services/mockDatabase.ts`, change the export to use the API implementation:
    ```typescript
    // import { apiDatabase } from './api';
    // export const db = apiDatabase; 
    ```
    (Note: You will need to import `apiDatabase` from `./api.ts`)

## Frontend Development

The frontend is built with React.
