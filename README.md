# GameLog — Gaming Backlog Tracker

A full-stack web app to track your gaming backlog. 
Search for real games, add them to your list, update 
your status as you play, rate completed games, and see 
meaningful stats about your gaming habits.

## Live Demo
[Your Railway URL here]

## Features
- Search real games using the RAWG API
- Add games to your backlog with a chosen status and platform
- Update status: Want to Play, Currently Playing, Completed, Dropped
- Rate games you have finished (1-10) using a slider
- Track hours played
- Stats: completion rate by genre, average rating by platform, 
  most abandoned genre, backlog growth rate by week

## Tech Stack
- Frontend: Vanilla JavaScript, HTML, CSS
- Backend: Node.js, Express
- Database: SQLite via better-sqlite3
- External API: RAWG Video Games Database
- Deployment: Railway

## Why This Stack
I chose Vanilla JS because it is my strongest foundation 
and I wanted full control over every line without a framework 
abstracting things away. Express and SQLite were chosen for 
their minimal setup — I could focus on architecture and logic 
rather than configuration.

## Architecture
The codebase is separated into 4 strict layers:

- `js/api/` — all external API calls, RAWG only, one file
- `js/data/` — all database calls, nothing else
- `js/services/` — all business logic and stats calculations
- `js/controllers/` — connects UI events to services
- `js/ui/` — display only, no logic, no API calls

## How to Run Locally
1. Clone the repo
2. Run `npm install`
3. Create a `.env` file based on `.env.example`
4. Add your RAWG API key to `.env`
5. Run `npm start`
6. Open `http://localhost:3000`

## Stats Layer
The stats are computed using SQL aggregations on the database:
- Completion rate uses `CASE WHEN` inside `SUM` grouped by genre
- Average rating uses `AVG()` grouped by platform
- Growth rate uses `strftime` to group entries by week
- Most abandoned uses `COUNT` filtered by dropped status

## API Credit
Game data provided by [RAWG](https://rawg.io)