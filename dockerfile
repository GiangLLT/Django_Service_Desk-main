# Sử dụng image cơ sở là Python
FROM python:3.11.2

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy và cài đặt các phụ thuộc Python (requirements.txt)
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy mã nguồn Django vào container
COPY . .

# Mở cổng mạng (nếu cần)
EXPOSE 8000

# Khởi chạy ứng dụng Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
