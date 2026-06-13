# Этап 1: Сборка приложения
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Переменная окружения передается во время сборки Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Этап 2: Раздача статики через Nginx
FROM nginx:1.25-alpine AS runner

# Удаляем дефолтный конфиг Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем наш кастомный конфиг (создадим его ниже)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранную статику из этапа сборки
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
