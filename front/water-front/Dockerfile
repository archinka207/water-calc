# Этап 1: Сборка React приложения
FROM node:18-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Этап 2: Запуск Nginx для раздачи статики
FROM nginx:alpine
# Копируем собранные файлы React из этапа build
COPY --from=build /app/build /usr/share/nginx/html
# Копируем наш конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]