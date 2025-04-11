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
    
    if (searchButton && searchBar) {
        searchButton.addEventListener('click', () => {
            performSearch();
        });
        
        searchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const searchTerm = searchBar.value.trim();
        if (searchTerm) {
            // Cho mục đích demo, chúng ta chỉ hiển thị thông báo
            // Trong triển khai thực tế, sẽ chuyển đến trang kết quả tìm kiếm
            console.log(`Tìm kiếm: ${searchTerm}`);
            alert(`Bạn đã tìm kiếm: ${searchTerm}`);
        }
    }
    
    // Mô phỏng chức năng nút đăng nhập
    const loginButton = document.querySelector('.login-button button');
    
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            // Trong triển khai thực tế, sẽ hiển thị form đăng nhập hoặc chuyển đến trang đăng nhập
            alert('Chức năng đăng nhập sẽ được hiển thị ở đây');
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
   
    // Thêm code để lấy danh sách thể loại cho category-grid
    const categoryGrid = document.querySelector('.category-grid');
    if (categoryGrid) {
        populateCategoryGrid(categoryGrid);
    }
    
    // Hàm để lấy và hiển thị danh sách thể loại trong category-grid
    function populateCategoryGrid(gridElement) {
        fetch('https://phimapi.com/the-loai')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến API');
                }
                return response.json();
            })
            .then(data => {
                // Xóa nội dung hiện tại
                gridElement.innerHTML = '';
                
                // Thêm các thể loại từ API
                data.forEach(genre => {
                    const categoryCard = document.createElement('a');
                    categoryCard.href = `/the-loai/${genre.slug}`;
                    categoryCard.className = 'category-card';
                    categoryCard.textContent = genre.name;
                    gridElement.appendChild(categoryCard);
                });
            })
            .catch(error => {
                console.error('Lỗi khi tải danh sách thể loại cho lưới:', error);
                
                // Xóa nội dung hiện tại
                gridElement.innerHTML = '';
                
                // Thêm các thể loại mẫu
                sampleGenres.forEach(genre => {
                    const categoryCard = document.createElement('a');
                    categoryCard.href = `/the-loai/${genre.slug}`;
                    categoryCard.className = 'category-card';
                    categoryCard.textContent = genre.name;
                    gridElement.appendChild(categoryCard);
                });
            });
    }
    
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
    
    // Thêm event listener cho từng link
    const links = document.querySelectorAll('.category-card');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Đóng tất cả dropdown trước khi mở dropdown mới
            document.querySelectorAll('.dropdown').forEach(d => {
                d.classList.remove('dropdown-active');
            });
            
            // Lấy slug của thể loại
            const slug = this.getAttribute('data-slug');
            const name = this.textContent;
            
            // Hiển thị phim theo thể loại
            if (urlPrefix === 'the-loai') {
                fetchMoviesByGenre(slug, name);
            } else if (urlPrefix === 'quoc-gia') {
                fetchMoviesByCountry(slug, name);
            }
        });
    });
});

function fetchMoviesByGenre(genreSlug, genreName) {
    // ...
    
    // Gọi API để lấy phim theo thể loại
    const apiUrl = `https://phimapi.com/v1/api/the-loai/${genreSlug}?page=1&limit=30`;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể kết nối đến API');
            }
            return response.json();
        })
        .then(data => {
            displayMovies(data);
        })
        .catch(error => {
            // Xử lý lỗi...
        });
} 
async function fetchMovieDetail(slug) {
    hideMovieList();
    movieDetail.innerHTML = '<p>Đang tải thông tin phim...</p>';
    
    // Cập nhật URL với slug phim
    updateURL({ type: currentMovieType, slug: slug });
    
    try {
        // Gọi API để lấy thông tin chi tiết phim
        const response = await fetch(`https://phimapi.com/v1/api/phim/${slug}`);
        const data = await response.json();
        
        if (data && data.status === 'success' && data.data && data.data.item) {
            const movie = data.data.item;
            displayMovieDetail(movie);
        } else {
            // Thử endpoint thứ hai nếu endpoint đầu tiên không thành công
            try {
                const secondResponse = await fetch(`https://phimapi.com/phim/${slug}`);
                const secondData = await secondResponse.json();
                
                if (secondData && secondData.status === 'success' && secondData.data && secondData.data.item) {
                    const movie = secondData.data.item;
                    displayMovieDetail(movie);
                } else if (slug === "sinh-menh") {
                    // Sử dụng dữ liệu mẫu nếu cả hai endpoint đều không thành công và phim là "Sinh Mệnh"
                    const mockData = {
                        "id": "5cd39efd738459cf272922dfee67cea",
                        "name": "Sinh Mệnh",
                        "slug": "sinh-menh",
                        "origin_name": "Life",
                        "content": "Trong giai đoạn Chiến tranh Việt Nam (1968-1970), Linh \"gấu\" là linh văn tài trên tuyến đường Trường Sơn, luôn khao khát có con với vợ Là Lới. Khi mẹ và vợ đến thăm nhưng không gặp được nhau, Trường Thịnh tạo ra một tình vè quê bằng cách giao nhiệm vụ với Linh đưa \"gấu\" Linh về Quảng Bình cùng đồng đội hay không. Trên đường đi, bộ đội đã bao đơn vị đã lift và giữ hiện hàng hóa chỉ là giấy trắng dành cho tớ em. Khi đến nơi, Linh chứng kiến anh trai của Nga đã hy sinh. Trên đường về, Linh và Nga nay sinh tình cảm. Không lâu sau, một trận bom cướp đi mạng sống của Linh và Đàn, chỉ còn Nga sống sót. Cô mang thai con của Linh và sinh con trong bệnh viện dã chiến, bên cạnh Lới và mẹ Linh.",
                        "type": "single",
                        "status": "completed",
                        "poster_url": "https://phimimg.com/upload/vod/20250403-1/3c7c0468d6f7ea7970fb2905845fbab2.jpg",
                        "thumb_url": "https://phimimg.com/upload/vod/20250403-1/e17df8b66ed76ef91659fca2f1dcca2.jpg",
                        "is_copyright": false,
                        "sub_docquyen": false,
                        "chieurap": false,
                        "trailer_url": "https://www.youtube.com/watch?v=AGaXLEM5HFE",
                        "time": "78 phút",
                        "episode_current": "Full",
                        "episode_total": "1",
                        "quality": "HD",
                        "lang": "Vietsub",
                        "notify": "",
                        "showtimes": "",
                        "year": 2006,
                        "view": 0,
                        "actor": [
                            "Võ Thanh Tâm",
                            "Kiều Thanh",
                            "Nguyễn Kim Trang",
                            "Phạm Thanh Thủy"
                        ],
                        "director": [
                            "Đào Duy Phúc"
                        ],
                        "category": [
                            {"name": "Chiến Tranh", "slug": "chien-tranh"},
                            {"name": "Tình Cảm", "slug": "tinh-cam"},
                            {"name": "Tâm Lý", "slug": "tam-ly"}
                        ],
                        "country": [
                            {"name": "Việt Nam", "slug": "viet-nam"}
                        ]
                    };
                    displayMovieDetail(mockData);
                } else {
                    movieDetail.innerHTML = '<p>Không thể tải thông tin chi tiết phim. Vui lòng thử lại sau.</p>';
                }
            } catch (secondError) {
                console.error('Lỗi khi thử endpoint thứ hai:', secondError);
                
                if (slug === "sinh-menh") {
                    // Sử dụng dữ liệu mẫu nếu cả hai endpoint đều không thành công và phim là "Sinh Mệnh"
                    const mockData = {
                        "id": "5cd39efd738459cf272922dfee67cea",
                        "name": "Sinh Mệnh",
                        "slug": "sinh-menh",
                        "origin_name": "Life",
                        "content": "Trong giai đoạn Chiến tranh Việt Nam (1968-1970), Linh \"gấu\" là linh văn tài trên tuyến đường Trường Sơn, luôn khao khát có con với vợ Là Lới. Khi mẹ và vợ đến thăm nhưng không gặp được nhau, Trường Thịnh tạo ra một tình vè quê bằng cách giao nhiệm vụ với Linh đưa \"gấu\" Linh về Quảng Bình cùng đồng đội hay không. Trên đường đi, bộ đội đã bao đơn vị đã lift và giữ hiện hàng hóa chỉ là giấy trắng dành cho tớ em. Khi đến nơi, Linh chứng kiến anh trai của Nga đã hy sinh. Trên đường về, Linh và Nga nay sinh tình cảm. Không lâu sau, một trận bom cướp đi mạng sống của Linh và Đàn, chỉ còn Nga sống sót. Cô mang thai con của Linh và sinh con trong bệnh viện dã chiến, bên cạnh Lới và mẹ Linh.",
                        "type": "single",
                        "status": "completed",
                        "poster_url": "https://phimimg.com/upload/vod/20250403-1/3c7c0468d6f7ea7970fb2905845fbab2.jpg",
                        "thumb_url": "https://phimimg.com/upload/vod/20250403-1/e17df8b66ed76ef91659fca2f1dcca2.jpg",
                        "is_copyright": false,
                        "sub_docquyen": false,
                        "chieurap": false,
                        "trailer_url": "https://www.youtube.com/watch?v=AGaXLEM5HFE",
                        "time": "78 phút",
                        "episode_current": "Full",
                        "episode_total": "1",
                        "quality": "HD",
                        "lang": "Vietsub",
                        "notify": "",
                        "showtimes": "",
                        "year": 2006,
                        "view": 0,
                        "actor": [
                            "Võ Thanh Tâm",
                            "Kiều Thanh",
                            "Nguyễn Kim Trang",
                            "Phạm Thanh Thủy"
                        ],
                        "director": [
                            "Đào Duy Phúc"
                        ],
                        "category": [
                            {"name": "Chiến Tranh", "slug": "chien-tranh"},
                            {"name": "Tình Cảm", "slug": "tinh-cam"},
                            {"name": "Tâm Lý", "slug": "tam-ly"}
                        ],
                        "country": [
                            {"name": "Việt Nam", "slug": "viet-nam"}
                        ]
                    };
                    displayMovieDetail(mockData);
                } else {
                    movieDetail.innerHTML = '<p>Không thể tải thông tin chi tiết phim. Vui lòng thử lại sau.</p>';
                }
            }
        }
    } catch (error) {
        console.error('Lỗi khi tải thông tin phim:', error);
        movieDetail.innerHTML = '<p>Có lỗi xảy ra khi tải thông tin phim</p>';
    }
}

// Hàm cập nhật URL với tham số trang
function updateURL(params) {
    const url = new URL(window.location);
    
    // Xóa tham số cũ
    url.searchParams.delete('type');
    url.searchParams.delete('slug');
    
    // Thêm tham số mới nếu có
    if (params.type) {
        url.searchParams.set('type', params.type);
    }
    
    if (params.slug) {
        url.searchParams.set('slug', params.slug);
    }
    
    // Cập nhật URL mà không tải lại trang
    window.history.pushState({}, '', url);
}

// Hàm đọc tham số từ URL
function getParamsFromURL() {
    const params = new URLSearchParams(window.location.search);
    return {
        type: params.get('type'),
        slug: params.get('slug')
    };
}

// Hàm hiển thị chi tiết phim
function displayMovieDetail(movie) {
    // In ra console để kiểm tra dữ liệu
    console.log('Chi tiết phim:', movie);
    
    // Xử lý trường hợp category hoặc country không phải mảng hoặc không tồn tại
    let categories = '';
    if (movie.category && Array.isArray(movie.category)) {
        categories = movie.category.map(cat => `<span class="category-tag">${cat.name || cat}</span>`).join('');
    } else if (typeof movie.category === 'string') {
        categories = `<span class="category-tag">${movie.category}</span>`;
    }
    
    let countries = '';
    if (movie.country && Array.isArray(movie.country)) {
        countries = movie.country.map(country => `<span class="country-tag">${country.name || country}</span>`).join('');
    } else if (typeof movie.country === 'string') {
        countries = `<span class="country-tag">${movie.country}</span>`;
    }
    
    // Xử lý trường hợp actor và director
    let actors = '';
    if (movie.actor && Array.isArray(movie.actor)) {
        actors = `
            <div>
                <p><strong>Diễn viên:</strong></p>
                <p>${movie.actor.join(', ')}</p>
            </div>
        `;
    }
    
    let directors = '';
    if (movie.director && Array.isArray(movie.director)) {
        directors = `
            <div>
                <p><strong>Đạo diễn:</strong></p>
                <p>${movie.director.join(', ')}</p>
            </div>
        `;
    }
    
    const posterUrl = movie.poster_url.startsWith('http') 
        ? movie.poster_url 
        : `https://phimimg.com/${movie.poster_url}`;
        
    // Xử lý hiển thị tiến trình tập và danh sách tập phim
    let episodeProgress = '';
    let episodeList = '';
    
    // Kiểm tra và hiển thị tiến trình tập phim
    if (movie.episode_current && movie.episode_total && movie.type !== 'single') {
        // Tính tiến trình tập
        let currentEpisode = 0;
        
        // Kiểm tra nếu episode_current có dạng "Tập X/Y" hoặc tương tự
        if (movie.episode_current.includes('/')) {
            currentEpisode = parseInt(movie.episode_current.split('/')[0].replace(/\D/g, '')) || 0;
        } else {
            // Nếu không có dấu /, thì lấy số từ chuỗi
            currentEpisode = parseInt(movie.episode_current.replace(/\D/g, '')) || 0;
        }
        
        const totalEpisode = parseInt(movie.episode_total) || 0;
        const progressPercent = totalEpisode > 0 ? (currentEpisode / totalEpisode) * 100 : 0;
        
        episodeProgress = `
            <div class="episode-progress">
                <p><strong>Tiến trình:</strong> ${currentEpisode}/${totalEpisode} tập (${progressPercent.toFixed(0)}%)</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progressPercent}%"></div>
                </div>
            </div>
        `;
    }
    
    // Xử lý cấu trúc episodes đặc biệt dựa trên dữ liệu API
    if (movie.episodes && Array.isArray(movie.episodes) && movie.episodes.length > 0) {
        console.log('Danh sách episodes:', movie.episodes);
        
        // Duyệt qua mỗi máy chủ (server) và hiển thị tất cả các tập từ mỗi máy chủ
        const serverSections = movie.episodes.map(server => {
            if (!server.server_data || !Array.isArray(server.server_data) || server.server_data.length === 0) {
                return '';
            }
            
            // Tạo danh sách tập cho server này
            const episodeItems = server.server_data.map(episode => `
                <a href="${episode.link_embed || episode.link_m3u8 || '#'}" target="_blank" class="episode-item">
                    ${episode.name || 'Tập ' + episode.episode || 'Tập phim'}
                </a>
            `).join('');
            
            return `
                <div class="server-episodes">
                    <h4>${server.server_name || 'Server'}</h4>
                    <div class="episodes">
                        ${episodeItems}
                    </div>
                </div>
            `;
        }).join('');
        
        if (serverSections) {
            if (movie.type !== 'single') {
                // Phim bộ - hiển thị tất cả các tập từ tất cả các server
                episodeList = `
                    <div class="episode-list">
                        <h3>Danh sách tập</h3>
                        ${serverSections}
                    </div>
                `;
            } else {
                // Phim lẻ - lấy link từ tập đầu tiên của server đầu tiên
                const firstServer = movie.episodes[0];
                const firstEpisode = firstServer.server_data && firstServer.server_data.length > 0 ? firstServer.server_data[0] : null;
                
                if (firstEpisode && (firstEpisode.link_embed || firstEpisode.link_m3u8)) {
                    episodeList = `
                        <div class="watch-movie">
                            <a href="${firstEpisode.link_embed || firstEpisode.link_m3u8}" target="_blank" class="watch-button">
                                Xem phim (${firstServer.server_name || 'Server 1'})
                            </a>
                        </div>
                        <div class="episode-list">
                            <h3>Các phiên bản khác</h3>
                            ${serverSections}
                        </div>
                    `;
                }
            }
        }
    } else if (movie.server_data && Array.isArray(movie.server_data) && movie.server_data.length > 0) {
        // Cấu trúc API cũ
        console.log('Server data (cấu trúc cũ):', movie.server_data);
        
        // Lấy server đầu tiên có episodes
        const serverWithEpisodes = movie.server_data.find(server => server.server_name && server.episodes && server.episodes.length > 0);
        
        if (serverWithEpisodes) {
            if (movie.type !== 'single') {
                // Phim bộ - Hiển thị tất cả các tập
                episodeList = `
                    <div class="episode-list">
                        <h3>Danh sách tập (${serverWithEpisodes.server_name})</h3>
                        <div class="episodes">
                            ${serverWithEpisodes.episodes.map(ep => `
                                <a href="${ep.link_embed || ep.link_m3u8 || '#'}" target="_blank" class="episode-item">
                                    Tập ${ep.name || ep.episode || ''}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else {
                // Phim lẻ - Hiển thị nút xem phim
                episodeList = `
                    <div class="watch-movie">
                        <a href="${serverWithEpisodes.episodes[0].link_embed || serverWithEpisodes.episodes[0].link_m3u8 || '#'}" target="_blank" class="watch-button">
                            Xem phim (${serverWithEpisodes.server_name})
                        </a>
                    </div>
                `;
            }
        }
    }
    
    const detailHTML = `
        <div class="back-button" id="backButton">← Quay lại</div>
        <div class="movie-detail-header">
            <div class="movie-detail-poster">
                <img src="${posterUrl}" alt="${movie.name}">
            </div>
            <div class="movie-detail-info">
                <h1 class="movie-detail-title">${movie.name}</h1>
                <h2 class="movie-detail-original-title">${movie.origin_name}</h2>
                
                <div class="movie-detail-meta">
                    <p><strong>Năm sản xuất:</strong> ${movie.year}</p>
                    <p><strong>Thời lượng:</strong> ${movie.time}</p>
                    <p><strong>Chất lượng:</strong> ${movie.quality}</p>
                    <p><strong>Ngôn ngữ:</strong> ${movie.lang}</p>
                    ${movie.episode_current ? `<p><strong>Tập hiện tại:</strong> ${movie.episode_current}</p>` : ''}
                    ${movie.episode_total ? `<p><strong>Tổng số tập:</strong> ${movie.episode_total}</p>` : ''}
                    ${movie.type ? `<p><strong>Loại:</strong> ${movie.type === 'single' ? 'Phim lẻ' : 'Phim bộ'}</p>` : ''}
                </div>
                
                ${episodeProgress}
                
                ${categories ? `
                <div>
                    <p><strong>Thể loại:</strong></p>
                    <div class="movie-detail-categories">${categories}</div>
                </div>` : ''}
                
                ${countries ? `
                <div>
                    <p><strong>Quốc gia:</strong></p>
                    <div class="movie-detail-countries">${countries}</div>
                </div>` : ''}
                
                ${actors}
                ${directors}
                
                ${movie.content ? `
                <div class="movie-detail-description">
                    <h3>Nội dung phim</h3>
                    <p>${movie.content}</p>
                </div>` : ''}
                
                ${movie.trailer_url ? `
                <div class="movie-trailer">
                    <h3>Trailer</h3>
                    <a href="${movie.trailer_url}" target="_blank" class="trailer-button">Xem trailer</a>
                </div>` : ''}
                
                ${episodeList}
            </div>
        </div>
    `;
    
    movieDetail.innerHTML = detailHTML;
    
    // Thêm sự kiện click cho nút quay lại
    document.getElementById('backButton').addEventListener('click', () => {
        showMovieList();
    });
}

// Hàm thêm sự kiện click cho các thẻ phim
function addMovieClickEvents() {
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
        card.addEventListener('click', () => {
            const slug = card.dataset.slug;
            if (slug) {
                fetchMovieDetail(slug);
            }
        });
    });
}

// Ẩn danh sách phim, hiện chi tiết phim
function hideMovieList() {
    movieList.style.display = 'none';
    movieDetail.style.display = 'block';
}

// Hiện danh sách phim, ẩn chi tiết phim
function showMovieList() {
    movieList.style.display = 'grid';
    movieDetail.style.display = 'none';
    
    // Cập nhật URL để loại bỏ slug phim khi quay lại danh sách
    updateURL({ type: currentMovieType, slug: null });
}
