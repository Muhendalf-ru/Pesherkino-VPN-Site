# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app
COPY . .
RUN yarn install && yarn build

# Stage 2: Serve static files with nginx
FROM nginx:alpine

# Удалим дефолтную страницу nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем только билд
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
