FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .

ENV VITE_API_BASE_URL=/api/
ENV VITE_SOCKET_URL=

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]
