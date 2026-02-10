import sqlite3 as sql

conn = sql.connect("project\\backend\\db.sqlite3")
cursor = conn.cursor()
q = "DROP TABLE patients;"
cursor.execute(q)
query = """
    CREATE TABLE patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')) NOT NULL,
    memory_loss_issues TEXT CHECK(memory_loss_issues IN ('Yes', 'No')) NOT NULL,
    difficulty_in_daily_activities TEXT CHECK(difficulty_in_daily_activities IN ('Yes', 'No')) NOT NULL,
    family_history TEXT CHECK(family_history IN ('Yes', 'No')) NOT NULL,
    exercise_daily TEXT CHECK(exercise_daily IN ('Regularly', 'Sometimes', 'Never')) NOT NULL,
    diet_type TEXT NOT NULL
);
"""
q2 = """
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);
"""
cursor.execute(query)
# cursor.execute(q2)
cursor.close()
conn.close()