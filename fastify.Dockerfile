#syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
ENV DOCKERIZED_HOST="0.0.0.0"
COPY . .
RUN npm ci 
EXPOSE 8000
CMD [ "node", "app.js" ]
#HEALTHCHECK --interval=60s --timeout=3s --start-period=5s --retries=3 CMD "curl http://localhost:8000 || exit 1"