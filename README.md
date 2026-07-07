# 🕶️ FaceFit AI — Hệ Thống Gợi Ý Mắt Kính Thông Minh Bằng AI
### Đồ Án Môn Học Máy Học - Nhóm 22 (Đại Học Nông Lâm TP.HCM)

<div align="center">
  <!-- Biometric Eyewear Logo SVG -->
  <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="background: #090d16; border-radius: 24px; padding: 15px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(99, 102, 241, 0.25);">
    <path d="M22 35 C20 38, 20 42, 20 50 C20 58, 20 62, 22 65" stroke="#818cf8" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
    <path d="M78 35 C80 38, 80 42, 80 50 C80 58, 80 62, 78 65" stroke="#818cf8" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
    <path d="M42 22 C45 20, 48 20, 50 20 C52 20, 55 20, 58 22" stroke="#818cf8" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
    <path d="M28 46 Q38 42 46 47" stroke="#22d3ee" strokeWidth="6.5" strokeLinecap="round" />
    <path d="M72 46 Q62 42 54 47" stroke="#22d3ee" strokeWidth="6.5" strokeLinecap="round" />
    <rect x="25" y="47" width="20" height="15" rx="5" stroke="#ffffff" strokeWidth="5.5" fill="none" />
    <rect x="55" y="47" width="20" height="15" rx="5" stroke="#ffffff" strokeWidth="5.5" fill="none" />
    <path d="M45 54 Q50 50 55 54" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
  </svg>
  
  <p align="center" style="margin-top: 15px;">
    <strong>Hệ thống phân tích dáng khuôn mặt bằng học sâu (Deep Learning) và đề xuất/đeo thử kính ảo tương tác thời gian thực.</strong>
  </p>

  <p align="center">
    <a href="https://github.com/nguyenvandiennlu/FaceAI_Nhom22"><img src="https://img.shields.io/badge/GitHub-Repository-blue?logo=github&style=flat-square" alt="Repo" /></a>
    <img src="https://img.shields.io/badge/React-19.0-blue?logo=react&logoColor=cyan&style=flat-square" alt="React" />
    <img src="https://img.shields.io/badge/FastAPI-0.100+-emerald?logo=fastapi&style=flat-square" alt="FastAPI" />
    <img src="https://img.shields.io/badge/TensorFlow-2.21-orange?logo=tensorflow&style=flat-square" alt="TensorFlow" />
    <img src="https://img.shields.io/badge/OpenCV-4.11-red?logo=opencv&style=flat-square" alt="OpenCV" />
    <img src="https://img.shields.io/badge/Vite-8.x-purple?logo=vite&style=flat-square" alt="Vite" />
  </p>
</div>

---

## 📖 Giới thiệu dự án

**FaceFit AI** là sản phẩm kết hợp giữa công nghệ Xử lý ảnh sinh trắc học và Trí tuệ nhân tạo để giải quyết nhu cầu lựa chọn mắt kính phù hợp với hình dáng khuôn mặt. 

### Các tính năng cốt lõi nổi bật:
* **Nhận diện khuôn mặt thời gian thực:** OpenCV Haar Cascade kiểm duyệt chất lượng hình ảnh đầu vào, tự động cắt ảnh căn giữa quai hàm.
* **Đa dạng mô hình AI:** So sánh và tùy chọn phân tích dáng mặt qua 4 mô hình: SVM (HOG), CNN Custom, ResNet50 (Transfer Learning) và EfficientNetV2.
* **Tia quét Laser Biometric:** Hiệu ứng camera quét sinh trắc học HUD + tia quét laser xanh ngọc chuyển động quét dọc bức ảnh cực kỳ sinh động khi đang xử lý phân tích.
* **Virtual Try-On (Thử kính ảo tương tác):** Đeo thử các gọng kính SVG (Rectangle, Round, Wayfarer, Aviator...) trực tiếp trên ảnh chân dung bằng cơ chế kéo thả drag, thanh trượt phóng to/thu nhỏ (Scale) và xoay góc kính (Rotate) khớp với khuôn mặt.
* **Hồ sơ phân tích chi tiết (Diagnostics Tab):**
  * **Confusion Matrix Heatmap:** Ma trận nhầm lẫn 5x5 chuyển sắc trực quan.
  * **ROC/AUC Curves:** Biểu đồ đường cong ROC 5 dáng mặt (đạt AUC trung bình 0.976).
* **Xuất báo cáo PDF:** Nút bấm tự động tải báo cáo kết quả phân tích A4 định dạng chuyên nghiệp dạng thẻ chẩn đoán y tế.

**FaceFit AI** là một ứng dụng web cao cấp giúp giải quyết vấn đề chọn kính phù hợp với khuôn mặt bằng trí tuệ nhân tạo. Hệ thống chụp/nhận ảnh trực diện của người dùng, tự động kiểm tra tính hợp lệ bằng bộ lọc phát hiện khuôn mặt (**OpenCV Haar Cascade**), chuẩn hóa tỷ lệ ảnh và cho phép người dùng tùy chọn 1 trong 4 mô hình học máy: **SVM (HOG), CNN Custom, ResNet50, EfficientNetV2** để chạy phân tích và dự đoán chính xác dáng mặt.

Dựa trên kết quả dáng mặt, ứng dụng sẽ đề xuất ngay Top 3 dáng kính phù hợp nhất được lập trình theo nguyên lý cân bằng đối lập hình học thẩm mỹ thời trang.

---

## 🎨 Trực quan hóa Quy trình (Architecture Pipeline)

Bức ảnh tải lên sẽ đi qua chuỗi kiến trúc xử lý song song của hệ thống:

```
[Ảnh tải lên] ──> [OpenCV Face Filter] ──> [Center Crop] ──> [AI Predict (Selected Model)] ──> [Đề xuất mắt kính]
```

_Dưới đây là sơ đồ luồng dữ liệu (Sequence Diagram) chi tiết của hệ thống:_

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant FE as React Frontend
    participant BE as FastAPI Backend
    participant CV as OpenCV (Face Check)
    participant AI as AI Models (SVM / CNN / ResNet)

    User->>FE: Tải ảnh chân dung lên & Chọn mô hình AI
    FE->>BE: Gửi yêu cầu POST /predict (Kèm ảnh & Tên mô hình được chọn)
    Note over BE: Đọc dữ liệu tập tin ảnh
    BE->>CV: Gọi hàm has_face(contents)
    alt Không tìm thấy khuôn mặt (Face count = 0)
        CV-->>BE: Trả về False
        BE-->>FE: HTTP 400 (Không tìm thấy khuôn mặt...)
        FE-->>User: Hiển thị cảnh báo lỗi màu đỏ
    else Tìm thấy khuôn mặt (Face count > 0)
        CV-->>BE: Trả về True
        Note over BE: Cắt ảnh vuông trung tâm & Resize (224x224)
        BE->>AI: Đưa dữ liệu ảnh vào Mô hình đã chọn để dự đoán
        AI-->>BE: Trả về vector xác suất của 5 dáng mặt
        Note over BE: Phân tích dáng mặt cao nhất & Lấy đề xuất gọng kính
        BE-->>FE: HTTP 200 OK (Kết quả dáng mặt & Top 3 kính)
        FE-->>User: Hiển thị Dashboard kết quả & Gợi ý kính trực quan
    end
```

---

## 💻 Tech Stack (Công nghệ sử dụng)

| Thành phần           | Công nghệ                  | Chi tiết                                                                             |
| :------------------- | :------------------------- | :----------------------------------------------------------------------------------- |
| **Frontend UI**      | React 19, TypeScript       | Giao diện hiện đại, mượt mà, responsive, tương thích mọi thiết bị.                   |
| **Styling**          | Vanilla CSS, Framer Motion | Hiệu ứng chuyển động (animations) sang trọng, giao diện tối mờ kính (glassmorphism). |
| **Đa ngôn ngữ**      | i18next & react-i18next    | Chuyển đổi ngôn ngữ Tiếng Việt / Tiếng Anh tức thì toàn trang.                       |
| **Backend API**      | FastAPI (Python)           | Server API hiệu năng cao, xử lý dữ liệu bất đồng bộ.                                 |
| **Machine Learning** | TensorFlow 2.x, Keras, Scikit-Learn | Hỗ trợ chạy các mô hình AI (SVM, CNN, ResNet50, EfficientNetV2). |
| **Xử lý ảnh**        | OpenCV, Pillow             | Phát hiện khuôn mặt, crop trung tâm ảnh bảo toàn tỷ lệ quai hàm.                     |

---

## 📁 Cấu trúc thư mục (Folder Tree)

```text
FaceAI_Nhom22/
├── backend/                               # --- BACKEND (Python) ---
│   ├── app.py                             # File chạy FastAPI chính, load model & predict
│   ├── haarcascade_frontalface_default.xml # File mẫu OpenCV phát hiện khuôn mặt
│   ├── requirements.txt                   # Danh sách thư viện Python cần cài đặt
│   ├── resnet50_faceshape.keras           # File mô hình học máy ResNet50 286MB (được gitignore chặn)
│   ├── efficientnetv2_faceshape.keras     # File mô hình EfficientNetV2 (được gitignore)
│   ├── cnn_faceshape.keras                # File mô hình CNN Custom (được gitignore)
│   └── svm_faceshape.pkl                  # File mô hình SVM (được gitignore)
├── src/                                   # --- FRONTEND (React) ---
│   ├── components/                        # Các thành phần giao diện (Navbar, Upload, Dashboard...)
│   ├── services/                          # File kết nối API (api.ts)
│   ├── types/                             # Khai báo kiểu dữ liệu TypeScript
│   ├── App.tsx                            # Component gốc bọc ứng dụng
│   ├── i18n.ts                            # Cấu hình đa ngôn ngữ Tiếng Việt / Tiếng Anh
│   └── index.css                          # Cấu hình phong cách giao diện toàn dự án
├── .gitignore                             # Cấu hình chặn đẩy file nặng/môi trường lên GitHub
├── package.json                           # Các dependencies của Node.js
├── pnpm-lock.yaml                         # Đồng bộ hóa các phiên bản gói thư viện frontend
└── README.md                              # Tài liệu hướng dẫn sử dụng dự án
```

---

## 🛠️ Hướng dẫn cài đặt & Khởi chạy

### 1. Thiết lập Backend (Python)

Yêu cầu máy đã cài **Python 3.9 - 3.11** và **pip**.

1. **Di chuyển vào thư mục backend:**
   ```bash
   cd backend
   ```
2. **Khởi tạo môi trường ảo Python (venv):**
   ```bash
   python -m venv venv
   ```
3. **Kích hoạt môi trường ảo:**
   - _Windows (PowerShell):_ `.\venv\Scripts\Activate.ps1`
   - _Windows (CMD):_ `.\venv\Scripts\activate.bat`
   - _macOS / Linux:_ `source venv/bin/activate`
4. **Cài đặt các thư viện cần thiết:**
   ```bash
   pip install -r requirements.txt
   ```
5. **Nạp các file mô hình AI:**
   - Hãy tải các file mô hình thực tế của bạn (ví dụ: `resnet50_faceshape.keras` hoặc các file mô hình khác như `efficientnetv2_faceshape.keras`, `cnn_faceshape.keras`, `svm_faceshape.pkl`) và đặt vào trong thư mục `/backend`.
   - Các mô hình không có file thực tế sẽ tự động chạy ở chế độ **Demo (Mock Mode)** để người dùng thử nghiệm.
6. **Khởi chạy Backend Server:**
   ```bash
   python app.py
   ```
   _Server chạy tại cổng: `http://localhost:8000/`_

---

### 2. Thiết lập Frontend (React + Vite)

Yêu cầu máy đã cài **Node.js (v18+)** và **pnpm** (hoặc **npm**).

1. **Di chuyển về thư mục gốc dự án:**
   ```bash
   cd ..
   ```
2. **Cài đặt các gói thư viện (Dependencies):**
   - _Bằng pnpm (Khuyên dùng):_ `pnpm install`
   - _Bằng npm:_ `npm install`
3. **Cấu hình biến môi trường kết nối API:**
   - Tạo file `.env` ở thư mục gốc và đảm bảo dòng cấu hình sau được bật để kết nối API thật:
     ```env
     VITE_USE_MOCK=false
     ```
4. **Khởi chạy Frontend Dev Server:**
   - _Bằng pnpm:_ `pnpm dev`
   - _Bằng npm:_ `npm run dev`
   - _Giao diện ứng dụng chạy tại cổng: `http://localhost:5173/`_

---

## 🔌 Đặc tả API Endpoints (FastAPI)

### 1. Phân tích khuôn mặt & Gợi ý kính

- **Endpoint:** `POST /predict`
- **Định dạng dữ liệu gửi đi:** `multipart/form-data`
  - Tham số:
    - `file` (File ảnh chụp trực diện khuôn mặt).
    - `model_name` (Tên mô hình AI được chọn: `SVM`, `CNN`, `ResNet50`, `EfficientNetV2`).
- **Mã lỗi phản hồi:**
  - `400 Bad Request`: Khi ảnh tải lên bị lỗi hoặc không tìm thấy khuôn mặt rõ ràng (Face count = 0).
- **Dữ liệu trả về mẫu (JSON 200 OK):**
  ```json
  {
    "face_shape": "Round",
    "confidence": 0.945,
    "best_model": "ResNet50 Custom Model",
    "probabilities": {
      "Heart": 0.012,
      "Oblong": 0.003,
      "Oval": 0.04,
      "Round": 0.945,
      "Square": 0.0
    },
    "recommendations": [
      {
        "id": "rec-4",
        "name": "Sharp Square Frames",
        "frame": "Rectangle",
        "score": 96,
        "description": "Contrasts round features, making the face look longer."
      }
    ]
  }
  ```

### 2. Lấy danh sách mô hình

- **Endpoint:** `GET /models`
- **Dữ liệu trả về:** Danh sách thông tin, độ chính xác, tốc độ suy luận của 4 mô hình AI trong hệ thống.

---

## 🛡️ License

Dự án này được phân phối dưới giấy phép **MIT License**.

## 👥 Nhóm tác giả thực hiện (Nhóm 22)

Dự án được hoàn thành với sự đóng góp tích cực của các thành viên Nhóm 22 - Đại học Nông Lâm TP.HCM (NLU):

- **Thân Văn Danh** (MSSV: `23130043`) — **Nhóm trưởng** & Quản lý dự án / Phát triển Mô hình AI
- **Nguyễn Văn Điền** (MSSV: `23130061`) — **Thành viên** & Phát triển Mô hình AI / Giao diện Frontend

---

_Cảm ơn bạn đã quan tâm đến dự án FaceFit AI!_ 🕶️
