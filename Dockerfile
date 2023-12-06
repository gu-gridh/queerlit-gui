# Build stage
FROM oven/bun:latest as build-stage
WORKDIR /app
# Install deps before adding code, for caching purposes
COPY package.json ./
COPY bun.lockb ./
RUN bun install
# Add code and build
COPY . .
RUN bunx vite build

# Production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# Make Nginx run in foreground
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
CMD nginx
