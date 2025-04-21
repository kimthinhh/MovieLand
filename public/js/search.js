// Chức năng tìm kiếm phim từ PhimAPI
document.addEventListener('DOMContentLoaded', function() {
   
    
    // Lấy các phần tử DOM
    const searchBar = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-button');
    const searchResults = document.getElementById('searchResults');
    const searchResultsContainer = document.querySelector('.search-results-container');
    
    // Biến để kiểm soát debounce
    let searchTimeout = null;
    
    // Thêm sự kiện cho input tìm kiếm (tìm kiếm khi gõ)
    searchBar.addEventListener('input', function() {
        // Xóa timeout hiện tại nếu có
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Thiết lập timeout mới
        searchTimeout = setTimeout(() => {
            performSearch();
        }, 500); // Đợi 500ms sau khi người dùng ngừng gõ
    });
    
    // Thêm sự kiện cho nút tìm kiếm
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        performSearch();
    });
    
    // Thêm sự kiện click bên ngoài kết quả tìm kiếm để đóng
    document.addEventListener('click', function(e) {
        if (!searchBar.contains(e.target) && !searchButton.contains(e.target) && !searchResults.contains(e.target)) {
            closeSearchResults();
        }
    });
    
    // Thêm sự kiện nhấn Enter để tìm kiếm
    searchBar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    
    // Hàm đóng kết quả tìm kiếm
    function closeSearchResults() {
        searchResults.classList.remove('visible');
        setTimeout(() => {
            searchResults.style.display = 'none';
        }, 300); // Delay phù hợp với thời gian transition
    }
    
    // Hàm mở trang kết quả tìm kiếm đầy đủ
    function openFullSearchResults(keyword) {
        window.location.href = `tim-kiem.html?keyword=${encodeURIComponent(keyword)}`;
    }
    
    // Hàm thực hiện tìm kiếm
    async function performSearch() {
        const searchTerm = searchBar.value.trim();
        
        // Không làm gì nếu từ khóa trống
        if (!searchTerm) {
            closeSearchResults();
            return;
        }
        
        // Hiển thị trạng thái đang tải
        searchResults.style.display = 'block';
        setTimeout(() => {
            searchResults.classList.add('visible');
        }, 10);
        
        searchResultsContainer.innerHTML = `
            <div class="search-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Đang tìm kiếm...</p>
            </div>
        `;
        
        try {
            // Gọi API tìm kiếm
            const encodedKeyword = encodeURIComponent(searchTerm);
            const response = await fetch(`https://phimapi.com/v1/api/tim-kiem?keyword=${encodedKeyword}&page=1&limit=10`);
            
            if (!response.ok) {
                throw new Error('Không thể kết nối đến API tìm kiếm');
            }
            
            const data = await response.json();
            console.log('Kết quả tìm kiếm:', data);
            
            // Xử lý kết quả
            displaySearchResults(data, searchTerm);
            
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
            searchResultsContainer.innerHTML = `
                <div class="no-search-results">
                    <p>Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
        }
    }
    
    // Hàm hiển thị kết quả tìm kiếm
    function displaySearchResults(data, searchTerm) {
        // Kiểm tra xem có kết quả không
        const movies = data?.data?.items || [];
        
        // Chuẩn bị HTML kết quả
        let resultsHTML = '';
        
        if (movies.length > 0) {
            // Tạo HTML cho mỗi phim
            resultsHTML = movies.map(movie => `
                <div class="search-movie-item" data-slug="${movie.slug}">
                    <div class="search-movie-poster">
                        <img src="https://phimimg.com/${movie.poster_url}" alt="${movie.name}">
                    </div>
                    <div class="search-movie-info">
                        <div class="search-movie-title">${movie.name}</div>
                        <div class="search-movie-original-title">${movie.origin_name || ''}</div>
                        <div class="search-movie-year">${movie.year || ''} ${movie.type === 'series' ? '• Phim bộ' : '• Phim lẻ'}</div>
                    </div>
                </div>
            `).join('');
            
            // Thêm nút "Xem tất cả kết quả"
            resultsHTML += `
                <div class="search-view-all">
                    <button id="view-all-results">Xem tất cả kết quả cho "${searchTerm}"</button>
                </div>
            `;
        } else {
            // Hiển thị thông báo không tìm thấy
            resultsHTML = `
                <div class="no-search-results">
                    <p>Không tìm thấy kết quả nào cho "${searchTerm}"</p>
                </div>
            `;
        }
        
        // Cập nhật nội dung
        searchResultsContainer.innerHTML = resultsHTML;
        
        // Thêm sự kiện click cho mỗi kết quả tìm kiếm
        document.querySelectorAll('.search-movie-item').forEach(item => {
            item.addEventListener('click', function() {
                const movieSlug = this.getAttribute('data-slug');
                // Chuyển hướng đến trang chi tiết phim
                window.location.href = `chi-tiet-phim.html?slug=${encodeURIComponent(movieSlug)}`;
            });
        });
        
        // Thêm sự kiện cho nút xem tất cả kết quả
        const viewAllButton = document.getElementById('view-all-results');
        if (viewAllButton) {
            viewAllButton.addEventListener('click', function() {
                openFullSearchResults(searchTerm);
            });
        }
    }
}); 