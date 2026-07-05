import io
import os
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

app = FastAPI(
    title="FaceFit AI Backend",
    description="API for face shape classification and eyewear recommendation using ResNet50",
    version="1.0.0"
)

# Cho phép React Frontend kết nối tới (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Bạn có thể đổi thành ["http://localhost:5173"] ở môi trường thực tế
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── ĐƯỜNG DẪN MODEL ───
# Đặt file resnet50_faceshape.keras của bạn vào cùng thư mục backend/
MODEL_FILENAME = "resnet50_faceshape.keras"
MODEL_PATH = os.path.join(os.path.dirname(__file__), MODEL_FILENAME)

model = None
CLASS_NAMES = ['Heart', 'Oblong', 'Oval', 'Round', 'Square']

RECOMMENDATIONS_MAP = {
    'Oval': [
        {'id': 'rec-1', 'name': 'Classic Rectangular', 'frame': 'Rectangle', 'score': 98, 'description': 'Complements the balanced proportions of oval faces.'},
        {'id': 'rec-2', 'name': 'Retro Wayfarer', 'frame': 'Wayfarer', 'score': 92, 'description': 'Adds structure and dynamic angles.'},
        {'id': 'rec-3', 'name': 'Geometric Hexagon', 'frame': 'Aviator', 'score': 87, 'description': 'Underlines symmetry with modern lines.'}
    ],
    'Round': [
        {'id': 'rec-4', 'name': 'Sharp Square Frames', 'frame': 'Rectangle', 'score': 96, 'description': 'Contrasts round features, making the face look longer.'},
        {'id': 'rec-5', 'name': 'Angular Cat-Eye', 'frame': 'Cat-eye', 'score': 90, 'description': 'Upswept corners lift facial features.'},
        {'id': 'rec-6', 'name': 'Modern Aviator', 'frame': 'Aviator', 'score': 83, 'description': 'Chiseled double-bridge details add definition.'}
    ],
    'Square': [
        {'id': 'rec-7', 'name': 'Classic Round Metal', 'frame': 'Round', 'score': 95, 'description': 'Softens prominent jawlines and sharp angles.'},
        {'id': 'rec-8', 'name': 'Flowing Oval Acetate', 'frame': 'Wayfarer', 'score': 91, 'description': 'Balances wide cheekbones and strong chin.'},
        {'id': 'rec-9', 'name': 'Sleek Aviator Classic', 'frame': 'Aviator', 'score': 88, 'description': 'Teardrop shape draws attention downwards.'}
    ],
    'Heart': [
        {'id': 'rec-10', 'name': 'Bottom-Heavy Clubmaster', 'frame': 'Browline', 'score': 94, 'description': 'Draws focus downward, balancing a wider forehead.'},
        {'id': 'rec-11', 'name': 'Thin Oval Wire', 'frame': 'Round', 'score': 89, 'description': 'Adds soft curves without widening upper face.'},
        {'id': 'rec-12', 'name': 'Unisex Wayfarer Style', 'frame': 'Wayfarer', 'score': 85, 'description': 'Adds visual width to match narrower chin.'}
    ],
    'Oblong': [
        {'id': 'rec-13', 'name': 'Oversized Square', 'frame': 'Rectangle', 'score': 97, 'description': 'Adds width to break up the vertical length of the face.'},
        {'id': 'rec-14', 'name': 'Thick-rimmed Round', 'frame': 'Round', 'score': 93, 'description': 'Tall lenses offset long vertical dimensions.'},
        {'id': 'rec-15', 'name': 'Wide Rectangular Wayfarer', 'frame': 'Wayfarer', 'score': 86, 'description': 'Horizontal structure adds width symmetry.'}
    ]
}

@app.on_event("startup")
def load_model():
    global model
    try:
        if os.path.exists(MODEL_PATH):
            print(f"Loading model from {MODEL_PATH}...")
            import tensorflow as tf
            model = tf.keras.models.load_model(MODEL_PATH)
            print("Model loaded successfully!")
        else:
            print(f"Warning: Model file NOT found at {MODEL_PATH}.")
            print("Please place your 286MB 'resnet50_faceshape.keras' inside the backend/ folder.")
    except Exception as e:
        print(f"Error loading model: {str(e)}")

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    try:
        import tensorflow as tf
        # Mở ảnh bằng Pillow và chuyển đổi sang RGB
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Center Crop: Cắt ảnh thành hình vuông ở trung tâm để giữ nguyên tỷ lệ khuôn mặt
        width, height = img.size
        min_dim = min(width, height)
        left = (width - min_dim) / 2
        top = (height - min_dim) / 2
        right = (width + min_dim) / 2
        bottom = (height + min_dim) / 2
        img = img.crop((left, top, right, bottom))
        
        # Resize về kích thước đầu vào của mô hình ResNet50
        img = img.resize((224, 224))
        
        img_array = np.array(img, dtype=np.float32)
        
        # Tiền xử lý chuẩn của ResNet50 (trừ kênh màu trung bình)
        img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
        
        # Thêm chiều batch (1, 224, 224, 3)
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    global model
    
    # ⚠️ Trả dữ liệu giả lập (Mock) NẾU model thực tế chưa được tải
    if model is None:
        print("Model not loaded. Returning mock response for preview.")
        # Trả mock giống hệt cấu trúc để frontend không bị crash
        import random
        random_shape = random.choice(CLASS_NAMES)
        mock_probs = np.random.dirichlet(np.ones(5), size=1)[0]
        
        return {
            "face_shape": random_shape,
            "confidence": float(max(mock_probs)),
            "probabilities": {CLASS_NAMES[i]: float(mock_probs[i]) for i in range(len(CLASS_NAMES))},
            "recommendations": RECOMMENDATIONS_MAP.get(random_shape, RECOMMENDATIONS_MAP['Oval']),
            "best_model": "ResNet50 (Mock Mode)"
        }
    
    try:
        # Đọc dữ liệu ảnh gửi lên
        contents = await file.read()
        
        # Tiền xử lý ảnh
        input_data = preprocess_image(contents)
        
        # Dự đoán hình dáng khuôn mặt
        predictions = model.predict(input_data)[0]
        
        # Tìm nhãn chiếm tỉ lệ phần trăm cao nhất
        max_idx = np.argmax(predictions)
        predicted_shape = CLASS_NAMES[max_idx]
        confidence = float(predictions[max_idx])
        
        # Tạo map phân bố xác suất cho tất cả các dáng mặt
        probabilities = {CLASS_NAMES[i]: float(predictions[i]) for i in range(len(CLASS_NAMES))}
        
        # Lấy gợi ý loại kính tương ứng với hình dáng khuôn mặt đã phát hiện
        recommendations = RECOMMENDATIONS_MAP.get(predicted_shape, RECOMMENDATIONS_MAP['Oval'])
        
        return {
            "face_shape": predicted_shape,
            "confidence": confidence,
            "probabilities": probabilities,
            "recommendations": recommendations,
            "best_model": "ResNet50 Custom Model"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running inference: {str(e)}")

@app.get("/models")
async def get_models():
    # Cung cấp danh sách models của bạn để đồng bộ hiển thị lên Frontend
    return [
        {"name": "ResNet50", "accuracy": 96.8, "inference_time": "120ms", "parameters": "25.6M", "status": "Active" if model is not None else "Mocked"},
        {"name": "EfficientNetV2", "accuracy": 95.4, "inference_time": "180ms", "parameters": "24.4M", "status": "Available"},
        {"name": "CNN Custom", "accuracy": 89.2, "inference_time": "45ms", "parameters": "4.8M", "status": "Available"},
        {"name": "SVM + HOG", "accuracy": 84.1, "inference_time": "15ms", "parameters": "1.2K", "status": "Available"}
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
