# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build and run the Node/Express backend
FROM node:20-alpine AS backend

WORKDIR /app/server

COPY server/package*.json ./
RUN npm install
# Optional: ensure missing types don’t break build
RUN npm install --save-dev @types/randomstring @types/nodemailer || true

COPY server/ ./
RUN npm run build

# Copy frontend build into backend's public folder
COPY --from=frontend-build /app/client/dist /app/server/dist/public

EXPOSE 8080
ENV NODE_ENV=production

CMD ["node", "dist/js/index.js"]
