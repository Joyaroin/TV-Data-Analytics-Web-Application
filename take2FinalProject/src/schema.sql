PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS AgeGroup (
  AgeGroupID INTEGER PRIMARY KEY,
  AgeRange TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS User (
  UserID INTEGER PRIMARY KEY AUTOINCREMENT,
  Name TEXT NOT NULL,
  Email TEXT UNIQUE NOT NULL,
  Age INTEGER NOT NULL,
  AgeGroupID INTEGER,
  FOREIGN KEY (AgeGroupID) REFERENCES AgeGroup(AgeGroupID)
);

CREATE TABLE IF NOT EXISTS Interest (
  InterestID INTEGER PRIMARY KEY,
  InterestName TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS TvShow (
  ShowID INTEGER PRIMARY KEY,
  Title TEXT NOT NULL,
  ReleaseYear INTEGER,
  EpisodeCount INTEGER,
  StreamingPlatform TEXT
);

CREATE TABLE IF NOT EXISTS Rating (
  RatingID INTEGER PRIMARY KEY AUTOINCREMENT,
  UserID INTEGER,
  ShowID INTEGER,
  Score INTEGER NOT NULL,
  ReviewText TEXT,
  FOREIGN KEY (UserID) REFERENCES User(UserID),
  FOREIGN KEY (ShowID) REFERENCES TvShow(ShowID)
);

CREATE TABLE IF NOT EXISTS UserInterest (
  UserID INTEGER,
  InterestID INTEGER,
  PRIMARY KEY (UserID, InterestID),
  FOREIGN KEY (UserID) REFERENCES User(UserID),
  FOREIGN KEY (InterestID) REFERENCES Interest(InterestID)
);

CREATE TABLE IF NOT EXISTS ShowInterest (
  ShowID INTEGER,
  InterestID INTEGER,
  PRIMARY KEY (ShowID, InterestID),
  FOREIGN KEY (ShowID) REFERENCES TvShow(ShowID),
  FOREIGN KEY (InterestID) REFERENCES Interest(InterestID)
);

INSERT INTO AgeGroup (AgeGroupID, AgeRange) VALUES
  (1, 'Under 18'),
  (2, '18-30'),
  (3, '31-50'),
  (4, '51+'),
  (5, '65+');

INSERT INTO Interest (InterestID, InterestName) VALUES
  (1, 'Action'),
  (2, 'Comedy'),
  (3, 'Drama'),
  (4, 'Science Fiction'),
  (5, 'Documentary'),
  (6, 'Horror'),
  (7, 'Romance'),
  (8, 'Thriller'),
  (9, 'Fantasy'),
  (10, 'Mystery');

INSERT INTO TvShow (ShowID, Title, ReleaseYear, EpisodeCount, StreamingPlatform) VALUES
  (1, 'Stranger Things', 2016, 25, 'Netflix'),
  (2, 'The Crown', 2016, 40, 'Netflix'),
  (3, 'The Mandalorian', 2019, 16, 'Disney+'),
  (4, 'Planet Earth', 2006, 11, 'BBC'),
  (5, 'Friends', 1994, 236, 'NBC'),
  (6, 'Breaking Bad', 2008, 62, 'AMC'),
  (7, 'The Office', 2005, 201, 'NBC'),
  (8, 'Game of Thrones', 2011, 73, 'HBO'),
  (9, 'The Witcher', 2019, 16, 'Netflix'),
  (10, 'Sherlock', 2010, 13, 'BBC');

INSERT INTO User (Name, Email, Age, AgeGroupID) VALUES
  ('Sarah Johnson', 'sarah@example.com', 24, 2),
  ('Michael Chen', 'michael@example.com', 32, 3),
  ('Emma Wilson', 'emma@example.com', 19, 2),
  ('David Kim', 'david@example.com', 45, 3),
  ('Lisa Brown', 'lisa@example.com', 29, 2),
  ('James Taylor', 'james@example.com', 55, 4),
  ('Maria Garcia', 'maria@example.com', 16, 1),
  ('John Smith', 'john@example.com', 38, 3),
  ('Rachel Green', 'rachel@example.com', 27, 2),
  ('Thomas Anderson', 'thomas@example.com', 42, 3),
  ('Sophie Martin', 'sophie@example.com', 31, 3),
  ('Daniel Lee', 'daniel@example.com', 22, 2),
  ('Emily White', 'emily@example.com', 17, 1),
  ('Robert Davis', 'robert@example.com', 58, 4),
  ('Amanda Clark', 'amanda@example.com', 35, 3),
  ('Kevin Wright', 'kevin@example.com', 26, 2),
  ('Laura Turner', 'laura@example.com', 48, 3),
  ('Christopher Lee', 'chris@example.com', 33, 3),
  ('Jessica Adams', 'jessica@example.com', 21, 2),
  ('William Moore', 'william@example.com', 62, 4),
  ('Elizabeth Chen', 'elizabeth@example.com', 29, 2),
  ('Andrew Wilson', 'andrew@example.com', 41, 3),
  ('Michelle Park', 'michelle@example.com', 36, 3),
  ('Richard Brown', 'richard@example.com', 52, 4),
  ('Patricia Martinez', 'patricia@example.com', 44, 3);

INSERT INTO Rating (UserID, ShowID, Score, ReviewText) VALUES
  (16, 1, 8, 'Great show with amazing plot twists!'),
  (17, 2, 9, 'Historically accurate and engaging'),
  (18, 3, 7, 'Good but could be better'),
  (19, 4, 10, 'Simply breathtaking'),
  (20, 5, 6, 'Classic but somewhat dated'),
  (21, 6, 9, 'One of the best shows ever made'),
  (22, 7, 8, 'Hilarious and well-written'),
  (23, 8, 7, 'Epic scale but rushed ending'),
  (24, 9, 8, 'Fantastic adaptation'),
  (25, 10, 9, 'Brilliant mystery series'),
  (16, 2, 7, 'Solid historical drama'),
  (17, 3, 8, 'Great sci-fi entertainment'),
  (18, 4, 9, 'Educational and beautiful'),
  (19, 5, 7, 'Fun to watch'),
  (20, 6, 10, 'Masterpiece of television'),
  (21, 7, 8, 'Great workplace comedy'),
  (22, 8, 9, 'Amazing production value'),
  (23, 9, 7, 'Good fantasy series'),
  (24, 10, 8, 'Clever writing'),
  (25, 1, 9, 'Nostalgic and thrilling');

INSERT INTO UserInterest (UserID, InterestID) VALUES
  (16, 1), (16, 4), (16, 8),
  (17, 2), (17, 3), (17, 7),
  (18, 4), (18, 9), (18, 10),
  (19, 1), (19, 2), (19, 5),
  (20, 3), (20, 6), (20, 8),
  (21, 2), (21, 7), (21, 9),
  (22, 1), (22, 4), (22, 10),
  (23, 3), (23, 5), (23, 8),
  (24, 2), (24, 6), (24, 7),
  (25, 1), (25, 5), (25, 9);
