require("module-alias/register");
require("dotenv").config();
const express = require("express");
const path = require("path");

const apiRoute = require("@/routes/api");
const webRoute = require("@/routes/web");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const notFoundHandler = require("@/middlewares/notFoundHandler");
const errorsHandler = require("@/middlewares/errorHandler");
const handlePagination = require("@/middlewares/handlePagination");
const { sequelize } = require("./src/models");

const app = express();

//Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use(handlePagination);

async function sendDb() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

sendDb();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", webRoute);
app.use("/api/v1", apiRoute);

//Error Handler
app.use(notFoundHandler);
app.use(errorsHandler);

app.listen(3000, () => {
  console.log("App running");
});

// Yêu cầu:
// 1. Thiết kế database gồm bảng
// - conversations: chứa các cuộc hội thoại.
// - messages: chứa các tin nhắn, mỗi message thuộc 1 conversation cụ thể, có ít nhất 2 fields "role" và "content" (các field khác các bạn cần thì tự thiết kế thêm).

// 2. Thiết kế RESTful API
// - [POST] /conversations: để tạo cuộc hội thoại mới, sau đó lưu "conversationId" vào localStorage, khi nào kết thúc cuộc trò chuyện thì xóa khỏi localStorage.
// - [POST] /conversations/:id/chat: gửi lên đây để chat.
// - [GET] /conversations/:id/messages: lấy danh sách messages thuộc cuộc hội thoại, phân trang 20 records/page, mặc định sort theo mới -> cũ (message mới nhất nằm trên cùng).
// - [PATCH] /conversations/:id/close: kết thúc thuộc hội thoại.

// 3. Logic backend
// - Sử dụng OpenAI API hoặc tương tự.
// - Kiến trúc hệ thống theo luồng: Client -> 5 messages mới nhất -> Intent classifier -> Matched agent (default "defaultAgent").
// - Thiết kế DB bảng "agents" gồm: name, pattern, systemPrompt, isActive (default true). "pattern" chữa chuỗi dùng để định danh agent, unique. VD: Nhân viên Support có pattern là "supporter", nhân viên bán hàng khóa Pro là "sale.pro", ... pattern được sử dụng trong classifier intent để xác định agent (được dùng trong classifier system prompt và kết quả trả về của classifier sẽ là pattern của 1 trong số toàn bộ agents đang active).
// - Luồng làm việc:
// 1. Client gửi message chat lên backend.
// 2. Backend nhận message và lưu vào bảng messages, sau đó lấy ra tối đa 5 messages mới nhất của role "user" đẩy ra classifier (sử dụng model ) để xác định nhu cầu của client.
// 3. Sau khi xác định được "intent", load agent phù hợp, lấy tối đa 10 messages (cả "user" và "assistant") + system prompt của agent đẩy qua LLM để lấy nội dung trả lời của chatbot (lưu vào bảng messages) và trả về cho client.

// 4. Logic FE
// - Vào FE, nhấn "New conversation" thì tạo conversation mới và hiển thị cửa sổ chat.
// - Thực hiện chat, API sẽ phản hồi lại câu trả lời của chatbot - sử dụng nội dung này hiển thị ra UI.
// - Có nút "End chat" để kết thúc conversation. Khi đó, nhấn "New conversation" sẽ tạo cuộc trò chuyện mới.
