# TrustChain AI

TrustChain AI is a multi-service demo project for video provenance signing and lightweight forensic verification.

It includes:

- `frontend/`: React + Vite dashboard UI
- `backend/`: Express API for upload, metadata storage, and verification routing
- `ai-service/`: FastAPI service for heuristic forensic scoring

## Project Architecture

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:5000`
- AI service runs on `http://localhost:8000`

The frontend calls the backend, and the backend calls the AI service when provenance verification is not enough.

## Requirements

Install these on the new PC before starting:

- Node.js 18+ with npm
- Python 3.10+ with `pip`
- Git

Optional but recommended:

- A Python virtual environment

## 1. Clone the Project

```powershell
git clone <your-repo-url>
cd trustchain-ai
```

## 2. Install Backend Dependencies

From the project root:

```powershell
npm install
```

This installs the root/backend Node packages used by the Express API.

## 3. Install Frontend Dependencies

```powershell
cd frontend
npm install
cd ..
```

## 4. Install AI Service Dependencies

```powershell
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

If you already use a global Python environment, the virtual environment step is optional.

## 5. Start the Project

Open 3 terminals.

### Terminal 1: Start the backend

From the project root:

```powershell
node backend/server.js
```

Expected output:

```text
Server running on port 5000
```

### Terminal 2: Start the AI service

From the project root:

```powershell
cd ai-service
.venv\Scripts\activate
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### Terminal 3: Start the frontend

From the project root:

```powershell
cd frontend
npm run dev
```

Then open the URL shown by Vite, usually:

```text
http://localhost:5173
```

## How to Use

1. Open the frontend in the browser.
2. Select a video file.
3. Click `Upload & Sign` to create a provenance record.
4. Click `Verify Video` to verify the file.

Behavior:

- If the uploaded file matches a stored provenance hash, the result shows `VERIFIED`.
- If no provenance match is found, the backend sends the file path to the AI service for forensic scoring.

## Storage and Generated Files

The backend stores data here:

- `backend/storage/videos/`: uploaded video files
- `backend/storage/metadata.json`: provenance metadata records

If you move the project to another PC, these files can be copied too if you want to preserve previous upload history.

## Common Issues

### 1. `Upload failed`

Check that:

- backend is running on port `5000`
- AI service is running on port `8000`
- frontend is running on port `5173`

### 2. `Verification failed`

Usually this means:

- the backend is not reachable
- the AI service is not running
- Python dependencies were not installed correctly

### 3. `npm error could not determine executable to run`

This can happen with Tailwind 4 if you try:

```powershell
npx tailwindcss init -p
```

This project already uses Tailwind 4 through PostCSS, so you do not need the old Tailwind init command.

### 4. Metadata JSON parsing issues

If `backend/storage/metadata.json` becomes corrupted or has the wrong encoding, delete it and restart the backend. A clean metadata file will be recreated automatically.

## Quick Start Summary

After cloning, the shortest working sequence is:

```powershell
npm install
cd frontend
npm install
cd ..
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd ..
node backend/server.js
```

In separate terminals:

```powershell
cd ai-service
.venv\Scripts\activate
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

```powershell
cd frontend
npm run dev
```

## Notes

- There are currently no environment variables required to run the project.
- The AI scoring is a heuristic demo, not a production-grade deepfake detector.
- The backend and frontend currently use hardcoded localhost URLs, so the services should be started on the same machine unless you update the endpoints.
