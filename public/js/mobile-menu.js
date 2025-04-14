// Mobile Menu - Xử lý menu di động cho tất cả các trang
document.addEventListener('DOMContentLoaded', function() {
    // Tìm các phần tử DOM cần thiết
    const header = document.querySelector('header');
    const headerContainer = document.querySelector('.header-container');
    
    // Xác định trang hiện tại để đánh dấu menu active
    const currentPage = window.location.pathname.split('/').pop();
    
    // Nếu không có mobile menu icon, thêm vào
    if (!document.querySelector('.mobile-menu-icon')) {
        const mobileMenuIcon = document.createElement('div');
        mobileMenuIcon.className = 'mobile-menu-icon';
        mobileMenuIcon.innerHTML = '<i class="fas fa-bars"></i>';
        headerContainer.appendChild(mobileMenuIcon);
    }
    
    // Nếu không có mobile menu, tạo mobile menu mới
    if (!document.querySelector('.mobile-menu')) {
        // Xác định các class active cho các menu item
        const homeActive = currentPage === 'index.html' || currentPage === '' ? 'active-mobile-link' : '';
        const seriesActive = currentPage === 'phim-bo.html' ? 'active-mobile-link' : '';
        const movieActive = currentPage === 'phim-le.html' ? 'active-mobile-link' : '';
        const categoryActive = currentPage === 'the-loai.html' ? 'active-mobile-link' : '';
        const countryActive = currentPage === 'quoc-gia.html' ? 'active-mobile-link' : '';
        
        // Tạo menu mobile và thêm vào body
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <a href="index.html" class="${homeActive}">Trang chủ</a>
            <a href="phim-bo.html" class="${seriesActive}">Phim Bộ</a>
            <a href="phim-le.html" class="${movieActive}">Phim Lẻ</a>
            <div class="mobile-dropdown ${categoryActive}">
                Thể Loại <i class="fas fa-caret-down"></i>
            </div>
            <div class="mobile-submenu" id="genre-submenu" style="display: ${categoryActive ? 'block' : 'none'}">
                <a href="the-loai.html?slug=hanh-dong&name=Hành%20Động">Hành Động</a>
                <a href="the-loai.html?slug=tinh-cam&name=Tình%20Cảm">Tình Cảm</a>
                <a href="the-loai.html?slug=hai-huoc&name=Hài%20Hước">Hài Hước</a>
                <a href="the-loai.html?slug=kinh-di&name=Kinh%20Dị">Kinh Dị</a>
                <a href="the-loai.html?slug=vien-tuong&name=Viễn%20Tưởng">Viễn Tưởng</a>
                <a href="the-loai.html?slug=co-trang&name=Cổ%20Trang">Cổ Trang</a>
                <a href="the-loai.html?slug=than-thoai&name=Thần%20Thoại">Thần Thoại</a>
            </div>
            <div class="mobile-dropdown ${countryActive}">
                Quốc Gia <i class="fas fa-caret-down"></i>
            </div>
            <div class="mobile-submenu" id="country-submenu" style="display: ${countryActive ? 'block' : 'none'}">
                <a href="quoc-gia.html?slug=viet-nam&name=Việt%20Nam">Việt Nam</a>
                <a href="quoc-gia.html?slug=han-quoc&name=Hàn%20Quốc">Hàn Quốc</a>
                <a href="quoc-gia.html?slug=trung-quoc&name=Trung%20Quốc">Trung Quốc</a>
                <a href="quoc-gia.html?slug=my&name=Mỹ">Mỹ</a>
                <a href="quoc-gia.html?slug=nhat-ban&name=Nhật%20Bản">Nhật Bản</a>
                <a href="quoc-gia.html?slug=thai-lan&name=Thái%20Lan">Thái Lan</a>
            </div>
            <a href="#" onclick="showLoginForm(); return false;"><i class="fas fa-user"></i> Đăng nhập</a>
            <a href="#" id="show-mobile-help"><i class="fas fa-question-circle"></i> Trợ giúp</a>
        `;
        document.body.insertBefore(mobileMenu, document.querySelector('main'));
        
        // Thêm style cho menu active
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .active-mobile-link {
                background-color: rgba(255, 255, 255, 0.15);
                font-weight: bold;
            }
            
            .mobile-help-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 9999;
                display: none;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            .mobile-help-content {
                background-color: white;
                width: 85%;
                max-width: 400px;
                max-height: 80vh;
                border-radius: 12px;
                padding: 20px;
                overflow-y: auto;
                position: relative;
                transform: translateY(20px);
                transition: transform 0.3s;
            }
            
            .mobile-help-content h3 {
                color: #e17c97;
                margin-bottom: 15px;
                font-size: 20px;
                text-align: center;
            }
            
            .mobile-help-content p {
                margin-bottom: 15px;
                line-height: 1.5;
            }
            
            .mobile-help-close {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: #f1f1f1;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #666;
            }
            
            .mobile-help-tip {
                background-color: #f9edf2;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 15px;
                border-left: 4px solid #e17c97;
            }
            
            .mobile-help-tip h4 {
                color: #e17c97;
                margin-bottom: 5px;
            }
        `;
        document.head.appendChild(styleElement);
        
        // Tạo overlay trợ giúp
        const helpOverlay = document.createElement('div');
        helpOverlay.className = 'mobile-help-overlay';
        helpOverlay.innerHTML = `
            <div class="mobile-help-content">
                <div class="mobile-help-close"><i class="fas fa-times"></i></div>
                <h3>Hướng Dẫn Sử Dụng MovieLand</h3>
                
                <div class="mobile-help-tip">
                    <h4>Menu di động</h4>
                    <p>Nhấn vào biểu tượng <i class="fas fa-bars"></i> ở góc phải để mở menu điều hướng</p>
                </div>
                
                <div class="mobile-help-tip">
                    <h4>Xem chi tiết phim</h4>
                    <p>Nhấn vào poster hoặc tên phim trong danh sách để xem thông tin chi tiết</p>
                </div>
                
                <div class="mobile-help-tip">
                    <h4>Xem phim</h4>
                    <p>Trong trang chi tiết, nhấn nút "Xem Phim" để xem phim ngay</p>
                </div>
                
                <div class="mobile-help-tip">
                    <h4>Chuyển tập</h4>
                    <p>Với phim bộ, bạn có thể chọn tập muốn xem từ danh sách tập phim</p>
                </div>
                
                <div class="mobile-help-tip">
                    <h4>Tìm kiếm</h4>
                    <p>Sử dụng thanh tìm kiếm ở phần đầu trang để tìm phim theo tên</p>
                </div>
                
                <div class="mobile-help-tip">
                    <h4>Lọc phim</h4>
                    <p>Bạn có thể lọc phim theo thể loại, quốc gia và năm phát hành</p>
                </div>
                
                <p style="text-align: center; color: #888;">© 2023 MovieLand</p>
            </div>
        `;
        document.body.appendChild(helpOverlay);
        
        // Thêm xử lý cho overlay trợ giúp
        const helpButton = document.getElementById('show-mobile-help');
        const closeHelpButton = helpOverlay.querySelector('.mobile-help-close');
        
        helpButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
            
            // Hiện overlay và thêm hiệu ứng
            helpOverlay.style.display = 'flex';
            setTimeout(() => {
                helpOverlay.style.opacity = '1';
                helpOverlay.querySelector('.mobile-help-content').style.transform = 'translateY(0)';
            }, 10);
        });
        
        closeHelpButton.addEventListener('click', function() {
            // Đóng overlay với hiệu ứng
            helpOverlay.style.opacity = '0';
            helpOverlay.querySelector('.mobile-help-content').style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                helpOverlay.style.display = 'none';
            }, 300);
        });
        
        // Đóng overlay khi click bên ngoài
        helpOverlay.addEventListener('click', function(e) {
            if (e.target === helpOverlay) {
                closeHelpButton.click();
            }
        });
    }
    
    // Lấy tham chiếu đến các phần tử sau khi tạo
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
    
    // Hiển thị/ẩn menu di động khi click vào icon
    mobileMenuIcon.addEventListener('click', function(e) {
        e.stopPropagation(); // Ngăn sự kiện lan truyền
        toggleMobileMenu();
    });
    
    // Hàm toggle menu
    function toggleMobileMenu() {
        if (mobileMenu.style.display === 'block') {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    // Hàm mở menu
    function openMobileMenu() {
        mobileMenu.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Ngăn scroll trang
        
        // Thêm animation mở menu
        mobileMenu.style.opacity = '0';
        mobileMenu.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            mobileMenu.style.transition = 'opacity 0.3s, transform 0.3s';
            mobileMenu.style.opacity = '1';
            mobileMenu.style.transform = 'translateY(0)';
        }, 10);
        
        // Thay đổi icon menu
        const menuIcon = mobileMenuIcon.querySelector('i');
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
    }
    
    // Hàm đóng menu
    function closeMobileMenu() {
        // Thêm animation đóng menu
        mobileMenu.style.opacity = '0';
        mobileMenu.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            mobileMenu.style.display = 'none';
            document.body.style.overflow = ''; // Cho phép scroll trang
            mobileMenu.style.transition = '';
            mobileMenu.style.opacity = '';
            mobileMenu.style.transform = '';
        }, 300);
        
        // Thay đổi icon menu
        const menuIcon = mobileMenuIcon.querySelector('i');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
    
    // Xử lý các dropdown trong menu di động
    mobileDropdowns.forEach(function(dropdown, index) {
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation(); // Ngăn sự kiện lan truyền
            this.classList.toggle('active');
            const submenu = this.nextElementSibling;
            
            if (submenu.style.display === 'block') {
                // Đóng submenu
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
                setTimeout(() => {
                    submenu.style.maxHeight = '0';
                    submenu.style.opacity = '0';
                }, 10);
                
                setTimeout(() => {
                    submenu.style.display = 'none';
                    submenu.style.maxHeight = '';
                    submenu.style.opacity = '';
                }, 300);
            } else {
                // Mở submenu
                submenu.style.display = 'block';
                submenu.style.maxHeight = '0';
                submenu.style.opacity = '0';
                submenu.style.transition = 'max-height 0.3s, opacity 0.3s';
                
                setTimeout(() => {
                    submenu.style.maxHeight = submenu.scrollHeight + 'px';
                    submenu.style.opacity = '1';
                }, 10);
            }
        });
    });
    
    // Đóng menu khi click bên ngoài
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu') && 
            !event.target.closest('.mobile-menu-icon')) {
            if (mobileMenu.style.display === 'block') {
                closeMobileMenu();
            }
        }
    });
    
    // Đóng menu khi scroll trang
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Nếu scroll xuống hơn 50px thì đóng menu
        if ((scrollTop > lastScrollTop) && (scrollTop > 50)) {
            if (mobileMenu.style.display === 'block') {
                closeMobileMenu();
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Xử lý khi thay đổi kích thước màn hình
    window.addEventListener('resize', function() {
        if (window.innerWidth > 480) {
            // Đóng mobile menu trên màn hình lớn
            if (mobileMenu.style.display === 'block') {
                closeMobileMenu();
            }
        }
    });
    
    // Hiển thị popup trợ giúp nhanh cho lần truy cập đầu tiên trên mobile
    showMobileHelpFirstTime();
    
    function showMobileHelpFirstTime() {
        // Kiểm tra xem đã hiển thị trợ giúp chưa
        if (window.innerWidth <= 768 && !localStorage.getItem('mobileHelpShown')) {
            setTimeout(() => {
                const helpButton = document.getElementById('show-mobile-help');
                if (helpButton) {
                    helpButton.click();
                    localStorage.setItem('mobileHelpShown', 'true');
                }
            }, 1000);
        }
    }
}); 