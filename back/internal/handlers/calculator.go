package handlers

import (
	"encoding/json"
	"net/http"
	"water-calc/internal/models"
)

func CalculateWater(w http.ResponseWriter, r *http.Request) {
	var req models.WaterRequest

	// Декодируем JSON
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Валидация
	if req.Weight <= 0 {
		http.Error(w, "Weight must be positive", http.StatusBadRequest)
		return
	}

	// Формула: Вес * 0.03 (30мл на кг). Если спорт + 0.5л
	liters := req.Weight * 0.03
	if req.IsSport {
		liters += 0.5
	}

	// Округлим до 2 знаков для красоты
	resp := models.WaterResponse{
		Liters: float64(int(liters*100)) / 100,
	}

	// Отправляем ответ
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
