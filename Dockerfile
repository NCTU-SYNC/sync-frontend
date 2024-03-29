FROM node:lts-alpine as build-stage

ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_DB_URL
ARG VITE_FIREBASE_PROJ_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MSG_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_APP_BASE_URL
ARG VITE_APP_API_URL

WORKDIR /app
COPY . .
RUN yarn install

RUN VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY} \
  VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN} \
  VITE_FIREBASE_DB_URL=${VITE_FIREBASE_DB_URL} \
  VITE_FIREBASE_PROJ_ID=${VITE_FIREBASE_PROJ_ID} \
  VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET} \
  VITE_FIREBASE_MSG_SENDER_ID=${VITE_FIREBASE_MSG_SENDER_ID} \
  VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID} \
  VITE_FIREBASE_MEASUREMENT_ID=${VITE_FIREBASE_MEASUREMENT_ID} \
  VITE_APP_BASE_URL=${VITE_APP_BASE_URL} \
  VITE_APP_API_URL=${VITE_APP_API_URL} \
  yarn run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
