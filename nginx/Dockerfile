# FROM tiangolo/node-frontend:latest as build-stage
# WORKDIR /app
# COPY /dist /app/dist
FROM node:16-alpine as build-stage
WORKDIR /app
COPY client .
WORKDIR /app/client
RUN npm ci
ENV VITE_NODE_URL = http://spapi
ENV VITE_PYTHON_URL = http://fapi
ENV VITE_AUTH0_CALLBACK_URL = http://nginx/callback
ENV VITE_AUTH0_CLIENT_ID = crfuoasSy9ASSwaYat8S2JBTBqEPxjFP
ENV VITE_AUTH0_DOMAIN = dev-c8nkqrxqb26svuth.us.auth0.com
ENV VITE_AUDIENCE_NODE = spapi
ENV VITE_AUDIENCE_PYTHON = partymanager-api

RUN npm run build

ENV NODE_ENV production
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:latest
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
COPY  nginx/nginx.conf /etc/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]