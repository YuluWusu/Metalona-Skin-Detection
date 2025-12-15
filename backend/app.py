import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torchvision.transforms as transforms
from PIL import Image
import io
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def load_model():
    """Load model của bạn"""
    try:
        model_path = os.path.join('model', 'skin_cancer_model.pth')

        return None
        
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

model = load_model()

# Transform ảnh
def preprocess_image(image_bytes):
    """Tiền xử lý ảnh trước khi đưa vào model"""
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    return transform(image).unsqueeze(0).to(device)

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        image_bytes = file.read()
        
        # Tiền xử lý
        input_tensor = preprocess_image(image_bytes)
        
        # Dự đoán (tạm thời dùng mock data)
        # Thay thế bằng model thật khi ready
        mock_predictions = {
            'Melanoma': 15.2,
            'Nevus': 70.5,
            'Basal Cell Carcinoma': 10.3,
            'Actinic Keratosis': 4.0
        }
        
        # Tìm class có confidence cao nhất
        max_class = max(mock_predictions, key=mock_predictions.get)
        
        return jsonify({
            'success': True,
            'predictions': mock_predictions,
            'result': {
                'class': max_class,
                'confidence': mock_predictions[max_class],
                'description': get_class_description(max_class)
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_class_description(class_name):
    """Trả về mô tả cho từng class"""
    descriptions = {
        'Melanoma': 'Ung thư tế bào hắc tố - cần khám chuyên khoa ngay',
        'Nevus': 'Nốt ruồi lành tính - theo dõi định kỳ',
        'Basal Cell Carcinoma': 'Ung thư biểu mô tế bào đáy',
        'Actinic Keratosis': 'Dày sừng ánh sáng - tiền ung thư'
    }
    return descriptions.get(class_name, 'Không có mô tả')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)