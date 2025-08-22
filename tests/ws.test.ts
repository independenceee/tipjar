// // websocket.test.js
// import WebSocket from "ws";

// // Hàm kiểm tra kết nối WebSocket
// export const checkWebSocketConnection = async () => {
//   const wsUrl = "ws://hada-relay2.duckdns.org:4001";
//   return new Promise((resolve, reject) => {
//     const ws = new WebSocket(wsUrl);

//     ws.onopen = () => {
//       ws.close();
//       resolve({ status: "success", message: `Kết nối WebSocket thành công đến ${wsUrl}` });
//     };

//     ws.onerror = (error) => {
//       ws.close();
//       reject({ status: "error", message: `Lỗi kết nối WebSocket: ${error.message}` });
//     };

//     ws.onclose = ({ code, reason }) => {
//       if (code !== 1000) {
//         // 1000 là mã đóng bình thường
//         reject({ status: "closed", message: `Kết nối WebSocket đóng với mã: ${code}, lý do: ${reason || "Không có lý do"}` });
//       }
//     };
//   });
// };

// // Test cases sử dụng Jest
// describe("checkWebSocketConnection", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });
//   jest.setTimeout(600000000);

//   test("nên trả về lỗi khi kết nối đóng với mã không bình thường", async () => {
//     // Mock WebSocket để giả lập đóng kết nối với mã lỗi
//     jest.spyOn(global, "WebSocket").mockImplementation(() => {
//       const ws: any = {
//         onopen: null,
//         onerror: null,
//         onclose: null,
//         close: jest.fn(),
//         addEventListener: (event: string, callback: Function) => {
//           if (event === "close") {
//             callback({ code: 1001, reason: "Kết nối bị đóng bất ngờ" });
//           }
//         },
//       };
//       // Giả lập gọi sự kiện đóng kết nối sau một tick
//       setTimeout(() => {
//         if (typeof ws.onclose === "function") {
//           ws.onclose({ code: 1001, reason: "Kết nối bị đóng bất ngờ" });
//         }
//       }, 0);
//       return ws;
//     });

//     await expect(checkWebSocketConnection()).rejects.toMatchObject({
//       status: "closed",
//       message: expect.stringContaining("Kết nối WebSocket đóng với mã: 1001"),
//     });
//   });

//   afterEach(() => {
//     jest.restoreAllMocks();
//   });
// });
