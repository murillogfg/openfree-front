# =========================================================
# OpenFree - front-end (Angular) servido por Nginx
# Usado no Railway: openfree.genovaforge.com.br
# =========================================================

# ---------- 1) Build do Angular ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npx ng build --configuration production


# ---------- 2) Servidor Nginx ----------
FROM nginx:1.27-alpine

# O Nginx oficial troca ${PORT} e ${API_URL} deste template
# ao iniciar o container (envsubst).
COPY deploy/nginx.conf.template /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist/openfree-front/browser /usr/share/nginx/html

# Railway informa a porta pela variável PORT.
ENV PORT=8080
ENV API_URL=https://openfree-api.genovaforge.com.br
ENV NGINX_ENVSUBST_FILTER="^(PORT|API_URL)$"

EXPOSE 8080
