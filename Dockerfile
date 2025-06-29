# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

RUN yarn build

# Stage 2: Serve static files with nginx
FROM nginx:alpine

# Удалим дефолтную страницу nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем только билд
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем ваш nginx конфиг в нужное место
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]