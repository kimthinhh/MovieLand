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

        // Nếu lỗi do CORS, hiển thị dữ liệu mẫu sau 2 giây
        setTimeout(() => {
            if (error.message && (error.message.includes('CORS') || error.message.includes('Cross-Origin'))) {
                displaySampleMovies();
                showCORSWarning();
            }
        }, 2000);
    }
}

// Hàm hiển thị danh sách phim
function displayMovies(movies) {
    const moviesContainer = document.getElementById('latest-movies');
    
    // Giới hạn số phim hiển thị (tối đa 12 phim)
    const moviesToShow = movies.slice(0, 12);
    
    // Tạo HTML cho mỗi phim
    const moviesHTML = moviesToShow.map(movie => {
        // Xử lý URL poster
        const posterUrl = movie.poster_url ? 
            (movie.poster_url.startsWith('http') ? movie.poster_url : `https://phimimg.com/${movie.poster_url}`) : 
            '/images/placeholder.jpg';
        
        // Lấy thể loại và quốc gia nếu có
        const categories = movie.category ? 
            movie.category.map(cat => cat.name).join(', ') : 
            '';
            
        const countries = movie.country ? 
            movie.country.map(c => c.name).join(', ') : 
            '';

        // Tạo HTML cho thẻ phim
        return `
            <div class="movie-card" data-id="${movie._id || movie.id}" data-slug="${movie.slug}">
                <div class="movie-poster">
                    <img src="${posterUrl}" alt="${movie.name}" loading="lazy">
                    <span class="movie-quality">${movie.quality || 'HD'}</span>
                    <span class="movie-episode">${movie.episode_current || 'Full'}</span>
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.name}</h3>
                    <div class="movie-meta">
                        <span class="movie-year">${movie.year || ''}</span>
                        ${categories ? `<span class="movie-categories">• ${categories}</span>` : ''}
                        ${countries ? `<span class="movie-countries">• ${countries}</span>` : ''}
                    </div>
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
            const movieSlug = card.getAttribute('data-slug');
            if (movieSlug) {
                window.location.href = `chi-tiet-phim.html?slug=${movieSlug}`;
            } else if (movieId) {
                window.location.href = `chi-tiet-phim.html?id=${movieId}`;
            }
        });
    });
}

// Hàm hiển thị dữ liệu mẫu nếu không lấy được từ API
function displaySampleMovies() {
    const moviesContainer = document.getElementById('latest-movies');
    
    const sampleMovies = [
        {
            _id: "77b7032b2e237ae78e3c520b9a0fd5fa",
            name: "Trò Chơi Tình Ái",
            slug: "tro-choi-tinh-ai-2025",
            year: 2025,
            quality: "FHD",
            episode_current: "Hoàn Tất (56/56)",
            category: [
                { name: "Chính Kịch" },
                { name: "Tình Cảm" },
                { name: "Tâm Lý" }
            ],
            country: [
                { name: "Trung Quốc" }
            ]
        },
        {
            _id: "6991aa40ef4b66fb372bd171ba9ad7f2",
            name: "Top Form The Series",
            slug: "top-form-the-series",
            year: 2025,
            quality: "FHD",
            episode_current: "Tập 4",
            category: [
                { name: "Hành Động" },
                { name: "Hình Sự" }
            ],
            country: [
                { name: "Thái Lan" }
            ]
        },
        {
            _id: "a1d29909828423591afb051b28d964a9",
            name: "Xin Hãy Kết Hôn Với Tôi Lần Nữa",
            slug: "xin-hay-ket-hon-voi-toi-lan-nua",
            year: 2025,
            quality: "FHD",
            episode_current: "Tập 8",
            category: [
                { name: "Chính Kịch" },
                { name: "Tình Cảm" },
                { name: "Tâm Lý" }
            ],
            country: [
                { name: "Trung Quốc" }
            ]
        },
        {
            _id: "42c558afca2928af13d868d104e2dca5",
            name: "Tôi Là Triệu Xuất Tức",
            slug: "toi-la-trieu-xuat-tuc",
            year: 2025,
            quality: "FHD",
            episode_current: "Tập 28",
            category: [
                { name: "Chính Kịch" },
                { name: "Tình Cảm" },
                { name: "Tâm Lý" }
            ],
            country: [
                { name: "Trung Quốc" }
            ]
        },
        {
            _id: "fe56468d0a4575b7aa9eca5f72a60ae4",
            name: "Người Gác Đêm Mao Sơn",
            slug: "nguoi-gac-dem-mao-son",
            year: 2025,
            quality: "FHD",
            episode_current: "Hoàn Tất (24/24)",
            category: [
                { name: "Chính Kịch" },
                { name: "Bí Ẩn" }
            ],
            country: [
                { name: "Trung Quốc" }
            ]
        },
        {
            _id: "556fe7056165f3f6490139ca118e1c49",
            name: "Nửa Đời Sau Của Tôi",
            slug: "nua-doi-sau-cua-toi",
            year: 2025,
            quality: "FHD",
            episode_current: "Tập 11",
            category: [
                { name: "Chính Kịch" },
                { name: "Tình Cảm" },
                { name: "Tâm Lý" }
            ],
            country: [
                { name: "Trung Quốc" }
            ]
        }
    ];

    // Hiển thị phim mẫu
    displayMovies(sampleMovies);
}

// Hàm thêm sự kiện click cho các thẻ phim ở các danh mục tĩnh
function addClickToStaticMovies() {
    // Lấy tất cả các thẻ phim danh mục (school-movie-card)
    const staticMovieCards = document.querySelectorAll('.school-movie-card');
    
    // Thêm sự kiện click cho từng thẻ phim
    staticMovieCards.forEach(card => {
        // Thêm cursor pointer cho tất cả các thẻ phim
        card.style.cursor = 'pointer';
        
        // Thêm sự kiện click
        card.addEventListener('click', () => {
            // Lấy tên phim làm slug (chuẩn hóa để tạo slug)
            const movieTitle = card.querySelector('.school-movie-title').textContent;
            const slug = createSlugFromTitle(movieTitle);
            
            // Chuyển hướng đến trang chi tiết phim
            window.location.href = `chi-tiet-phim.html?slug=${slug}`;
        });
    });
}

// Hàm tạo slug từ tên phim
function createSlugFromTitle(title) {
    // Loại bỏ dấu tiếng Việt
    let slug = title.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
    
    // Thay thế khoảng trắng bằng dấu gạch ngang và loại bỏ các ký tự đặc biệt
    slug = slug.replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
    
    return slug;
}

// Lắng nghe sự kiện DOMContentLoaded để bắt đầu tải dữ liệu
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra nếu container tồn tại (chỉ chạy trong trang có hiển thị phim mới)
    const moviesContainer = document.getElementById('latest-movies');
    if (moviesContainer) {
        fetchLatestMovies();
    }
    
    // Thêm sự kiện click cho các phim tĩnh trong các danh mục
    addClickToStaticMovies();
    
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