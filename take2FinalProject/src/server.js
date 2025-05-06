const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const db = new Database('tvshows.db', { verbose: console.log });

app.get('/api/users', (req, res) => {
    try {
        const users = db.prepare('SELECT * FROM User').all();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/shows', (req, res) => {
    try {
        const shows = db.prepare('SELECT * FROM TvShow').all();
        res.json(shows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/interests', (req, res) => {
    try {
        const interests = db.prepare('SELECT * FROM Interest').all();
        res.json(interests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', (req, res) => {
    const { name, email, age, interests } = req.body;
    const ageGroupId = getAgeGroupId(age);

    try {
        db.prepare('BEGIN').run();

        const insertUser = db.prepare(
            'INSERT INTO User (Name, Email, Age, AgeGroupID) VALUES (?, ?, ?, ?)'
        );
        const userResult = insertUser.run(name, email, age, ageGroupId);
        const userId = userResult.lastInsertRowid;

        const insertInterest = db.prepare(
            'INSERT INTO UserInterest (UserID, InterestID) VALUES (?, ?)'
        );
        interests.forEach(interestId => {
            insertInterest.run(userId, interestId);
        });

        db.prepare('COMMIT').run();
        res.json({ id: userId, message: 'User added successfully' });
    } catch (err) {
        db.prepare('ROLLBACK').run();
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/ratings', (req, res) => {
    const { userId, showId, score, reviewText } = req.body;
    
    try {
        const insertRating = db.prepare(
            'INSERT INTO Rating (UserID, ShowID, Score, ReviewText) VALUES (?, ?, ?, ?)'
        );
        const result = insertRating.run(userId, showId, score, reviewText);
        res.json({ id: result.lastInsertRowid, message: 'Rating added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/ratings/by-age-group', (req, res) => {
    try {
        const query = `
            SELECT 
                ag.AgeRange,
                t.Title,
                AVG(r.Score) as averageScore,
                COUNT(r.RatingID) as numberOfRatings
            FROM Rating r
            JOIN User u ON r.UserID = u.UserID
            JOIN TvShow t ON r.ShowID = t.ShowID
            JOIN AgeGroup ag ON u.AgeGroupID = ag.AgeGroupID
            GROUP BY ag.AgeRange, t.Title
            ORDER BY ag.AgeGroupID, averageScore DESC`;
        
        const ratings = db.prepare(query).all();
        
        const ratingsByAgeGroup = {};
        ratings.forEach(rating => {
            if (!ratingsByAgeGroup[rating.AgeRange]) {
                ratingsByAgeGroup[rating.AgeRange] = [];
            }
            ratingsByAgeGroup[rating.AgeRange].push({
                title: rating.Title,
                averageScore: parseFloat(rating.averageScore.toFixed(1)),
                numberOfRatings: rating.numberOfRatings
            });
        });
        
        res.json(ratingsByAgeGroup);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/ratings/overall-by-age-group', (req, res) => {
    try {
        const query = `
            SELECT 
                ag.AgeRange,
                COUNT(DISTINCT u.UserID) as NumberOfUsers,
                COUNT(r.RatingID) as TotalRatings,
                AVG(r.Score) as AverageScore
            FROM AgeGroup ag
            LEFT JOIN User u ON ag.AgeGroupID = u.AgeGroupID
            LEFT JOIN Rating r ON u.UserID = r.UserID
            GROUP BY ag.AgeGroupID, ag.AgeRange
            ORDER BY ag.AgeGroupID`;
        
        const stats = db.prepare(query).all();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/ratings/detailed', (req, res) => {
    try {
        const query = `
            SELECT 
                r.RatingID,
                u.Name as UserName,
                u.Age,
                ag.AgeRange,
                t.Title as ShowTitle,
                r.Score,
                r.ReviewText,
                GROUP_CONCAT(i.InterestName) as UserInterests
            FROM Rating r
            JOIN User u ON r.UserID = u.UserID
            JOIN TvShow t ON r.ShowID = t.ShowID
            JOIN AgeGroup ag ON u.AgeGroupID = ag.AgeGroupID
            LEFT JOIN UserInterest ui ON u.UserID = ui.UserID
            LEFT JOIN Interest i ON ui.InterestID = i.InterestID
            GROUP BY r.RatingID
            ORDER BY r.RatingID DESC`;
        const ratings = db.prepare(query).all();
        res.json(ratings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

function getAgeGroupId(age) {
    if (age < 18) return 1;
    if (age <= 30) return 2;
    if (age <= 50) return 3;
    if (age <= 65) return 4;
    return 5;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
