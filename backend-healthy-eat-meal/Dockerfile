# Этап 1: Сборка зависимостей
FROM python:3.11-slim AS builder

WORKDIR /app

# Запрещаем Python писать файлы .pyc и включаем буферизацию логов для Loki
ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Устанавливаем зависимости в локальную папку
RUN pip install --no-cache-dir --user -r requirements.txt

# Этап 2: Финальный минимальный образ
FROM python:3.11-slim AS runner

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1 \
  PATH=/root/.local/bin:$PATH

# Копируем установленные пакеты из builder
COPY --from=builder /root/.local /root/.local
# Копируем исходный код бэкенда
COPY . .

EXPOSE 8000

# Запуск Uvicorn с указанием хоста для доступности внутри Docker-сети
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
