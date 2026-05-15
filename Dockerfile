# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# 1. Salin file package.json
COPY package*.json ./

# 2. TAMBAHKAN BARIS INI: Salin folder prisma sebelum npm install
COPY prisma ./prisma 

# 3. Jalankan instalasi (sekarang prisma generate akan berhasil karena file skemanya sudah ada)
RUN npm install

# 4. Salin sisa kode (termasuk folder src, dll)
COPY . .

# 5. Build aplikasi NestJS
RUN npm run build

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["node", "dist/main"]