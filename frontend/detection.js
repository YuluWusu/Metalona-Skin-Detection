        // DOM Elements
        const inputArea = document.getElementById('inputArea');
        const inputContent = document.getElementById('inputContent');
        const inputImage = document.getElementById('inputImage');
        const inputControls = document.getElementById('inputControls');
        const outputArea = document.getElementById('outputArea');
        const outputPlaceholder = document.getElementById('outputPlaceholder');
        const outputImage = document.getElementById('outputImage');
        const outputControls = document.getElementById('outputControls');
        const diagnoseBtn = document.getElementById('diagnoseBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const resultContent = document.getElementById('result-content');
        const loading = document.getElementById('loading');
        const fileInfo = document.getElementById('fileInfo');
        
        let uploadedImage = null;
        let uploadedFileName = '';
        let isDiagnosing = false;
        
        // Kéo thả và xoá ảnh
        inputArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            inputArea.classList.add('dragover');
        });
        
        inputArea.addEventListener('dragleave', () => {
            inputArea.classList.remove('dragover');
        });
        
        inputArea.addEventListener('drop', (e) => {
            e.preventDefault();
            inputArea.classList.remove('dragover');
            
            const file = e.dataTransfer.files[0];
            if (file) {
                handleImageUpload(file);
            }
        });
        
        // Bấm để đăng ảnh
        inputArea.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                if (e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                }
            };
            input.click();
        });
        
        // Xử lý ảnh được đăng lên
        function handleImageUpload(file) {
            // Kiểm tra file có phải ảnh hay không
            if (!file.type.match('image.*')) {
                alert('Vui lòng chọn file ảnh (JPEG, PNG, etc.)!');
                return;
            }
            
            // Kiểm tra dung lượng của file
            if (file.size > 5 * 1024 * 1024) {
                alert('File ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB.');
                return;
            }
            
            uploadedFileName = file.name;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImage = e.target.result;
                
                // Hiển thị ảnh toàn bộ vùng input
                inputImage.src = uploadedImage;
                inputImage.classList.add('active');
                inputArea.classList.add('has-image');
                inputContent.style.display = 'none';
                inputControls.style.display = 'block';
                
                // Reset output area
                outputImage.src = '';
                outputImage.classList.remove('active');
                outputPlaceholder.style.display = 'block';
                outputControls.style.display = 'none';
                
                // Cập nhật thông tin đăng tải
                fileInfo.innerHTML = `
                    <p><i class="fa-solid fa-check" style="color: #27ae60;"></i> Đã tải lên: <strong>${uploadedFileName}</strong></p>
                    <p>Kích thước: ${(file.size / 1024).toFixed(1)} KB</p>
                `;
                
                // Kích hoạt nút
                diagnoseBtn.disabled = false;
                cancelBtn.disabled = false;
                
                // Reset result
                resultContent.innerHTML = '<p style="color: #888;">Kết quả sẽ hiển thị tại đây sau khi chẩn đoán</p>';
            };
            reader.readAsDataURL(file);
        }
        
        // Hiện tượng khi ấn nút chẩn đoán
        diagnoseBtn.addEventListener('click', async () => {
            if (!uploadedImage || isDiagnosing) return;
            
            isDiagnosing = true;
            diagnoseBtn.disabled = true;
            
            // Show loading
            loading.style.display = 'flex';
            
            // Di chuyển ảnh từ input sang output sau 500ms
            setTimeout(() => {
                // Ẩn ảnh ở input
                inputImage.classList.remove('active');
                inputControls.style.display = 'none';
                
                // Hiển thị ảnh ở output
                outputImage.src = uploadedImage;
                outputImage.classList.add('active');
                outputPlaceholder.style.display = 'none';
                outputControls.style.display = 'block';
                
                // Ẩn loading
                loading.style.display = 'none';
                
                // Kích hoạt chẩn đoán giả lập
                setTimeout(() => {
                    simulateDiagnosis();
                    isDiagnosing = false;
                }, 1000);
                
            }, 500);
        });
        
        // Simulate diagnosis result
        function simulateDiagnosis() {
            // Generate random result
            const isPositive = Math.random() > 0.7;
            const confidence = (Math.random() * 20 + 80).toFixed(1);
            
            let resultHTML = '';
            
            if (isPositive) {
                resultHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <p class="result-positive" style="font-size: 28px; margin-bottom: 10px;">
                            <i class="fa-solid fa-triangle-exclamation"></i> CẢNH BÁO: DẤU HIỆU BẤT THƯỜNG
                        </p>
                        <p style="font-size: 20px; color: #666;">Độ tin cậy: ${confidence}%</p>
                        <div class="result-detail">
                            <p><strong>Khuyến nghị:</strong></p>
                            <ul style="text-align: left; padding-left: 20px;">
                                <li>Vết tổn thương có dấu hiệu cần được kiểm tra thêm</li>
                                <li>Nên đến gặp bác sĩ da liễu trong thời gian sớm nhất</li>
                                <li>Tránh tiếp xúc trực tiếp với ánh nắng mặt trời</li>
                                <li>Theo dõi sự thay đổi của vết tổn thương</li>
                            </ul>
                        </div>
                    </div>
                `;
            } else {
                resultHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <p class="result-negative" style="font-size: 28px; margin-bottom: 10px;">
                            <i class="fa-solid fa-circle-check"></i> KHÔNG PHÁT HIỆN DẤU HIỆU UNG THƯ
                        </p>
                        <p style="font-size: 20px; color: #666;">Độ tin cậy: ${confidence}%</p>
                        <div class="result-detail">
                            <p><strong>Thông tin thêm:</strong></p>
                            <ul style="text-align: left; padding-left: 20px;">
                                <li>Vết tổn thương có vẻ lành tính</li>
                                <li>Vẫn nên kiểm tra da định kỳ</li>
                                <li>Sử dụng kem chống nắng khi ra ngoài</li>
                                <li>Nếu có thay đổi bất thường, hãy đi khám ngay</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
            
            resultContent.innerHTML = resultHTML;
            
            // Scroll to result
            document.querySelector('.minicontainer3').scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }
        
        // Cancel button click
        cancelBtn.addEventListener('click', () => {
            // Reset everything
            uploadedImage = null;
            uploadedFileName = '';
            isDiagnosing = false;
            
            // Reset input area
            inputImage.src = '';
            inputImage.classList.remove('active');
            inputArea.classList.remove('has-image');
            inputContent.style.display = 'flex';
            inputControls.style.display = 'none';
            
            // Reset output area
            outputImage.src = '';
            outputImage.classList.remove('active');
            outputPlaceholder.style.display = 'block';
            outputControls.style.display = 'none';
            
            // Reset file info
            fileInfo.innerHTML = '';
            
            // Reset result
            resultContent.innerHTML = '<p style="color: #888;">Kết quả sẽ hiển thị tại đây sau khi chẩn đoán</p>';
            
            // Hide loading if active
            loading.style.display = 'none';
            
            // Disable buttons
            diagnoseBtn.disabled = true;
            cancelBtn.disabled = true;
            
            // Remove dragover class
            inputArea.classList.remove('dragover');
        });
        
        // Sample images for demonstration (optional)
        function loadSampleImage(sampleNum) {
            const sampleImages = [
                'https://images.unsplash.com/photo-1556103255-4443dbae8e5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1549366028-458821f0e7d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            ];
            
            uploadedImage = sampleImages[sampleNum];
            uploadedFileName = `Mẫu ảnh ${sampleNum + 1}`;
            
            // Hiển thị ảnh trong input
            inputImage.src = uploadedImage;
            inputImage.classList.add('active');
            inputArea.classList.add('has-image');
            inputContent.style.display = 'none';
            inputControls.style.display = 'block';
            
            // Reset output
            outputImage.src = '';
            outputImage.classList.remove('active');
            outputPlaceholder.style.display = 'block';
            outputControls.style.display = 'none';
            
            fileInfo.innerHTML = `
                <p><i class="fa-solid fa-image" style="color: #4dabf7;"></i> Đang sử dụng: <strong>${uploadedFileName}</strong></p>
            `;
            
            resultContent.innerHTML = '<p style="color: #888;">Kết quả sẽ hiển thị tại đây sau khi chẩn đoán</p>';
            
            // Enable buttons
            diagnoseBtn.disabled = false;
            cancelBtn.disabled = false;
        }
        
        // Optional: Add sample buttons for testing
        document.addEventListener('DOMContentLoaded', function() {
            const sampleDiv = document.createElement('div');
            sampleDiv.style.textAlign = 'center';
            sampleDiv.style.margin = '20px 0';
            sampleDiv.innerHTML = `
                <p style="color: #666; margin-bottom: 10px;">Dùng thử với ảnh mẫu:</p>
                <button id="sample1" style="background: #4dabf7; color: white; border: none; padding: 10px 20px; border-radius: 8px; margin: 0 10px; cursor: pointer; transition: background 0.3s;">
                    <i class="fa-solid fa-image"></i> Mẫu 1
                </button>
                <button id="sample2" style="background: #4dabf7; color: white; border: none; padding: 10px 20px; border-radius: 8px; margin: 0 10px; cursor: pointer; transition: background 0.3s;">
                    <i class="fa-solid fa-image"></i> Mẫu 2
                </button>
            `;
            
            // Style for sample buttons hover
            const style = document.createElement('style');
            style.textContent = `
                #sample1:hover, #sample2:hover {
                    background: #339af0;
                }
            `;
            document.head.appendChild(style);
            
            document.querySelector('.minicontainer2').parentNode.insertBefore(sampleDiv, document.querySelector('.minicontainer2'));
            
            document.getElementById('sample1').addEventListener('click', () => loadSampleImage(0));
            document.getElementById('sample2').addEventListener('click', () => loadSampleImage(1));
        });