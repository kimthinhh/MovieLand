// Xử lý trang kết quả tìm kiếm
document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử DOM
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchInfo = document.querySelector('.search-info');
    const resultsGrid = document.getElementById('search-results-grid');
    const paginationContainer = document.getElementById('pagination');
    
    // Lấy các bộ lọc
    const typeFilter = document.getElementById('type-filter');
    
    // Các biến theo dõi trạng thái tìm kiếm
    let currentPage = 1;
    let totalPages = 1;
    let currentKeyword = '';
    let currentType = '';
    
    // Kích thước trang
    const PAGE_SIZE = 20;
    
    // Lấy từ khóa tìm kiếm từ URL
    function getSearchParams() {
        const params = new URLSearchParams(window.location.search);
        
        return {
            keyword: params.get('keyword') || '',
            page: parseInt(params.get('page') || '1'),
            type: params.get('type') || ''
        };
    }
    
    // Cập nhật URL với các tham số tìm kiếm
    function updateURL(params) {
        const url = new URL(window.location);
        
        // Xóa các tham số cũ
        url.searchParams.delete('keyword');
        url.searchParams.delete('page');
        url.searchParams.delete('type');
        
        // Thêm tham số mới
        if (params.keyword) {
            url.searchParams.set('keyword', params.keyword);
        }
        
        if (params.page && params.page > 1) {
            url.searchParams.set('page', params.page);
        }
        
        if (params.type) {
            url.searchParams.set('type', params.type);
        }
        
        // Cập nhật URL mà không tải lại trang
        window.history.pushState({}, '', url);
    }
    
    // Khởi tạo trang
    function initPage() {
        const params = getSearchParams();
        
        // Thiết lập từ khóa tìm kiếm
        if (params.keyword) {
            searchInput.value = params.keyword;
            currentKeyword = params.keyword;
            
            // Cập nhật tiêu đề trang
            document.title = `Tìm kiếm: ${params.keyword} - MovieLand`;
        } else {
            // Chuyển về trang chủ nếu không có từ khóa
            window.location.href = 'index.html';
            return;
        }
        
        // Thiết lập trang hiện tại
        currentPage = params.page;
        
        // Thiết lập loại phim
        currentType = params.type;
        
        // Cập nhật UI các bộ lọc
        if (typeFilter) {
            const options = typeFilter.querySelectorAll('.filter-option');
            options.forEach(option => {
                if (option.getAttribute('data-value') === currentType) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }
        
        // Thực hiện tìm kiếm
        performSearch();
    }
    
    // Thực hiện tìm kiếm
    async function performSearch() {
        // Hiển thị trạng thái đang tải
        resultsGrid.innerHTML = `
            <div class="search-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Đang tìm kiếm "${currentKeyword}"...</p>
            </div>
        `;
        
        searchInfo.textContent = `Đang tìm kiếm "${currentKeyword}"...`;
        
        try {
            // Tạo URL API
            const apiURL = `https://phimapi.com/v1/api/tim-kiem?keyword=${encodeURIComponent(currentKeyword)}&page=${currentPage}&limit=${PAGE_SIZE}${currentType ? `&type=${currentType}` : ''}`;
            
            // Gọi API
            const response = await fetch(apiURL);
            
            if (!response.ok) {
                throw new Error('Không thể kết nối đến API tìm kiếm');
            }
            
            const data = await response.json();
            console.log('Kết quả tìm kiếm đầy đủ:', data);
            
            // Hiển thị kết quả
            displaySearchResults(data);
            
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
            resultsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h2>Đã xảy ra lỗi</h2>
                    <p>${error.message}</p>
                    <p>Vui lòng thử lại sau.</p>
                </div>
            `;
            
            searchInfo.textContent = `Đã xảy ra lỗi khi tìm kiếm "${currentKeyword}"`;
        }
    }
    
    // Hiển thị kết quả tìm kiếm
    function displaySearchResults(data) {
        // Kiểm tra xem có kết quả không
        const movies = data?.data?.items || [];
        const params = data?.data?.params || {};
        
        // Cập nhật thông tin tìm kiếm
        const totalItems = params.pagination?.totalItems || 0;
        totalPages = params.pagination?.totalPages || 1;
        
        // Cập nhật thông tin tìm kiếm
        searchInfo.textContent = `Tìm thấy ${totalItems} kết quả cho "${currentKeyword}"${currentType ? (currentType === 'series' ? ' - Phim bộ' : ' - Phim lẻ') : ''}`;
        
        // Tạo HTML cho các kết quả
        if (movies.length > 0) {
            resultsGrid.innerHTML = movies.map(movie => `
                <div class="movie-card">
                    <a href="chi-tiet-phim.html?slug=${movie.slug}">
                        <div class="movie-poster" style="background-image: url('https://phimimg.com/${movie.poster_url}')">
                            <span class="movie-quality">${movie.quality || 'HD'}</span>
                            ${movie.type === 'series' ? 
                                `<span class="movie-episode">${movie.episode_current || 'Đang cập nhật'}</span>` : 
                                ''}
                        </div>
                        <div class="movie-info">
                            <h3 class="movie-title">${movie.name}</h3>
                            <p class="movie-original-title">${movie.origin_name || ''}</p>
                        </div>
                    </a>
                </div>
            `).join('');
        } else {
            resultsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h2>Không tìm thấy kết quả</h2>
                    <p>Không tìm thấy kết quả nào cho "${currentKeyword}"${currentType ? (currentType === 'series' ? ' - Phim bộ' : ' - Phim lẻ') : ''}.</p>
                    <p>Vui lòng thử từ khóa khác hoặc bỏ bộ lọc.</p>
                </div>
            `;
        }
        
        // Tạo phân trang
        createPagination(currentPage, totalPages);
    }
    
    // Tạo phân trang
    function createPagination(currentPage, totalPages) {
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Nút trang trước
        if (currentPage > 1) {
            paginationHTML += `
                <div class="page-item">
                    <div class="page-link" data-page="${currentPage - 1}">
                        <i class="fas fa-chevron-left"></i>
                    </div>
                </div>
            `;
        }
        
        // Trang đầu
        if (currentPage > 2) {
            paginationHTML += `
                <div class="page-item">
                    <div class="page-link" data-page="1">1</div>
                </div>
            `;
            
            if (currentPage > 3) {
                paginationHTML += `
                    <div class="page-item">
                        <div class="page-link">...</div>
                    </div>
                `;
            }
        }
        
        // Các trang gần trang hiện tại
        for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
            paginationHTML += `
                <div class="page-item">
                    <div class="page-link ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</div>
                </div>
            `;
        }
        
        // Trang cuối
        if (currentPage < totalPages - 1) {
            if (currentPage < totalPages - 2) {
                paginationHTML += `
                    <div class="page-item">
                        <div class="page-link">...</div>
                    </div>
                `;
            }
            
            paginationHTML += `
                <div class="page-item">
                    <div class="page-link" data-page="${totalPages}">${totalPages}</div>
                </div>
            `;
        }
        
        // Nút trang sau
        if (currentPage < totalPages) {
            paginationHTML += `
                <div class="page-item">
                    <div class="page-link" data-page="${currentPage + 1}">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </div>
            `;
        }
        
        // Cập nhật DOM
        paginationContainer.innerHTML = paginationHTML;
        
        // Thêm sự kiện click cho các nút phân trang
        const pageLinks = paginationContainer.querySelectorAll('.page-link[data-page]');
        pageLinks.forEach(link => {
            link.addEventListener('click', function() {
                const page = parseInt(this.getAttribute('data-page'));
                currentPage = page;
                
                // Cập nhật URL
                updateURL({
                    keyword: currentKeyword,
                    page: currentPage,
                    type: currentType
                });
                
                // Thực hiện tìm kiếm lại
                performSearch();
                
                // Cuộn lên đầu trang
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // Xử lý sự kiện tìm kiếm
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const newKeyword = searchInput.value.trim();
        
        if (newKeyword) {
            currentKeyword = newKeyword;
            currentPage = 1;
            
            // Cập nhật URL
            updateURL({
                keyword: currentKeyword,
                page: currentPage,
                type: currentType
            });
            
            // Thực hiện tìm kiếm
            performSearch();
        }
    });
    
    // Xử lý sự kiện nhấn Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchBtn.click();
        }
    });
    
    // Xử lý sự kiện lọc theo loại phim
    if (typeFilter) {
        const options = typeFilter.querySelectorAll('.filter-option');
        options.forEach(option => {
            option.addEventListener('click', function() {
                // Cập nhật UI
                options.forEach(op => op.classList.remove('active'));
                this.classList.add('active');
                
                // Lấy giá trị lọc
                const typeValue = this.getAttribute('data-value');
                currentType = typeValue;
                currentPage = 1;
                
                // Cập nhật URL
                updateURL({
                    keyword: currentKeyword,
                    page: currentPage,
                    type: currentType
                });
                
                // Thực hiện tìm kiếm
                performSearch();
            });
        });
    }
    
    // Khởi tạo trang
    initPage();
}); 