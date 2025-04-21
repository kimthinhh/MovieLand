// Hàm mở form đăng nhập
function showLoginForm() {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // Nếu đã đăng nhập rồi, hiển thị menu người dùng thay vì form đăng nhập
        showUserMenu(new Event('click'));
        return;
    }
    
    // Kiểm tra xem form đã tồn tại chưa
    let authContainer = document.getElementById('auth-container');
    
    // Nếu chưa có form, tạo mới
    if (!authContainer) {
        createAuthForms();
        authContainer = document.getElementById('auth-container');
    }
    
    // Hiển thị form
    if (authContainer) {
        authContainer.style.display = 'flex';
        authContainer.style.opacity = '1';
        authContainer.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
    } else {
        alert('Không thể mở form đăng nhập!');
    }
}

// Hàm đóng form đăng nhập
function hideLoginForm() {
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
        authContainer.style.opacity = '0';
        authContainer.style.visibility = 'hidden';
        setTimeout(() => {
            authContainer.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
    }
}

// Hàm tạo form đăng nhập và đăng ký
function createAuthForms() {
    // Tạo phần tử div cho form
    const authContainer = document.createElement('div');
    authContainer.id = 'auth-container';
    authContainer.className = 'auth-container';
    authContainer.style.display = 'none';
    
    // Thêm CSS inline cho form
    authContainer.style.position = 'fixed';
    authContainer.style.top = '0';
    authContainer.style.left = '0';
    authContainer.style.width = '100%';
    authContainer.style.height = '100%';
    authContainer.style.backgroundColor = 'rgba(0,0,0,0.7)';
    authContainer.style.zIndex = '9999';
    authContainer.style.display = 'flex';
    authContainer.style.justifyContent = 'center';
    authContainer.style.alignItems = 'center';
    authContainer.style.transition = 'opacity 0.3s, visibility 0.3s';
    
    // Tạo phần tử div cho phần bên trái form
    const leftSideHTML = `
    <div style="flex: 1; position: relative; overflow: hidden;">
        <!-- Ảnh nền chính - sử dụng file local -->
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('images/login.png'); background-size: cover; background-position: center; filter: brightness(50%);"></div>
        
        <!-- Nội dung ở dưới cùng -->
        <div style="position: relative; z-index: 1; padding: 30px; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; color: white; text-align: left;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <img src="images/logo.png" alt="MovieLand" style="width: 60px; height: 60px; margin-right: 15px;">
                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <span style="font-size: 28px; font-family: ClarenceTwo; color: #FFe5ec;">MovieLand</span>
                    <span style="font-size: 15px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); color: #FFe5ec;">Thế giới phim trong tầm tay</span>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Thêm HTML cho form đăng nhập với ảnh bên trái
    authContainer.innerHTML = `
        <div style="display: flex; background-color: white; border-radius: 10px; width: 90%; max-width: 750px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
            <!-- Phần ảnh bên trái -->
            ${leftSideHTML}
            
            <!-- Phần form bên phải -->
            <div style="flex: 1; padding: 30px; position: relative;">
                <span class="close-btn" style="position: absolute; top: 15px; right: 15px; font-size: 20px; cursor: pointer; color: #555;" onclick="hideLoginForm()">&times;</span>
                
                <h2 style="text-align: center; margin-bottom: 25px; color: #ff3e79; font-size: 24px;" id="form-title">Tạo tài khoản mới</h2>
                
                <div class="tabs" style="display: flex; margin-bottom: 20px; border-bottom: 1px solid #eee;">
                    <div class="tab active" style="flex: 1; text-align: center; padding: 10px; cursor: pointer; color: #ff3e79; font-weight: bold; border-bottom: 2px solid #ff3e79;">Đăng nhập</div>
                    <div class="tab" style="flex: 1; text-align: center; padding: 10px; cursor: pointer; color: #999;">Đăng ký</div>
                </div>
                
                <form id="login-form" style="display: block;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-size: 14px;">Email</label>
                        <input type="email" style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;" placeholder="Nhập email của bạn" required>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-size: 14px;">Mật khẩu</label>
                        <input type="password" style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;" placeholder="Nhập mật khẩu" required>
                    </div>
                    
                    <div style="margin-bottom: 15px; text-align: right;">
                        <a href="#" style="font-size: 14px; color: #ff3e79; text-decoration: none;">Quên mật khẩu?</a>
                    </div>
                    
                    <button type="submit" style="width: 100%; padding: 12px; background-color: #ff3e79; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 16px;">Đăng nhập</button>
                    
                    <div style="margin-top: 20px; text-align: center; position: relative;">
                        <hr style="border: none; height: 1px; background-color: #eee;">
                        <span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background-color: white; padding: 0 10px; color: #999; font-size: 14px;">Hoặc đăng nhập bằng</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin-top: 25px;">
                        <button type="button" style="flex: 1; margin-right: 10px; padding: 10px; background-color: #3b5998; color: white; border: none; border-radius: 5px; cursor: pointer; display: flex; justify-content: center; align-items: center;">
                            <i class="fab fa-facebook-f" style="margin-right: 10px;"></i> Facebook
                        </button>
                        <button type="button" style="flex: 1; margin-left: 10px; padding: 10px; background-color: #dd4b39; color: white; border: none; border-radius: 5px; cursor: pointer; display: flex; justify-content: center; align-items: center;">
                            <i class="fab fa-google" style="margin-right: 10px;"></i> Google
                        </button>
                    </div>
                </form>
                
                <form id="register-form" style="display: none;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-size: 14px;">Tên hiển thị</label>
                        <input type="text" style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;" placeholder="Nhập tên hiển thị" required>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-size: 14px;">Email</label>
                        <input type="email" style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;" placeholder="Nhập email của bạn" required>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-size: 14px;">Mật khẩu</label>
                        <input type="password" id="register-password" style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;" placeholder="Nhập mật khẩu" required>
                        <div id="password-strength-container"></div>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-size: 14px;">Nhập lại mật khẩu</label>
                        <input type="password" id="register-confirm-password" style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;" placeholder="Nhập lại mật khẩu" required>
                        <div id="password-error-container"></div>
                    </div>
                    
                    <button type="submit" style="width: 100%; padding: 12px; background-color: #ff3e79; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 16px; margin-top: 10px;">Đăng ký</button>
                </form>
                
                <div style="margin-top: 20px; text-align: center; font-size: 14px;">
                    <p id="switch-text">Nếu bạn đã có tài khoản, <a href="#" id="switch-link" style="color: #ff3e79; text-decoration: none;">đăng nhập</a></p>
                </div>
            </div>
        </div>
    `;
    
    // Thêm form vào body
    document.body.appendChild(authContainer);
    
    // Thêm sự kiện chuyển tab
    const tabs = authContainer.querySelectorAll('.tab');
    const forms = authContainer.querySelectorAll('form');
    const formTitle = authContainer.querySelector('#form-title');
    const switchText = authContainer.querySelector('#switch-text');
    const switchLink = authContainer.querySelector('#switch-link');
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Xóa trạng thái active
            tabs.forEach(t => {
                t.classList.remove('active');
                t.style.color = '#999';
                t.style.borderBottom = 'none';
            });
            
            // Ẩn tất cả form
            forms.forEach(f => f.style.display = 'none');
            
            // Hiển thị form được chọn
            tab.classList.add('active');
            tab.style.color = '#ff3e79';
            tab.style.borderBottom = '2px solid #ff3e79';
            forms[index].style.display = 'block';
            
            // Cập nhật tiêu đề và văn bản chuyển đổi
            if (index === 0) {
                formTitle.textContent = 'Đăng nhập';
                switchText.innerHTML = 'Nếu bạn chưa có tài khoản, <a href="#" id="switch-link" style="color: #ff3e79; text-decoration: none;">đăng ký</a>';
            } else {
                formTitle.textContent = 'Tạo tài khoản mới';
                switchText.innerHTML = 'Nếu bạn đã có tài khoản, <a href="#" id="switch-link" style="color: #ff3e79; text-decoration: none;">đăng nhập</a>';
            }
            
            // Cập nhật sự kiện cho link chuyển đổi
            const newSwitchLink = authContainer.querySelector('#switch-link');
            newSwitchLink.addEventListener('click', (e) => {
                e.preventDefault();
                tabs[index === 0 ? 1 : 0].click();
            });
        });
    });
    
    // Thêm sự kiện cho link chuyển đổi
    switchLink.addEventListener('click', (e) => {
        e.preventDefault();
        tabs[1].click(); // Mặc định chuyển từ đăng nhập sang đăng ký
    });
    
    // Thêm sự kiện đóng form khi click ra ngoài
    authContainer.addEventListener('click', (e) => {
        if (e.target === authContainer) {
            hideLoginForm();
        }
    });
    
    // Thêm sự kiện submit form
    const loginForm = authContainer.querySelector('#login-form');
    const registerForm = authContainer.querySelector('#register-form');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Lấy thông tin đăng nhập
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        
        // Kiểm tra xem có tài khoản đã đăng ký không
        const users = JSON.parse(localStorage.getItem('movielandUsers') || '[]');
        const user = users.find(u => u.email === email);
        
        if (!user) {
            alert('Email không tồn tại. Vui lòng đăng ký!');
            return;
        }
        
        if (user.password !== password) {
            alert('Mật khẩu không chính xác. Vui lòng thử lại!');
            return;
        }
        
        // Lưu thông tin người dùng đã đăng nhập
        localStorage.setItem('currentUser', JSON.stringify({
            email: user.email,
            displayName: user.displayName
        }));
        
        alert('Đăng nhập thành công!');
        hideLoginForm();
        
        // Cập nhật UI khi đăng nhập thành công
        updateUIAfterLogin(user.displayName);
    });
    
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Lấy thông tin đăng ký
        const displayName = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('#register-password').value;
        const confirmPassword = registerForm.querySelector('#register-confirm-password').value;
        
        // Kiểm tra độ mạnh của mật khẩu
        const passwordStrength = checkPasswordStrengthValue(password);
        if (passwordStrength < 3) {
            // Mật khẩu quá yếu
            const strengthContainer = registerForm.querySelector('#password-strength-container');
            strengthContainer.innerHTML = `
                <p style="color: #ff0000; font-size: 12px; margin-top: 5px; margin-bottom: 0;">
                    Mật khẩu quá yếu! Vui lòng tạo mật khẩu mạnh hơn.
                </p>
            `;
            
            // Tập trung vào ô mật khẩu
            passwordInput.focus();
            return;
        }
        
        // Kiểm tra mật khẩu có khớp không
        if (password !== confirmPassword) {
            // Hiển thị thông báo lỗi
            const errorContainer = registerForm.querySelector('#password-error-container');
            errorContainer.innerHTML = `
                <p style="color: #ff0000; font-size: 12px; margin-top: 5px; margin-bottom: 0;">
                    Mật khẩu không khớp. Vui lòng kiểm tra lại!
                </p>
            `;
            
            // Thêm viền đỏ cho input
            const confirmPasswordInput = registerForm.querySelector('#register-confirm-password');
            confirmPasswordInput.style.border = '1px solid #ff0000';
            
            // Tập trung vào ô nhập lại mật khẩu
            confirmPasswordInput.focus();
            return;
        }
        
        // Kiểm tra email đã tồn tại chưa
        const users = JSON.parse(localStorage.getItem('movielandUsers') || '[]');
        if (users.some(user => user.email === email)) {
            alert('Email này đã được đăng ký. Vui lòng sử dụng email khác!');
            return;
        }
        
        // Lưu thông tin người dùng vào localStorage
        users.push({
            displayName,
            email,
            password,
            registeredDate: new Date().toISOString()
        });
        
        localStorage.setItem('movielandUsers', JSON.stringify(users));
        
        // Lưu thông tin người dùng đã đăng nhập
        localStorage.setItem('currentUser', JSON.stringify({
            email,
            displayName
        }));
        
        alert('Đăng ký thành công!');
        hideLoginForm();
        
        // Cập nhật UI khi đăng ký thành công
        updateUIAfterLogin(displayName);
    });
    
    // Thêm kiểm tra mật khẩu khi nhập
    const passwordInput = registerForm.querySelector('#register-password');
    const confirmPasswordInput = registerForm.querySelector('#register-confirm-password');
    
    // Thêm container hiển thị độ mạnh mật khẩu
    const strengthContainer = registerForm.querySelector('#password-strength-container');
    
    // Kiểm tra khi người dùng nhập vào ô nhập lại mật khẩu
    confirmPasswordInput.addEventListener('input', function() {
        validatePasswordMatch();
    });
    
    // Kiểm tra khi người dùng nhập vào ô mật khẩu
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength();
        if (confirmPasswordInput.value) {
            validatePasswordMatch();
        }
    });
    
    // Hàm đánh giá độ mạnh của mật khẩu, trả về giá trị từ 0-5
    function checkPasswordStrengthValue(password) {
        let strength = 0;
        
        // Kiểm tra độ dài
        if (password.length >= 8) {
            strength += 1;
        }
        
        // Kiểm tra có chữ hoa không
        if (/[A-Z]/.test(password)) {
            strength += 1;
        }
        
        // Kiểm tra có chữ thường không
        if (/[a-z]/.test(password)) {
            strength += 1;
        }
        
        // Kiểm tra có số không
        if (/[0-9]/.test(password)) {
            strength += 1;
        }
        
        // Kiểm tra có ký tự đặc biệt không
        if (/[^A-Za-z0-9]/.test(password)) {
            strength += 1;
        }
        
        return strength;
    }
    
    // Hàm kiểm tra độ mạnh của mật khẩu
    function checkPasswordStrength() {
        const password = passwordInput.value;
        const strength = checkPasswordStrengthValue(password);
        let feedback = '';
        
        // Xóa nội dung cũ trong container
        strengthContainer.innerHTML = '';
        
        // Nếu mật khẩu trống, không hiển thị gì
        if (password.length === 0) {
            return;
        }
        
        // Tạo feedback
        if (password.length < 8) {
            feedback += 'Mật khẩu nên có ít nhất 8 ký tự. ';
        }
        
        if (!/[A-Z]/.test(password)) {
            feedback += 'Nên có ít nhất 1 chữ hoa. ';
        }
        
        if (!/[a-z]/.test(password)) {
            feedback += 'Nên có ít nhất 1 chữ thường. ';
        }
        
        if (!/[0-9]/.test(password)) {
            feedback += 'Nên có ít nhất 1 chữ số. ';
        }
        
        if (!/[^A-Za-z0-9]/.test(password)) {
            feedback += 'Nên có ít nhất 1 ký tự đặc biệt. ';
        }
        
        // Hiển thị độ mạnh của mật khẩu
        let color = '';
        let message = '';
        
        if (strength < 2) {
            color = '#ff0000'; // Đỏ - Yếu
            message = 'Yếu';
        } else if (strength < 4) {
            color = '#ff9900'; // Cam - Trung bình
            message = 'Trung bình';
        } else {
            color = '#28a745'; // Xanh - Mạnh
            message = 'Mạnh';
        }
        
        // Tạo HTML hiển thị
        strengthContainer.innerHTML = `
            <div style="margin-top: 5px;">
                <div style="display: flex; height: 5px; margin-bottom: 5px;">
                    <div style="flex: 1; background-color: ${strength >= 1 ? color : '#ddd'}; margin-right: 2px;"></div>
                    <div style="flex: 1; background-color: ${strength >= 2 ? color : '#ddd'}; margin-right: 2px;"></div>
                    <div style="flex: 1; background-color: ${strength >= 3 ? color : '#ddd'}; margin-right: 2px;"></div>
                    <div style="flex: 1; background-color: ${strength >= 4 ? color : '#ddd'}; margin-right: 2px;"></div>
                    <div style="flex: 1; background-color: ${strength >= 5 ? color : '#ddd'};"></div>
                </div>
                <p style="color: ${color}; font-size: 12px; margin: 0;">
                    <span style="font-weight: bold;">${message}</span> ${feedback ? '- ' + feedback : ''}
                </p>
            </div>
        `;
    }
    
    // Hàm kiểm tra và hiển thị thông báo lỗi
    function validatePasswordMatch() {
        // Lấy container thông báo lỗi
        const errorContainer = registerForm.querySelector('#password-error-container');
        
        // Xóa nội dung cũ trong container
        errorContainer.innerHTML = '';
        
        // Lấy giá trị mật khẩu
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Nếu ô nhập lại mật khẩu có giá trị
        if (confirmPassword) {
            if (password !== confirmPassword) {
                // Tạo thông báo lỗi
                errorContainer.innerHTML = `
                    <p style="color: #ff0000; font-size: 12px; margin-top: 5px; margin-bottom: 0;">
                        Mật khẩu không khớp. Vui lòng kiểm tra lại!
                    </p>
                `;
                
                // Thêm viền đỏ cho input
                confirmPasswordInput.style.border = '1px solid #ff0000';
            } else {
                // Mật khẩu khớp, thêm viền xanh
                confirmPasswordInput.style.border = '1px solid #28a745';
                // Hiển thị thông báo thành công
                errorContainer.innerHTML = `
                    <p style="color: #28a745; font-size: 12px; margin-top: 5px; margin-bottom: 0;">
                        Mật khẩu khớp!
                    </p>
                `;
            }
        } else {
            // Reset về mặc định nếu ô trống
            confirmPasswordInput.style.border = '1px solid #ddd';
        }
    }
    
    // Đặt tab đăng nhập là active mặc định
    tabs[0].click();
}

// Hàm cập nhật UI sau khi đăng nhập/đăng ký
function updateUIAfterLogin(displayName) {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        // Thay đổi nút đăng nhập thành thông tin người dùng
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${displayName}`;
        
        // Thay đổi sự kiện click để hiển thị menu người dùng
        loginBtn.removeEventListener('click', showLoginForm);
        loginBtn.addEventListener('click', showUserMenu);
    }
}

// Hàm hiển thị menu người dùng
function showUserMenu(e) {
    e.preventDefault();
    
    // Xóa menu cũ nếu tồn tại
    let userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.remove();
    }
    
    // Lấy thông tin người dùng hiện tại
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Lấy số lượng phim yêu thích và lịch sử xem
    const favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.email}`) || '[]');
    const history = JSON.parse(localStorage.getItem(`history_${currentUser.email}`) || '[]');
    
    // Tạo menu người dùng
    userMenu = document.createElement('div');
    userMenu.id = 'user-menu';
    userMenu.style.position = 'absolute';
    userMenu.style.top = '60px';
    userMenu.style.right = '20px';
    userMenu.style.backgroundColor = 'white';
    userMenu.style.border = '1px solid #ddd';
    userMenu.style.borderRadius = '5px';
    userMenu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    userMenu.style.zIndex = '1000';
    userMenu.style.minWidth = '200px';
    userMenu.style.display = 'block';
    
    // Thêm các mục menu
    userMenu.innerHTML = `
        <div style="padding: 15px; border-bottom: 1px solid #eee;">
            <div style="font-weight: bold; color: #333; margin-bottom: 5px;">
                ${currentUser.displayName}
            </div>
            <div style="font-size: 12px; color: #777;">
                ${currentUser.email}
            </div>
        </div>
        <div style="padding: 10px;">
            <a href="#" id="profile-link" style="display: block; padding: 8px 10px; color: #333; text-decoration: none; border-radius: 3px;">
                <i class="fas fa-user-circle" style="margin-right: 10px;"></i> Hồ sơ cá nhân
            </a>
            <a href="#" id="favorites-link" style="display: flex; justify-content: space-between; padding: 8px 10px; color: #333; text-decoration: none; border-radius: 3px;">
                <span><i class="fas fa-heart" style="margin-right: 10px; color: #e17c97;"></i> Phim yêu thích</span>
                <span class="badge" style="background-color: #e17c97; color: white; border-radius: 10px; padding: 2px 6px; font-size: 11px;">${favorites.length}</span>
            </a>
            <a href="#" id="history-link" style="display: flex; justify-content: space-between; padding: 8px 10px; color: #333; text-decoration: none; border-radius: 3px;">
                <span><i class="fas fa-history" style="margin-right: 10px;"></i> Lịch sử xem</span>
                <span class="badge" style="background-color: #888; color: white; border-radius: 10px; padding: 2px 6px; font-size: 11px;">${history.length}</span>
            </a>
            <a href="#" id="logout-link" style="display: block; padding: 8px 10px; color: #ff3e79; text-decoration: none; border-radius: 3px;">
                <i class="fas fa-sign-out-alt" style="margin-right: 10px;"></i> Đăng xuất
            </a>
        </div>
    `;
    
    // Thêm menu vào header
    document.querySelector('.user-actions').appendChild(userMenu);
    
    // Thêm sự kiện hover cho các mục menu
    const menuItems = userMenu.querySelectorAll('a');
    menuItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            item.style.backgroundColor = '#f5f5f5';
        });
        
        item.addEventListener('mouseout', () => {
            item.style.backgroundColor = 'transparent';
        });
    });
    
    // Thêm sự kiện cho phim yêu thích và lịch sử xem
    const favoritesLink = document.getElementById('favorites-link');
    if (favoritesLink) {
        favoritesLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof showFavoritesPage === 'function') {
                showFavoritesPage();
            } else {
                alert('Tính năng này đang được phát triển');
            }
            userMenu.style.display = 'none';
        });
    }
    
    const historyLink = document.getElementById('history-link');
    if (historyLink) {
        historyLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof showHistoryPage === 'function') {
                showHistoryPage();
            } else {
                alert('Tính năng này đang được phát triển');
            }
            userMenu.style.display = 'none';
        });
    }
    
    // Thêm sự kiện đăng xuất
    const logoutLink = document.getElementById('logout-link');
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Xóa thông tin người dùng đang đăng nhập
        localStorage.removeItem('currentUser');
        
        // Xóa container danh sách phim nếu đang hiển thị
        const movieListContainer = document.getElementById('user-movie-list-container');
        if (movieListContainer) {
            movieListContainer.remove();
        }
        
        // Cập nhật lại UI
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-user"></i> Đăng nhập';
            
            // Khôi phục sự kiện click ban đầu
            loginBtn.removeEventListener('click', showUserMenu);
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showLoginForm();
            });
        }
        
        // Đóng menu người dùng
        userMenu.remove();
        
        alert('Đã đăng xuất thành công!');
    });
    
    // Đóng menu khi click ra ngoài
    document.addEventListener('click', function closeUserMenu(e) {
        if (!userMenu.contains(e.target) && e.target !== document.getElementById('login-btn')) {
            userMenu.style.display = 'none';
            // Gỡ bỏ sự kiện này sau khi menu đóng để tránh tích luỹ các event listeners
            document.removeEventListener('click', closeUserMenu);
        }
    });
}

// Khởi tạo khi trang tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra xem đã đăng nhập chưa
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        // Nếu đã đăng nhập, cập nhật UI
        updateUIAfterLogin(currentUser.displayName);
    } else {
        // Thêm sự kiện click cho nút đăng nhập
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showLoginForm();
            });
        }
    }
}); 