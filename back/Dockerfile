# ЭТАП 1: Сборка (Builder)
# Используем официальный образ Go на базе Alpine Linux (он легкий)
FROM golang:1.25-alpine AS builder

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы зависимостей
COPY go.mod go.sum ./

# Загружаем зависимости (этот шаг закешируется, если файлы не менялись)
RUN go mod download

# Копируем исходный код проекта
COPY . .

# Собираем бинарный файл
# CGO_ENABLED=0 - отключает C-библиотеки (важно для работы в alpine scratch)
# GOOS=linux - собираем под Linux
# -o main - имя выходного файла
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/api

# ЭТАП 2: Финальный образ (Runner)
# Используем минималистичный Alpine
FROM alpine:latest

# Устанавливаем сертификаты (нужны, если вдруг api будет делать запросы наружу по https)
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Копируем скомпилированный бинарник из первого этапа
COPY --from=builder /app/main .

# Открываем порт, который слушает наше приложение
EXPOSE 8080

# Команда для запуска
CMD ["./main"]