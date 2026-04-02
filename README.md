# habit-tracker
Habit Tracker is a full-stack web application designed to help users build consistency through daily habit tracking. It includes authentication, streak calculation, statistical analysis, and data visualization. The backend is built with Node.js, Express, and MongoDB, while the frontend uses HTML, CSS, and vanilla JavaScript.

## Backend setup

Create a `.env` file at the project root with:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/habit-tracker
JWT_SECRET=change-me
JWT_EXPIRE=7d
```

Then start the backend with:

```bash
npm run dev
```
