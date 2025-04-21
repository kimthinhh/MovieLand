// Quản lý tính năng phim yêu thích và lịch sử xem
document.addEventListener('DOMContentLoaded', function() {
    console.log('Trang đã tải, khởi tạo tính năng phim yêu thích và lịch sử xem...');
    
    // Đợi một chút để đảm bảo các phần tử DOM đã được tải
    setTimeout(() => {
        // Khởi tạo tính năng phim yêu thích và lịch sử xem
        initUserFeatures();
        
        // Trang chi tiết phim sẽ được xử lý trong file movie-details.js
        // KHÔNG gọi initMovieDetailsButtons ở đây để tránh trùng lặp
    }, 500);
});

// Hàm khởi tạo các tính năng người dùng
function initUserFeatures() {
    // Thêm sự kiện cho các liên kết phim yêu thích và lịch sử xem trong menu người dùng
    const favoritesLink = document.getElementById('favorites-link');
    const historyLink = document.getElementById('history-link');
    
    if (favoritesLink) {
        favoritesLink.addEventListener('click', function(e) {
            e.preventDefault();
            showFavoritesPage();
        });
    }
    
    if (historyLink) {
        historyLink.addEventListener('click', function(e) {
            e.preventDefault();
            showHistoryPage();
        });
    }
}

// Hàm kiểm tra có đang ở trang chi tiết phim không
function isMovieDetailsPage() {
    return window.location.pathname.includes('chi-tiet-phim.html');
}

// Hàm khởi tạo nút yêu thích trên trang chi tiết phim
function initMovieDetailsButtons() {
    console.log('Đang khởi tạo nút yêu thích...');
    
    // Kiểm tra nếu nút yêu thích đã tồn tại
    if (document.querySelector('.favorite-button') || document.querySelector('.favorite-button-container')) {
        console.log('Nút yêu thích đã tồn tại, không khởi tạo lại');
        return;
    }
    
    // Tạo nút thích và theo dõi lịch sử xem
    addFavoriteButton();
    
    // Thêm phương pháp dự phòng - kiểm tra sau một khoảng thời gian
    setTimeout(() => {
        // Nếu vẫn chưa có nút yêu thích, thử lại
        if (!document.querySelector('.favorite-button') && !document.querySelector('.favorite-button-container')) {
            console.log('Áp dụng phương pháp dự phòng - nút yêu thích chưa được thêm');
            
            // Lấy thông tin phim từ URL
            const urlParams = new URLSearchParams(window.location.search);
            const movieSlug = urlParams.get('slug');
            if (movieSlug) {
                const watchButtonsContainer = document.querySelector('.watch-buttons');
                if (watchButtonsContainer) {
                    console.log('Tìm thấy container nút xem phim, thêm nút yêu thích bằng phương pháp dự phòng');
                    addFavoriteButtonToContainer(watchButtonsContainer, movieSlug);
                    
                    // Cập nhật lịch sử xem
                    updateWatchHistory(movieSlug);
                }
            }
        }
    }, 1500);
}

// Thêm nút yêu thích vào trang chi tiết phim
function addFavoriteButton() {
    console.log('Đang thêm nút yêu thích vào trang chi tiết phim...');
    
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        console.log('Không thêm nút vì người dùng chưa đăng nhập');
        return; // Không thêm nút nếu chưa đăng nhập
    }
    
    // Lấy thông tin phim hiện tại từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieSlug = urlParams.get('slug');
    if (!movieSlug) {
        console.log('Không tìm thấy slug phim trong URL');
        return;
    }
    console.log('Slug phim:', movieSlug);
    
    // Kiểm tra nếu nút yêu thích đã tồn tại
    if (document.querySelector('.favorite-button') || document.querySelector('.favorite-button-container')) {
        console.log('Nút yêu thích đã tồn tại, không thêm lại');
        return;
    }
    
    // Kiểm tra nơi cần thêm nút
    const watchButtonsContainer = document.querySelector('.watch-buttons');
    if (!watchButtonsContainer) {
        console.log('Không tìm thấy container .watch-buttons');
        
        // Thử tạo container nếu không tìm thấy
        setTimeout(() => {
            // Kiểm tra lại một lần nữa nếu nút đã tồn tại
            if (document.querySelector('.favorite-button') || document.querySelector('.favorite-button-container')) {
                console.log('Nút yêu thích đã tồn tại (kiểm tra thứ 2), không thêm lại');
                return;
            }
            
            const retryContainer = document.querySelector('.watch-buttons');
            if (retryContainer) {
                console.log('Đã tìm thấy container .watch-buttons sau khi đợi 1 giây');
                addFavoriteButtonToContainer(retryContainer, movieSlug);
            } else {
                console.log('Vẫn không tìm thấy container .watch-buttons sau khi đợi 1 giây');
            }
        }, 1000);
        return;
    }
    
    // Thêm nút vào container đã tìm thấy
    addFavoriteButtonToContainer(watchButtonsContainer, movieSlug);
    
    // Cập nhật lịch sử xem
    updateWatchHistory(movieSlug);
}

// Hàm thêm nút yêu thích vào container
function addFavoriteButtonToContainer(container, movieSlug) {
    // Kiểm tra lại một lần nữa nếu nút đã tồn tại
    if (document.querySelector('.favorite-button') || document.querySelector('.favorite-button-container')) {
        console.log('Nút yêu thích đã tồn tại (kiểm tra trong hàm thêm), không thêm lại');
        return;
    }
    
    // Kiểm tra nếu phim đã có trong danh sách yêu thích
    const isFavorite = isMovieFavorite(movieSlug);
    console.log('Phim có trong danh sách yêu thích?', isFavorite);
    
    // Tạo nút yêu thích
    const favoriteButton = document.createElement('button');
    favoriteButton.className = `watch-button favorite-button ${isFavorite ? 'active' : ''}`;
    favoriteButton.innerHTML = `<i class="${isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i> ${isFavorite ? 'Đã thích' : 'Yêu thích'}`;
    favoriteButton.style.backgroundColor = isFavorite ? '#e17c97' : 'transparent';
    favoriteButton.style.color = isFavorite ? 'white' : '#e17c97';
    favoriteButton.style.border = '2px solid #e17c97';
    
    // Thêm sự kiện click
    favoriteButton.addEventListener('click', function() {
        toggleFavoriteMovie(movieSlug, favoriteButton);
    });
    
    // Tạo một container mới để chứa nút yêu thích ở hàng dưới
    const favoriteContainer = document.createElement('div');
    favoriteContainer.className = 'favorite-button-container';
    favoriteContainer.style.marginTop = '10px';
    favoriteContainer.style.display = 'flex';
    favoriteContainer.style.justifyContent = 'center';
    
    // Thêm nút vào container mới
    favoriteContainer.appendChild(favoriteButton);
    
    // Chèn container mới sau container các nút hiện tại
    if (container.nextElementSibling) {
        container.parentNode.insertBefore(favoriteContainer, container.nextElementSibling);
    } else {
        container.parentNode.appendChild(favoriteContainer);
    }
    
    console.log('Đã thêm nút yêu thích ở hàng dưới');
}

// Hàm kiểm tra phim có trong danh sách yêu thích không
function isMovieFavorite(movieSlug) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return false;
    
    // Lấy danh sách phim yêu thích từ localStorage
    const favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.email}`) || '[]');
    
    // Kiểm tra phim có trong danh sách không
    return favorites.some(movie => movie.slug === movieSlug);
}

// Hàm toggle trạng thái yêu thích
function toggleFavoriteMovie(movieSlug, buttonElement) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Bạn cần đăng nhập để sử dụng tính năng này!');
        return;
    }
    
    // Lấy thông tin phim từ trang
    const movieTitle = document.querySelector('.movie-title-large')?.textContent || 'Phim không xác định';
    const moviePosterElement = document.querySelector('.movie-poster-large');
    const posterUrl = moviePosterElement ? extractPosterUrl(moviePosterElement.style.backgroundImage) : '';
    
    // Lấy danh sách phim yêu thích hiện tại
    let favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.email}`) || '[]');
    
    // Kiểm tra xem phim đã có trong danh sách chưa
    const existingIndex = favorites.findIndex(movie => movie.slug === movieSlug);
    let isFavoriteNow = false;
    
    if (existingIndex >= 0) {
        // Nếu đã có, xóa khỏi danh sách
        favorites.splice(existingIndex, 1);
        isFavoriteNow = false;
    } else {
        // Nếu chưa có, thêm vào danh sách
        favorites.push({
            slug: movieSlug,
            title: movieTitle,
            poster: posterUrl,
            addedDate: new Date().toISOString()
        });
        isFavoriteNow = true;
    }
    
    // Lưu lại danh sách
    localStorage.setItem(`favorites_${currentUser.email}`, JSON.stringify(favorites));
    
    // Cập nhật giao diện nút
    if (buttonElement) {
        buttonElement.innerHTML = `<i class="${isFavoriteNow ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i> ${isFavoriteNow ? 'Đã thích' : 'Yêu thích'}`;
        buttonElement.style.backgroundColor = isFavoriteNow ? '#e17c97' : 'transparent';
        buttonElement.style.color = isFavoriteNow ? 'white' : '#e17c97';
        buttonElement.classList.toggle('active', isFavoriteNow);
    }
}

// Hàm trích xuất URL poster từ background-image CSS
function extractPosterUrl(backgroundImage) {
    if (!backgroundImage) return '';
    
    // Tìm URL trong chuỗi CSS background-image
    const match = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
    if (match && match[1]) {
        return match[1];
    }
    
    return '';
}

// Hàm cập nhật lịch sử xem
function updateWatchHistory(movieSlug) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Lấy thông tin phim từ trang
    const movieTitle = document.querySelector('.movie-title-large')?.textContent || 'Phim không xác định';
    const moviePosterElement = document.querySelector('.movie-poster-large');
    const posterUrl = moviePosterElement ? extractPosterUrl(moviePosterElement.style.backgroundImage) : '';
    
    // Lấy lịch sử xem hiện tại
    let history = JSON.parse(localStorage.getItem(`history_${currentUser.email}`) || '[]');
    
    // Xóa phim này nếu đã tồn tại trong lịch sử
    history = history.filter(movie => movie.slug !== movieSlug);
    
    // Thêm phim vào đầu danh sách
    history.unshift({
        slug: movieSlug,
        title: movieTitle,
        poster: posterUrl,
        viewedDate: new Date().toISOString()
    });
    
    // Giới hạn lịch sử xem (giữ 50 phim gần nhất)
    if (history.length > 50) {
        history = history.slice(0, 50);
    }
    
    // Lưu lại lịch sử
    localStorage.setItem(`history_${currentUser.email}`, JSON.stringify(history));
}

// Hàm hiển thị trang phim yêu thích
function showFavoritesPage() {
    console.log('Hiển thị danh sách phim yêu thích');
    
    // Luôn tạo mới container để đảm bảo hiển thị đúng danh sách
    createMovieListPage('favorites', 'Phim Yêu Thích');
}

// Hàm hiển thị trang lịch sử xem
function showHistoryPage() {
    console.log('Hiển thị danh sách lịch sử xem');
    
    // Luôn tạo mới container để đảm bảo hiển thị đúng danh sách
    createMovieListPage('history', 'Lịch Sử Xem');
}

// Hàm tạo trang danh sách phim (yêu thích hoặc lịch sử)
function createMovieListPage(type, title) {
    console.log(`Tạo trang danh sách ${type} - ${title}`);
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Bạn cần đăng nhập để xem nội dung này!');
        return;
    }
    
    // Lấy danh sách phim từ localStorage
    const movies = JSON.parse(localStorage.getItem(`${type}_${currentUser.email}`) || '[]');
    
    // Xóa container cũ nếu tồn tại
    let listContainer = document.getElementById('user-movie-list-container');
    if (listContainer) {
        // Xóa container cũ hoàn toàn khỏi DOM
        listContainer.remove();
    }
    
    // Tạo container mới
    listContainer = document.createElement('div');
    listContainer.id = 'user-movie-list-container';
    listContainer.style.position = 'fixed';
    listContainer.style.top = '0';
    listContainer.style.left = '0';
    listContainer.style.width = '100%';
    listContainer.style.height = '100%';
    listContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
    listContainer.style.zIndex = '9999';
    listContainer.style.overflow = 'auto';
    listContainer.style.padding = '20px';
    listContainer.style.boxSizing = 'border-box';
    
    document.body.appendChild(listContainer);
    
    // Thêm thuộc tính để biết đang hiển thị loại danh sách nào
    listContainer.setAttribute('data-list-type', type);
    
    // Tạo nội dung
    const contentHTML = `
        <div class="movie-list-content" style="max-width: 1200px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 20px; position: relative;">
            <span class="close-btn" style="position: absolute; top: 15px; right: 15px; font-size: 24px; cursor: pointer; color: #555;" onclick="hideUserMovieList()">&times;</span>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2 style="color: #e17c97; font-size: 28px; margin: 0;">${title} của ${currentUser.displayName}</h2>
                ${type === 'history' && movies.length > 0 ? 
                    `<button onclick="clearWatchHistory()" style="background-color: #888; color: white; border: none; border-radius: 5px; padding: 8px 15px; cursor: pointer;">
                        <i class="fa-solid fa-trash-can" style="margin-right: 5px;"></i> Xóa lịch sử
                    </button>` : ''
                }
            </div>
            
            ${movies.length === 0 ? 
                `<div style="text-align: center; padding: 50px 0;">
                    <i class="${type === 'favorites' ? 'fa-solid fa-heart' : 'fa-solid fa-history'}" style="font-size: 48px; color: #e17c97; margin-bottom: 20px;"></i>
                    <p style="font-size: 18px; color: #555;">Chưa có phim nào trong ${title.toLowerCase()} của bạn.</p>
                </div>` : 
                `<div class="movies-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                    ${movies.map(movie => `
                        <div class="movie-card" style="position: relative; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                            <a href="chi-tiet-phim.html?slug=${movie.slug}" style="display: block; text-decoration: none;">
                                <div class="movie-poster" style="height: 300px; background-image: url('${movie.poster || 'images/no-poster.jpg'}'); background-size: cover; background-position: center;"></div>
                                <div class="movie-info" style="padding: 10px; background-color: #fff;">
                                    <h3 style="margin: 0; font-size: 16px; color: #333; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${movie.title}</h3>
                                    <p style="margin: 5px 0 0; font-size: 12px; color: #777;">
                                        ${type === 'favorites' ? 'Đã thêm: ' : 'Đã xem: '} 
                                        ${formatDate(movie[type === 'favorites' ? 'addedDate' : 'viewedDate'])}
                                    </p>
                                </div>
                            </a>
                            ${type === 'favorites' ? 
                                `<button class="remove-btn" 
                                    style="position: absolute; top: 10px; right: 10px; background-color: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center;"
                                    onclick="removeFromFavorites('${movie.slug}')">
                                    <i class="fa-solid fa-times"></i>
                                </button>` : ''}
                        </div>
                    `).join('')}
                </div>`
            }
        </div>
    `;
    
    listContainer.innerHTML = contentHTML;
    
    // Thêm style cho scrollbar
    const style = document.createElement('style');
    style.textContent = `
        #user-movie-list-container::-webkit-scrollbar {
            width: 8px;
        }
        #user-movie-list-container::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.1);
        }
        #user-movie-list-container::-webkit-scrollbar-thumb {
            background-color: rgba(255,255,255,0.3);
            border-radius: 4px;
        }
    `;
    
    document.head.appendChild(style);
    
    // Hiển thị container
    listContainer.style.display = 'block';
}

// Hàm ẩn container danh sách phim
function hideUserMovieList() {
    const listContainer = document.getElementById('user-movie-list-container');
    if (listContainer) {
        listContainer.style.display = 'none';
    }
}

// Đặt hàm ẩn danh sách phim toàn cục để có thể gọi từ HTML
window.hideUserMovieList = hideUserMovieList;

// Hàm định dạng ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
        return 'Hôm nay';
    } else if (diffInDays === 1) {
        return 'Hôm qua';
    } else if (diffInDays < 7) {
        return `${diffInDays} ngày trước`;
    } else {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
}

// Hàm xóa phim khỏi danh sách yêu thích
function removeFromFavorites(movieSlug) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Lấy danh sách phim yêu thích
    let favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.email}`) || '[]');
    
    // Xóa phim khỏi danh sách
    favorites = favorites.filter(movie => movie.slug !== movieSlug);
    
    // Lưu lại danh sách
    localStorage.setItem(`favorites_${currentUser.email}`, JSON.stringify(favorites));
    
    // Cập nhật giao diện
    try {
        const movieElement = document.querySelector(`.movie-card a[href*="${movieSlug}"]`);
        if (movieElement && movieElement.parentNode) {
            const movieCard = movieElement.parentNode;
            
            // Thêm hiệu ứng biến mất
            movieCard.style.transition = 'all 0.3s ease';
            movieCard.style.opacity = '0';
            movieCard.style.transform = 'scale(0.8)';
            
            // Sau khi hiệu ứng kết thúc, xóa phần tử khỏi DOM
            setTimeout(() => {
                movieCard.remove();
                
                // Kiểm tra nếu không còn phim nào thì hiển thị thông báo
                const moviesGrid = document.querySelector('.movies-grid');
                if (moviesGrid && moviesGrid.children.length === 0) {
                    const listContent = document.querySelector('.movie-list-content');
                    if (listContent) {
                        // Xóa grid và hiển thị thông báo trống
                        moviesGrid.remove();
                        const emptyMessage = document.createElement('div');
                        emptyMessage.style.textAlign = 'center';
                        emptyMessage.style.padding = '50px 0';
                        emptyMessage.innerHTML = `
                            <i class="fa-solid fa-heart" style="font-size: 48px; color: #e17c97; margin-bottom: 20px;"></i>
                            <p style="font-size: 18px; color: #555;">Chưa có phim nào trong phim yêu thích của bạn.</p>
                        `;
                        listContent.appendChild(emptyMessage);
                    }
                }
                
                // Cập nhật số lượng phim yêu thích trên menu (nếu đang hiển thị)
                const favoritesCountBadge = document.querySelector('#favorites-link .badge');
                if (favoritesCountBadge) {
                    favoritesCountBadge.textContent = favorites.length;
                }
            }, 300);
        } else {
            console.error('Không tìm thấy phần tử phim cần xóa');
            
            // Nếu không tìm thấy phần tử trên DOM, tải lại trang phim yêu thích
            createMovieListPage('favorites', 'Phim Yêu Thích');
        }
    } catch (error) {
        console.error('Lỗi khi xóa phim khỏi giao diện:', error);
        // Tải lại trang phim yêu thích để đồng bộ với dữ liệu
        createMovieListPage('favorites', 'Phim Yêu Thích');
    }
}

// Cung cấp hàm xóa phim từ yêu thích cho window để sử dụng trong onclick
window.removeFromFavorites = removeFromFavorites;

// Hàm xóa toàn bộ lịch sử xem
function clearWatchHistory() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem phim?')) {
        // Xóa dữ liệu từ localStorage
        localStorage.setItem(`history_${currentUser.email}`, '[]');
        
        // Cập nhật giao diện
        createMovieListPage('history', 'Lịch Sử Xem');
        
        // Cập nhật số lượng lịch sử trên menu (nếu đang hiển thị)
        const historyCountBadge = document.querySelector('#history-link .badge');
        if (historyCountBadge) {
            historyCountBadge.textContent = '0';
        }
    }
}

// Đặt hàm xóa lịch sử xem toàn cục để có thể gọi từ HTML
window.clearWatchHistory = clearWatchHistory; 