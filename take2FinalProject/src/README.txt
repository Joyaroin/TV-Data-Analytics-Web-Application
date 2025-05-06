TV Show Database Application
==========================

Database File Location
---------------------
The SQLite database file is located at:
src/tvshows.db

You can examine the database using the SQLite3 command line tool:
./sqlite3 tvshows.db

Installation & Setup
------------------
1. Ensure Node.js is installed on your system
2. Install required dependencies:
   npm install

Running the Application
---------------------
1. Initialize the database:
   node init-db.js
2. Start the server:
   node server.js


The server runs on port 3001 by default.

Features
--------
- Add and view TV show ratings
- User profile management
- Detailed rating statistics
- Age group analysis
- Interest-based recommendations

Project Structure
---------------
- src/
  - tvshows.db (SQLite database file)
  - server.js (Backend server)
  - app.js (Frontend logic)
  - index.html (Main interface)
  - styles.css (Styling)

Youtube Link:  https://youtu.be/qbn4DkcSYR8?si=2lOPXBDUE2Wtyslz