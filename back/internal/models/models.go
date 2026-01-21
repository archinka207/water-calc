package models

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"-"`
}

type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// LoginRequest - данные для входа
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// AuthResponse - ответ с токеном
type AuthResponse struct {
	Token string `json:"token"`
}

type WaterRequest struct {
	Weight  float64 `json:"weight"`
	IsSport bool    `json:"is_sport"`
}

type WaterResponse struct {
	Liters float64 `json:"liters"`
}
