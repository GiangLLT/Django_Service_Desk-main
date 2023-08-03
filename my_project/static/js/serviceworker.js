
// Register the service worker
// navigator.serviceWorker.register('serviceworker.js');

// service-worker.js

// Sự kiện "install" được gọi khi service worker được đăng ký
// self.addEventListener("install", function (event) {
//     event.waitUntil(
//       // Tải các tài nguyên và lưu vào bộ nhớ cache
//       caches.open("my-cache").then(function (cache) {
//         return cache.addAll([
//           "/",
//           "/Ticket_ListTicket.html",
//           "/danh-sach-yeu-cau",
//           "/styles.css",
//           "/ajax.js",
//           // Thêm các tài nguyên khác của trang web vào đây
//         ]);
//       })
//     );
//   });
  
//   // Sự kiện "fetch" được gọi khi trang web yêu cầu tài nguyên
//   self.addEventListener("fetch", function (event) {
//     event.respondWith(
//       // Kiểm tra xem tài nguyên có sẵn trong bộ nhớ cache không
//       caches.match(event.request).then(function (response) {
//         // Nếu có, trả về tài nguyên từ bộ nhớ cache
//         if (response) {
//           return response;
//         }
//         // Nếu không, tiến hành fetch từ máy chủ
//         return fetch(event.request);
//       })
//     );
//   });

if ("serviceWorker" in navigator) {
    // Kiểm tra nếu Service Worker đã đăng ký thành công
    navigator.serviceWorker.ready.then(function (registration) {
      console.log("Service Worker đã đăng ký thành công:", registration);
    }).catch(function (error) {
      console.error("Đăng ký Service Worker thất bại:", error);
    });
  
    // Đăng ký Service Worker
    navigator.serviceWorker.register("/static/js/serviceworker.js")
      .then(function (registration) {
        console.log("Đăng ký Service Worker thành công:", registration);
      }).catch(function (error) {
        console.error("Đăng ký Service Worker thất bại:", error);
      });
  } else {
    console.error("Trình duyệt không hỗ trợ Service Worker.");
  }
  