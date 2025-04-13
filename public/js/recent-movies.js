// Hàm lấy dữ liệu phim mới cập nhật từ API
async function fetchLatestMovies() {
    const moviesContainer = document.getElementById('latest-movies');
    
    try {
        // Thực hiện yêu cầu API
        const response = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1');
        
        // Kiểm tra nếu response OK
        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        
        // Lấy dữ liệu JSON từ response
        const data = await response.json();
        
        // Xóa spinner loading
        const loadingSpinner = moviesContainer.querySelector('.loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.remove();
        }
        
        // Kiểm tra dữ liệu hợp lệ
        if (!data || !data.status || !data.items || !Array.isArray(data.items)) {
            throw new Error('Định dạng dữ liệu không hợp lệ');
        }
        
        // Hiển thị phim
        displayMovies(data.items);
        
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu phim:', error);
        
        // Hiển thị thông báo lỗi
        moviesContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Không thể tải dữ liệu phim. Vui lòng thử lại sau.</p>
                <button id="retry-button" class="retry-button">Thử lại</button>
            </div>
        `;
        
        // Thêm sự kiện thử lại
        const retryButton = document.getElementById('retry-button');
        if (retryButton) {
            retryButton.addEventListener('click', fetchLatestMovies);
        }
    }
}

// Hàm hiển thị danh sách phim
function displayMovies(movies) {
    const moviesContainer = document.getElementById('latest-movies');
    
    // Giới hạn số phim hiển thị (tối đa 10 phim)
    const moviesToShow = movies.slice(0, 10);
    
    // Tạo HTML cho mỗi phim
    const moviesHTML = moviesToShow.map(movie => {
        return `
            <div class="movie-card" data-id="${movie._id}">
                <div class="movie-poster">
                    <img src="${movie.poster_url}" alt="${movie.name}" loading="lazy">
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.name}</h3>
                    <div class="movie-original-title">${movie.origin_name}</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Thêm HTML vào container
    moviesContainer.innerHTML = moviesHTML;
    
    // Thêm sự kiện click cho mỗi phim
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
        card.addEventListener('click', () => {
            const movieId = card.getAttribute('data-id');
            if (movieId) {
                window.location.href = `phim.html?id=${movieId}`;
            }
        });
    });
}

// Lắng nghe sự kiện DOMContentLoaded để bắt đầu tải dữ liệu
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra nếu container tồn tại (chỉ chạy trong trang có hiển thị phim mới)
    const moviesContainer = document.getElementById('latest-movies');
    if (moviesContainer) {
        fetchLatestMovies();
    }
    
    // Xử lý lỗi CORS và hiển thị hướng dẫn nếu cần
    window.addEventListener('error', function(e) {
        if (e.message && (e.message.includes('CORS') || e.message.includes('Cross-Origin'))) {
            showCORSWarning();
        }
    });
});

// Hàm hiển thị cảnh báo CORS
function showCORSWarning() {
    const main = document.querySelector('main');
    
    // Kiểm tra xem thông báo đã tồn tại chưa
    if (document.querySelector('.cors-warning')) {
        return;
    }
    
    // Tạo phần tử cảnh báo
    const corsWarning = document.createElement('div');
    corsWarning.className = 'cors-warning';
    corsWarning.innerHTML = `
        <h3>Không thể tải dữ liệu do lỗi CORS (Cross-Origin Resource Sharing)</h3>
        <p>API không cho phép truy cập từ trình duyệt trực tiếp. Bạn có thể dùng một trong các cách sau để giải quyết:</p>
        <ol>
            <li>Cài đặt tiện ích mở rộng CORS Unblock cho trình duyệt</li>
            <li>Sử dụng proxy để chuyển tiếp yêu cầu API</li>
            <li>Sửa đổi api để cho phép CORS</li>
        </ol>
    `;
    
    // Thêm vào trang
    main.appendChild(corsWarning);
} 