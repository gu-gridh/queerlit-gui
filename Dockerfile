# Build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
# Install before copying the rest, for caching purposes
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases .yarn/releases
RUN yarn install
COPY . .
RUN yarn run build

# Production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# Make Nginx run in foreground
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
CMD nginx
