document.addEventListener('DOMContentLoaded', function() {
    // Chức năng Banner/Slider
    const dots = document.querySelectorAll('.dot');
    const nextSlide = document.querySelector('.next-slide');
    
    // Mô phỏng chức năng slider
    let currentSlide = 0;
    const totalSlides = dots.length;
    
    // Khởi tạo slide đầu tiên
    updateSlider();
    
    // Xử lý sự kiện click vào nút chuyển slide
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // Xử lý sự kiện click vào nút next
    if (nextSlide) {
        nextSlide.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });
    }
    
    // Cập nhật hiển thị slider
    function updateSlider() {
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
                
                // Lấy các phần tử cần cập nhật
                const bannerElement = document.querySelector('.hero-banner');
                const titleElement = document.querySelector('.banner-content h1');
                const descriptionElement = document.querySelector('.movie-description');
                const tagsContainer = document.querySelector('.movie-tags');
                
                // Lấy dữ liệu từ dot
                const bgImage = dot.getAttribute('data-bg');
                const title = dot.getAttribute('data-title');
                const description = dot.getAttribute('data-description');
                const tags = dot.getAttribute('data-tags') ? dot.getAttribute('data-tags').split(',') : [];
                
                // Cập nhật background
                if (bannerElement && bgImage) {
                    bannerElement.style.background = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url('${bgImage}')`;
                    bannerElement.style.backgroundSize = 'cover';
                    bannerElement.style.backgroundPosition = 'center';
                }
                
                // Cập nhật tiêu đề
                if (titleElement && title) {
                    titleElement.textContent = title;
                }
                
                // Cập nhật mô tả
                if (descriptionElement && description) {
                    descriptionElement.textContent = description;
                }
                
                // Cập nhật thẻ
                if (tagsContainer && tags.length > 0) {
                    tagsContainer.innerHTML = '';
                    tags.forEach(tag => {
                        const tagElement = document.createElement('span');
                        tagElement.className = 'tag';
                        tagElement.textContent = tag.trim();
                        tagsContainer.appendChild(tagElement);
                    });
                }
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Mô phỏng chức năng tìm kiếm
    const searchBar = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-button');
    const searchResults = document.getElementById('searchResults');
    const searchResultsContainer = document.querySelector('.search-results-container');
    
    // Danh sách phim lưu trữ
    let allMovies = [];
    
    // Biến để kiểm soát debounce
    let searchTimeout = null;
    
    // Dữ liệu phim mẫu để sử dụng khi không tải được API
    const sampleMovies = [
        {
            id: 1,
            title: 'Niệm Vô Song',
            originalTitle: 'Wu Song Ji',
            year: 2023,
            poster: '/images/1.jpg',
            genres: ['Chính Kịch', 'Cổ Trang', 'Tình Cảm'],
            type: 'series'
        },
        {
            id: 2,
            title: 'Daredevil: Tái Xuất',
            originalTitle: 'Daredevil: Born Again',
            year: 2023,
            poster: '/images/2.jpg',
            genres: ['Chính Kịch', 'Hành Động', 'Siêu anh hùng'],
            type: 'series'
        },
        {
            id: 3,
            title: 'Nghề Siêu Khó Nói',
            originalTitle: 'Vigilante Corps',
            year: 2022,
            poster: '/images/3.jpg',
            genres: ['Hài hước', 'Tình cảm', 'Tâm lý'],
            type: 'single'
        },
        {
            id: 4,
            title: 'Khi cuộc đời cho bạn quả quýt',
            originalTitle: 'When Life Gives You Tangerines',
            year: 2023,
            poster: '/images/4.jpg',
            genres: ['Chính kịch', 'Tình cảm', 'Tâm lý'],
            type: 'series'
        },
        {
            id: 6,
            title: 'Mật Vụ Phụ Hồ',
            originalTitle: 'The Bricklayer',
            year: 2022,
            poster: '/images/6.png',
            genres: ['Hành Động', 'Gay Cấn', 'Hình Sự'],
            type: 'single'
        }
    ];
    
    // Tải dữ liệu phim từ API
    async function loadMovies() {
        try {
            if (allMovies.length > 0) {
                return; // Đã tải dữ liệu rồi
            }
            
            // Tải dữ liệu ngầm nếu không phải do tìm kiếm gọi
            const isSearching = searchResults.style.display === 'block';
            
            if (isSearching) {
                // Hiển thị trạng thái đang tải nếu đang tìm kiếm
                searchResults.style.display = 'block';
                setTimeout(() => {
                    searchResults.classList.add('visible');
                }, 10);
                
                searchResultsContainer.innerHTML = `
                    <div class="search-loading">
                        <i class="fas fa-spinner"></i>
                        <p>Đang tải dữ liệu phim...</p>
                    </div>
                `;
            }
            
            // Thay vì cố gắng fetch file JS mà có thể không được phép truy cập trực tiếp
            // Sử dụng dữ liệu mẫu để chắc chắn chức năng tìm kiếm hoạt động
            console.log('Đang tải dữ liệu phim mẫu...');
            
            // Thêm nhiều phim mẫu hơn để chức năng tìm kiếm làm việc tốt hơn
            const moreMovies = [
                {
                    id: 1,
                    title: 'Niệm Vô Song',
                    originalTitle: 'Wu Song Ji',
                    year: 2023,
                    poster: '/images/1.jpg',
                    genres: ['Chính Kịch', 'Cổ Trang', 'Tình Cảm'],
                    type: 'series'
                },
                {
                    id: 2,
                    title: 'Daredevil: Tái Xuất',
                    originalTitle: 'Daredevil: Born Again',
                    year: 2023,
                    poster: '/images/2.jpg',
                    genres: ['Chính Kịch', 'Hành Động', 'Siêu anh hùng'],
                    type: 'series'
                },
                {
                    id: 3,
                    title: 'Nghề Siêu Khó Nói',
                    originalTitle: 'Vigilante Corps',
                    year: 2022,
                    poster: '/images/3.jpg',
                    genres: ['Hài hước', 'Tình cảm', 'Tâm lý'],
                    type: 'single'
                },
                {
                    id: 4,
                    title: 'Khi cuộc đời cho bạn quả quýt',
                    originalTitle: 'When Life Gives You Tangerines',
                    year: 2023,
                    poster: '/images/4.jpg',
                    genres: ['Chính kịch', 'Tình cảm', 'Tâm lý'],
                    type: 'series'
                },
                {
                    id: 6,
                    title: 'Mật Vụ Phụ Hồ',
                    originalTitle: 'The Bricklayer',
                    year: 2022,
                    poster: '/images/6.png',
                    genres: ['Hành Động', 'Gay Cấn', 'Hình Sự'],
                    type: 'single'
                },
                {
                    id: 15,
                    title: 'Chúng Ta Hãy Kết Hôn Nhé',
                    originalTitle: 'My Merry Marriage',
                    year: 2023,
                    poster: '/images/15.jpg',
                    genres: ['Tâm lý', 'Tình cảm'],
                    type: 'series'
                },
                {
                    id: 16,
                    title: 'Khi Anh Chạy Về Phía Em',
                    originalTitle: 'When I Fly Towards You',
                    year: 2022,
                    poster: '/images/16.jpg',
                    genres: ['Tình cảm', 'Học đường'],
                    type: 'series'
                },
                {
                    id: 17,
                    title: 'Khoảnh Khắc Thanh Xuân',
                    originalTitle: 'Moment of Youth',
                    year: 2021,
                    poster: '/images/17.jpg',
                    genres: ['Thanh xuân', 'Tình bạn'],
                    type: 'series'
                },
                {
                    id: 18,
                    title: 'Khúc Ca Tuổi Trẻ',
                    originalTitle: 'Youth Melody',
                    year: 2022,
                    poster: '/images/18.jpg',
                    genres: ['Âm nhạc', 'Học đường'],
                    type: 'series'
                },
                {
                    id: 19,
                    title: 'Mùa Hè Năm Ấy',
                    originalTitle: 'Summer of That Year',
                    year: 2023,
                    poster: '/images/19.jpg',
                    genres: ['Tình cảm', 'Thanh xuân'],
                    type: 'series'
                },
                {
                    id: 7,
                    title: 'Ma Trận',
                    originalTitle: 'The Matrix',
                    year: 1999,
                    poster: 'https://placehold.co/300x450/ffe5ec/ff3e79?text=Ma%20Tr%E1%BA%ADn',
                    genres: ['Khoa học', 'Hành động'],
                    type: 'single'
                },
                {
                    id: 8,
                    title: 'Kẻ Du Hành',
                    originalTitle: 'Interstellar',
                    year: 2014,
                    poster: 'https://placehold.co/300x450/ffe5ec/ff3e79?text=K%E1%BA%BB%20Du%20H%C3%A0nh',
                    genres: ['Khoa học', 'Viễn tưởng'],
                    type: 'single'
                },
                {
                    id: 9,
                    title: 'Titanic',
                    originalTitle: 'Titanic',
                    year: 1997,
                    poster: 'https://placehold.co/300x450/ffe5ec/ff3e79?text=Titanic',
                    genres: ['Tình cảm', 'Bi kịch'],
                    type: 'single'
                },
                {
                    id: 10,
                    title: 'Biệt Đội Siêu Anh Hùng',
                    originalTitle: 'The Avengers',
                    year: 2012,
                    poster: 'https://placehold.co/300x450/ffe5ec/ff3e79?text=Bi%E1%BB%87t%20%C4%90%E1%BB%99i%20Si%C3%AAu%20Anh%20H%C3%B9ng',
                    genres: ['Hành động', 'Siêu anh hùng'],
                    type: 'single'
                }
            ];
            
            // Sử dụng dữ liệu mẫu cho chức năng tìm kiếm
            allMovies = moreMovies;
            
            // Ẩn kết quả tìm kiếm sau khi tải xong nếu đang tìm kiếm
            if (isSearching) {
                searchResults.classList.remove('visible');
                setTimeout(() => {
                    searchResults.style.display = 'none';
                }, 300);
            }
            
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu phim:', error);
            // Nếu có lỗi, vẫn sử dụng dữ liệu mẫu
            allMovies = sampleMovies;
            
            if (searchResults.style.display === 'block') {
                searchResults.classList.remove('visible');
                setTimeout(() => {
                    searchResults.style.display = 'none';
                }, 300);
            }
        }
    }
    
    // Tải dữ liệu phim ngay khi trang được tải - đảm bảo tải trước dữ liệu
    setTimeout(() => {
        loadMovies();
    }, 100);
    
    // Bắt sự kiện click vào nút tìm kiếm
    if (searchButton && searchBar) {
        searchButton.addEventListener('click', () => {
            performSearch();
        });
        
        // Bắt sự kiện nhấn Enter trong ô tìm kiếm
        searchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Bắt sự kiện khi người dùng nhập vào ô tìm kiếm
        searchBar.addEventListener('input', () => {
            const searchTerm = searchBar.value.trim();
            
            // Nếu ô tìm kiếm trống, ẩn kết quả tìm kiếm
            if (!searchTerm) {
                searchResults.classList.remove('visible');
                setTimeout(() => {
                    if (!searchBar.value.trim()) {
                        searchResults.style.display = 'none';
                    }
                }, 300); // Delay phù hợp với thời gian transition
                return;
            }
            
            // Hủy bỏ bất kỳ timeout trước đó
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            
            // Đặt timeout mới để đảm bảo chức năng tìm kiếm không được gọi liên tục
            searchTimeout = setTimeout(() => {
                performSearch();
                searchTimeout = null;
            }, 500); // Độ trễ 500ms
        });
        
        // Ẩn kết quả tìm kiếm khi click ra ngoài
        document.addEventListener('click', (e) => {
            if (!searchBar.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('visible');
                setTimeout(() => {
                    searchResults.style.display = 'none';
                }, 300); // Delay phù hợp với thời gian transition
            }
        });
    }
    
    // Hàm thực hiện tìm kiếm
    async function performSearch() {
        const searchTerm = searchBar.value.trim();
        
        if (!searchTerm) {
            searchResults.classList.remove('visible');
            setTimeout(() => {
                if (!searchBar.value.trim()) {
                    searchResults.style.display = 'none';
                }
            }, 300); // Delay phù hợp với thời gian transition
            return;
        }
        
        // Hiển thị trạng thái đang tải
        if (searchResults.style.display !== 'block') {
            searchResults.style.display = 'block';
            // Trì hoãn việc thêm class visible để trigger animation
            setTimeout(() => {
                searchResults.classList.add('visible');
            }, 10);
        }
        
        searchResultsContainer.innerHTML = `
            <div class="search-loading">
                <i class="fas fa-spinner"></i>
                <p>Đang tìm kiếm...</p>
            </div>
        `;
        
        // Độ trễ nhỏ để hiển thị trạng thái đang tải rõ ràng hơn
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Đảm bảo dữ liệu phim đã được tải
        if (allMovies.length === 0) {
            await loadMovies();
        }
        
        // Tìm kiếm phim khớp với từ khóa
        const filteredMovies = allMovies.filter(movie => 
            (movie.title && movie.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (movie.originalTitle && movie.originalTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (movie.genres && movie.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase())))
        );
        
        // Kiểm tra xem searchTerm có còn khớp với giá trị hiện tại không
        // Nếu người dùng đã thay đổi từ khóa tìm kiếm trong quá trình đợi, bỏ qua kết quả này
        if (searchTerm !== searchBar.value.trim()) {
            return;
        }
        
        // Giới hạn số lượng kết quả hiển thị
        const limitedResults = filteredMovies.slice(0, 10);
        
        // Chuẩn bị HTML kết quả trước khi cập nhật DOM
        let resultsHTML = '';
        
        if (limitedResults.length > 0) {
            resultsHTML = limitedResults.map(movie => `
                <div class="search-movie-item" data-title="${movie.title}" data-type="${movie.type}">
                    <div class="search-movie-poster">
                        <img src="${movie.poster || `/images/${movie.id || '1'}.jpg`}" alt="${movie.title}">
                    </div>
                    <div class="search-movie-info">
                        <div class="search-movie-title">${movie.title}</div>
                        <div class="search-movie-original-title">${movie.originalTitle || ''}</div>
                        <div class="search-movie-year">${movie.year || '2023'} ${movie.type === 'series' ? '• Phim bộ' : '• Phim lẻ'}</div>
                    </div>
                </div>
            `).join('');
            
            // Thêm thông báo nếu có nhiều kết quả hơn giới hạn
            if (filteredMovies.length > limitedResults.length) {
                resultsHTML += `
                    <div class="search-more-results">
                        <p>Hiển thị ${limitedResults.length} trong số ${filteredMovies.length} kết quả</p>
                    </div>
                `;
            }
        } else {
            resultsHTML = `
                <div class="no-search-results">
                    <p>Không tìm thấy kết quả nào cho "${searchTerm}"</p>
                </div>
            `;
        }
        
        // Cập nhật DOM một lần duy nhất
        searchResultsContainer.innerHTML = resultsHTML;
        
        // Thêm sự kiện click cho mỗi kết quả tìm kiếm
        document.querySelectorAll('.search-movie-item').forEach(item => {
            item.addEventListener('click', function() {
                const movieTitle = this.getAttribute('data-title');
                const movieType = this.getAttribute('data-type');
                // Chuyển hướng đến trang chi tiết phim
                window.location.href = `chi-tiet-phim.html?title=${encodeURIComponent(movieTitle)}&type=${movieType}`;
            });
        });
    }
    
    // Thêm hiệu ứng hover cho thẻ phim
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('click', () => {
            // Trong triển khai thực tế, sẽ chuyển đến trang chi tiết phim
            const movieTitle = card.querySelector('.movie-title').textContent;
            alert(`Bạn đã chọn phim: ${movieTitle}`);
        });
    });
    
    // Tự động chuyển slide banner
    setInterval(() => {
        if (totalSlides > 1) {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }
    }, 5000); // Chuyển slide sau mỗi 5 giây
    
    // Thêm event listener cho sự kiện resize
    window.addEventListener('resize', function() {
        // Gọi lại hàm updateSlider để điều chỉnh background-size
        updateSlider();
    });
    
    // Xử lý hiệu ứng header khi cuộn
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) { // Khi cuộn xuống khoảng 50px
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});


// // Hàm cập nhật URL với tham số trang
// function updateURL(params) {
//     const url = new URL(window.location);
    
//     // Xóa tham số cũ
//     url.searchParams.delete('type');
//     url.searchParams.delete('slug');
    
//     // Thêm tham số mới nếu có
//     if (params.type) {
//         url.searchParams.set('type', params.type);
//     }
    
//     if (params.slug) {
//         url.searchParams.set('slug', params.slug);
//     }
    
//     // Cập nhật URL mà không tải lại trang
//     window.history.pushState({}, '', url);
// }

// // Hàm đọc tham số từ URL
// function getParamsFromURL() {
//     const params = new URLSearchParams(window.location.search);
//     return {
//         type: params.get('type'),
//         slug: params.get('slug')
//     };
// }

// Hàm để lấy dữ liệu từ file data.json
function fetchData() {
    fetch('public/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu');
            }
            return response.json();
        })
        .then(data => {
            // Giả sử dữ liệu là một mảng các đối tượng
            const names = data.map(item => item.name); // Lấy thuộc tính name
            console.log(names); // In ra danh sách tên để kiểm tra
            setupSearch(names); // Thiết lập chức năng tìm kiếm
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}

// Hàm để thiết lập chức năng tìm kiếm
function setupSearch(names) {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results');

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const filteredNames = names.filter(name => name.toLowerCase().includes(query));

        // Hiển thị kết quả tìm kiếm
        resultsContainer.innerHTML = filteredNames.map(name => `<div>${name}</div>`).join('');
    });
}

// Gọi hàm fetchData khi trang được tải
document.addEventListener('DOMContentLoaded', fetchData);

