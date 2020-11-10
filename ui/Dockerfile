# Build Stage 1
# This build created a staging docker image
#
FROM node:10.15.2-alpine AS appbuild
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY ./src ./src
COPY ./public ./public
RUN yarn build
# Build Stage 2
# This build takes the production build from staging build
#
FROM httpd:2.4-alpine
COPY --from=appbuild /usr/src/app/build /usr/local/apache2/htdocs/
