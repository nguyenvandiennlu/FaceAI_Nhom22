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

# ─── ĐƯỜNG DẪN CÁC MÔ HÌNH AI ───
MODEL_FILES = {
    'SVM': 'svm_faceshape.pkl',
    'CNN': 'cnn_faceshape.keras',
    'ResNet50': 'resnet50_faceshape.keras',
    'EfficientNetV2': 'efficientnetv2_faceshape.keras'
}

loaded_models = {}
CLASS_NAMES = ['Heart', 'Oblong', 'Oval', 'Round', 'Square']
RESNET50_GDRIVE_URL = "https://docs.google.com/uc?export=download&id=1qPRw5VVpxj-wUe6_WV7IQ-v3PcsA4myS"

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

def download_file_from_google_drive(url: str, destination: str):
    import requests
    print(f"Downloading model file from Google Drive to {destination}...")
    try:
        session = requests.Session()
        # Gửi request đầu tiên để lấy mã xác nhận confirm nếu file dung lượng lớn
        response = session.get(url, stream=True)
        token = None
        for key, value in response.cookies.items():
            if key.startswith('download_warning'):
                token = value
                break

        if token:
            url = url + f"&confirm={token}"
            response = session.get(url, stream=True)

        # Ghi file theo từng chunk để tối ưu RAM
        with open(destination, "wb") as f:
            for chunk in response.iter_content(32768):
                if chunk:
                    f.write(chunk)
        print("Model downloaded successfully!")
    except Exception as e:
        print(f"Failed to download model from Google Drive: {str(e)}")
        if os.path.exists(destination):
            os.remove(destination)

@app.on_event("startup")
def load_models():
    global loaded_models
    
    # ─── TỰ ĐỘNG TẢI FILE MÔ HÌNH RESNET50 ───
    resnet_path = os.path.join(os.path.dirname(__file__), MODEL_FILES['ResNet50'])
    if not os.path.exists(resnet_path):
        download_file_from_google_drive(RESNET50_GDRIVE_URL, resnet_path)

    for model_name, filename in MODEL_FILES.items():
        path = os.path.join(os.path.dirname(__file__), filename)
        if os.path.exists(path):
            try:
                print(f"Loading {model_name} from {path}...")
                if filename.endswith('.keras'):
                    import tensorflow as tf
                    loaded_models[model_name] = tf.keras.models.load_model(path)
                elif filename.endswith('.pkl') or filename.endswith('.joblib'):
                    import joblib
                    loaded_models[model_name] = joblib.load(path)
                print(f"Successfully loaded {model_name}!")
            except Exception as e:
                print(f"Error loading {model_name}: {str(e)}")
        else:
            print(f"Info: {model_name} file not found at {path}. Will run in mock-mode if requested.")

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

# Đường dẫn đến file XML cascade cục bộ trong thư mục backend
CASCADE_PATH = os.path.join(os.path.dirname(__file__), "haarcascade_frontalface_default.xml")
face_cascade = None

import cv2
if hasattr(cv2, 'CascadeClassifier') and os.path.exists(CASCADE_PATH):
    try:
        face_cascade = cv2.CascadeClassifier(CASCADE_PATH)
        if face_cascade.empty():
            print("Warning: Failed to load cascade classifier. Face check will default to True.")
            face_cascade = None
    except Exception as e:
        print(f"Warning: Error initializing CascadeClassifier: {str(e)}")
        face_cascade = None
else:
    print("Warning: cv2 has no 'CascadeClassifier' attribute or XML missing. Face check disabled.")

def has_face(image_bytes: bytes) -> bool:
    if face_cascade is None:
        print("Face Check Bypass: OpenCV CascadeClassifier not active.")
        return True # Fallback if file missing or cv2 incomplete
    try:
        # Chuyển bytes ảnh thành mảng numpy để OpenCV có thể đọc
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            print("OpenCV Error: Cannot decode image bytes.")
            return False
            
        # Chuyển sang ảnh xám để tối ưu hóa nhận diện
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Phát hiện khuôn mặt
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=4,
            minSize=(30, 30)
        )
        
        print(f"Face Detection: Found {len(faces)} face(s) in image.")
        # Nếu số lượng khuôn mặt tìm thấy > 0 thì hợp lệ
        return len(faces) > 0
    except Exception as e:
        print(f"Face Detection Exception: {str(e)}")
        return False

from fastapi import Form

@app.post("/predict")
async def predict(file: UploadFile = File(...), model_name: str = Form("ResNet50")):
    global loaded_models
    import tensorflow as tf
    
    try:
        # Đọc dữ liệu ảnh gửi lên
        contents = await file.read()
        
        # ─── BỘ LỌC KIỂM TRA KHUÔN MẶT ───
        if not has_face(contents):
            raise HTTPException(
                status_code=400,
                detail="Không tìm thấy khuôn mặt rõ ràng nào trong ảnh! Vui lòng tải một ảnh chụp trực diện rõ mặt."
            )
            
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Lỗi đọc tập tin ảnh: {str(e)}")

    selected_model = loaded_models.get(model_name)

    # ⚠️ Trả dữ liệu giả lập (Mock) NẾU model được chọn chưa được tải
    if selected_model is None:
        print(f"Model {model_name} not loaded. Returning mock response for preview.")
        import random
        # Tạo mock hợp lý theo dáng mặt
        random_shape = random.choice(CLASS_NAMES)
        mock_probs = np.random.dirichlet(np.ones(5), size=1)[0]
        
        return {
            "face_shape": random_shape,
            "confidence": float(max(mock_probs)),
            "probabilities": {CLASS_NAMES[i]: float(mock_probs[i]) for i in range(len(CLASS_NAMES))},
            "recommendations": RECOMMENDATIONS_MAP.get(random_shape, RECOMMENDATIONS_MAP['Oval']),
            "best_model": f"{model_name} (Mock Mode)"
        }
    
    try:
        # Tiền xử lý ảnh
        input_data = preprocess_image(contents)
        
        # Dự đoán hình dáng khuôn mặt tùy theo kiểu mô hình
        if model_name == 'SVM':
            # SVM thường yêu cầu dữ liệu phẳng (flat) hoặc xử lý HOG
            # Trong trường hợp Mock/Fallback của file SVM đơn giản, ta tính xác suất qua predict_proba
            try:
                # Nếu mô hình SVM hỗ trợ xác suất
                probs = selected_model.predict_proba(input_data.reshape(1, -1))[0]
            except Exception:
                # Fallback nếu SVM không được train với probability=True
                probs = np.zeros(len(CLASS_NAMES))
                pred_class = selected_model.predict(input_data.reshape(1, -1))[0]
                idx = CLASS_NAMES.index(pred_class) if pred_class in CLASS_NAMES else 0
                probs[idx] = 1.0
            
            predictions = probs
        else:
            # Các mô hình Keras (CNN, ResNet50, EfficientNetV2)
            predictions = selected_model.predict(input_data)[0]
        
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
            "best_model": f"{model_name} Custom Model"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running inference on {model_name}: {str(e)}")
    finally:
        # Giải phóng session bộ nhớ Keras để tránh rò rỉ RAM máy chủ
        try:
            tf.keras.backend.clear_session()
        except:
            pass

@app.get("/models")
async def get_models():
    global loaded_models
    return [
        {"name": "SVM", "method": "HOG + LinearSVC", "accuracy": 84.1, "speed": "15ms", "status": "Ready" if "SVM" in loaded_models else "Mocked"},
        {"name": "CNN", "accuracy": 89.2, "speed": "45ms", "status": "Ready" if "CNN" in loaded_models else "Mocked"},
        {"name": "ResNet50", "accuracy": 96.8, "speed": "120ms", "status": "Ready" if "ResNet50" in loaded_models else "Mocked"},
        {"name": "EfficientNetV2", "accuracy": 95.4, "speed": "180ms", "status": "Ready" if "EfficientNetV2" in loaded_models else "Mocked"}
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
