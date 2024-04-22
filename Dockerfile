# Определяем базовый образ
FROM node:18.19.1

# Создаем директорию приложения
WORKDIR /usr/src/app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения
COPY . .

# Открываем порт
EXPOSE 8080

ARG MODE
ENV MODE=${MODE}

# Запускаем приложение
CMD [ "npm", "run", "dev" ]
