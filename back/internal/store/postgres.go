package store

import (
	"database/sql"
	"errors"
	"fmt"

	"water-calc/internal/models"

	_ "github.com/jackc/pgx/v5/stdlib"
)

type Database struct {
	DB *sql.DB
}

func NewDB(connStr string) (*Database, error) {
	db, err := sql.Open("pgx", connStr)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	query := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		username TEXT UNIQUE NOT NULL,
		password_hash TEXT NOT NULL
	);`

	_, err = db.Exec(query)
	if err != nil {
		return nil, fmt.Errorf("could not create users table: %w", err)
	}

	return &Database{DB: db}, nil
}

func (d *Database) CreateUser(user *models.User) error {
	query := `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id`
	err := d.DB.QueryRow(query, user.Username, user.Password).Scan(&user.ID)
	if err != nil {
		return err
	}
	return nil
}

// GetUserByUsername ищет пользователя (для логина)
func (d *Database) GetUserByUsername(username string) (*models.User, error) {
	user := &models.User{}
	query := `SELECT id, username, password_hash FROM users WHERE username = $1`

	err := d.DB.QueryRow(query, username).Scan(&user.ID, &user.Username, &user.Password)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return user, nil
}
