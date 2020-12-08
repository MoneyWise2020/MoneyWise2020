# Build Stage 1
# This build created a staging docker image
#
FROM node:10.15.2-alpine AS appbuild
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY ./src ./src
COPY ./public ./public

ARG REACT_APP_MONEYWISE_BASE_URL
ENV REACT_APP_MONEYWISE_BASE_URL $REACT_APP_MONEYWISE_BASE_URL
ARG HTTPS
ENV HTTPS $HTTPS
RUN yarn build
# Build Stage 2
# This build takes the production build from staging build
#
FROM nginx:stable-alpine
COPY --from=appbuild /usr/src/app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
