# Hướng dẫn thiết lập Socket.IO cho dự án

## Cài đặt dependency

Để sử dụng các tính năng socket đã được cấu hình, bạn cần cài đặt gói `socket.io-client`:

```bash
npm install socket.io-client @types/socket.io-client
```

## Cấu trúc thư mục

Các file liên quan đến socket:

1. `src/configs/socket.config.ts` - Cấu hình và khởi tạo kết nối socket
2. `src/hooks/useSocket.ts` - Hook React để sử dụng socket trong các component
3. `src/pages/TempChat.tsx` - Component chat cơ bản sử dụng socket trực tiếp
4. `src/pages/ChatWithHook.tsx` - Component chat sử dụng hook useSocket

## Cấu hình URL Socket Server

Mặc định, socket được cấu hình để kết nối đến `http://localhost:3000`. Bạn có thể thay đổi URL này bằng cách:

1. Thêm biến môi trường `VITE_SOCKET_URL` trong file `.env`:

    ```
    VITE_SOCKET_URL=http://your-socket-server.com
    ```

2. Hoặc thay đổi trực tiếp trong file `src/configs/socket.config.ts`

## Sử dụng Socket trong ứng dụng

### Cách 1: Sử dụng hook useSocket

```jsx
import { useSocket } from '../hooks/useSocket';

const YourComponent = () => {
  const { socket, connected, connect, disconnect } = useSocket();

  // Kết nối với server
  const handleConnect = () => {
    connect('user123');
  };

  // Gửi tin nhắn
  const sendMessage = () => {
    if (socket) {
      socket.emit('message', { text: 'Hello' });
    }
  };

  // Nhận tin nhắn
  useEffect(() => {
    if (socket) {
      socket.on('message', (data) => {
        console.log('Tin nhắn mới:', data);
      });

      return () => {
        socket.off('message');
      };
    }
  }, [socket]);

  return (/* ... */);
};
```

### Cách 2: Sử dụng trực tiếp từ socket.config.ts

```jsx
import { initializeSocket, disconnectSocket } from '../configs/socket.config';

const YourComponent = () => {
  const [socket, setSocket] = useState(null);

  const handleConnect = () => {
    const newSocket = initializeSocket('user123');
    setSocket(newSocket);
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  return (/* ... */);
};
```

## Backend Socket Server

Đảm bảo bạn có một máy chủ Socket.IO phía backend để xử lý các sự kiện socket. Dưới đây là một ví dụ đơn giản sử dụng Express và Socket.IO:

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('Người dùng đã kết nối:', socket.id);

    // Lấy userId từ thông tin xác thực
    const { userId } = socket.handshake.auth;
    console.log('User ID:', userId);

    // Xử lý tin nhắn
    socket.on('message', (data) => {
        // Phát sóng tin nhắn đến tất cả client đã kết nối
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('Người dùng đã ngắt kết nối:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});
```
