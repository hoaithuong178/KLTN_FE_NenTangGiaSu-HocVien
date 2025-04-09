# Sử dụng node bản LTS làm base image
FROM node:20-alpine AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm ci

# Sao chép toàn bộ mã nguồn
COPY . .

# Build ứng dụng
RUN npm run build

# Stage production - sử dụng nginx để phục vụ ứng dụng đã build
FROM nginx:alpine

# Sao chép kết quả build từ stage trước
COPY --from=build /app/dist /usr/share/nginx/html

# Sao chép cấu hình nginx (tùy chọn)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80
EXPOSE 5173

# Khởi động nginx
CMD ["nginx", "-g", "daemon off;"]