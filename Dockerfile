FROM node:16-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

ARG VITE_SERVICE_NAME
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY
RUN yarn build

FROM nginx:1.19-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]