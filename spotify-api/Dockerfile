FROM node:16

WORKDIR /app

COPY package*.json ./

ENV CLIENT_ID d967d5d7fd864c3fb1874d9703220b1e
ENV CLIENT_SECRET fad04d4c71e740e9bd250cc0d8892087
ENV REDIRECT_URI http//localhost:5000/callback
ENV MONGO_URL mongodb+srv://mongo:2VxOzTHwBQf6o45D@cluster0.pbfpoj7.mongodb.net/?retryWrites=true&w=majority
ENV AUDIENCE spapi
ENV ISSUER https://dev-c8nkqrxqb26svuth.us.auth0.com/
ENV TOKEN_SIGNING_ALG RS256
ENV FRONTEND_BASE_URL http://localhost:5173
ENV FRONTEND_REDIRECT_URL http://127.0.0.1:5173/party/
ENV PORT_HTTPS 5000
ENV PORT_SOCKET 5001

RUN npm ci

COPY . .

EXPOSE ${PORT_HTTPS}
EXPOSE ${PORT_SOCKET}
CMD [ "node", "server.js" ]