document.addEventListener('DOMContentLoaded', function() {
    // Các biến cho phân trang
    let currentPage = 1;
    const itemsPerPage = 30;
    let totalPages = 0;
    
    // Biến lưu thông tin thể loại hiện tại
    let currentGenre = {
        slug: '',
        name: 'Thể Loại'
    };

    // Các selector DOM
    const moviesContainer = document.getElementById('movies-container');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    const genreTitle = document.getElementById('genre-title');
    const genreDescription = document.getElementById('genre-description');
    
    // Các bộ lọc
    const countryFilter = document.getElementById('country-filter');
    const yearFilter = document.getElementById('year-filter');
    const sortFilter = document.getElementById('sort-filter');

    // Lấy thông tin thể loại từ URL
    function getGenreFromUrl() {
        // Lấy tham số slug từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        const name = urlParams.get('name') || 'Thể Loại';
        
        if (slug) {
            currentGenre = {
                slug: slug,
                name: decodeURIComponent(name)
            };
            
            // Cập nhật tiêu đề trang
            document.title = ` ${currentGenre.name} - MovieLand`;
            genreTitle.textContent = ` ${currentGenre.name}`;
            genreDescription.textContent = `Danh sách phim thể loại ${currentGenre.name}, cập nhật mới nhất`;
        } else {
            // Chuyển hướng về trang chủ nếu không có thông tin thể loại
            window.location.href = 'index.html';
        }
    }

    // Lấy danh sách quốc gia từ API để điền vào bộ lọc
    function fetchCountryOptions() {
        fetch('https://phimapi.com/quoc-gia')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến API quốc gia');
                }
                return response.json();
            })
            .then(data => {
                // Sắp xếp danh sách, đưa "quốc gia khác" xuống cuối
                const sortedData = [...data];
                const otherCountryIndex = sortedData.findIndex(country => country.name === "Quốc Gia Khác");
                
                if (otherCountryIndex !== -1) {
                    const otherCountry = sortedData.splice(otherCountryIndex, 1)[0];
                    sortedData.push(otherCountry);
                }
                
                // Thêm các option mới từ API
                sortedData.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.slug;
                    option.textContent = country.name;
                    countryFilter.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Lỗi khi tải danh sách quốc gia:', error);
                
                // Dữ liệu mẫu cho quốc gia
                const sampleCountries = [
                    { name: "Việt Nam", slug: "viet-nam" },
                    { name: "Trung Quốc", slug: "trung-quoc" },
                    { name: "Hàn Quốc", slug: "han-quoc" },
                    { name: "Nhật Bản", slug: "nhat-ban" },
                    { name: "Thái Lan", slug: "thai-lan" },
                    { name: "Mỹ", slug: "my" },
                    { name: "Anh", slug: "anh" },
                    { name: "Pháp", slug: "phap" },
                    { name: "Ấn Độ", slug: "an-do" },
                    { name: "Quốc Gia Khác", slug: "quoc-gia-khac" }
                ];
                
                // Thêm các option từ dữ liệu mẫu
                sampleCountries.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.slug;
                    option.textContent = country.name;
                    countryFilter.appendChild(option);
                });
            });
    }

    // Thêm sự kiện cho nút phân trang
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchMovies();
            // Cuộn lên đầu trang sau khi chuyển trang
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchMovies();
            // Cuộn lên đầu trang sau khi chuyển trang
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Thêm sự kiện cho bộ lọc
    countryFilter.addEventListener('change', resetAndFetch);
    yearFilter.addEventListener('change', resetAndFetch);
    sortFilter.addEventListener('change', resetAndFetch);

    // Reset trang và fetch lại khi lọc
    function resetAndFetch() {
        currentPage = 1;
        fetchMovies();
    }

    // Fetch dữ liệu phim từ API
    function fetchMovies() {
        // Hiển thị loading
        moviesContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Đang tải phim...</p>
            </div>
        `;

        // Cập nhật hiển thị trang hiện tại
        currentPageSpan.textContent = `Trang ${currentPage}`;
        
        // Vô hiệu hóa nút phân trang nếu cần
        prevPageBtn.disabled = currentPage === 1;
        
        // Tạo URL với tham số bộ lọc
        let apiUrl = `https://phimapi.com/v1/api/the-loai/${currentGenre.slug}?page=${currentPage}&limit=${itemsPerPage}`;
        
        // Thêm các tham số bộ lọc nếu được chọn
        const country = countryFilter.value;
        const year = yearFilter.value;
        const sort = sortFilter.value;
        
        if (country) apiUrl += `&country=${country}`;
        if (year) apiUrl += `&year=${year}`;
        if (sort) apiUrl += `&sort=${sort}`;

        // Gọi API để lấy dữ liệu
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến API');
                }
                return response.json();
            })
            .then(data => {
                // Xử lý dữ liệu và hiển thị phim
                displayMovies(data);
                
                // Cập nhật thông tin phân trang
                if (data.data && data.data.params && data.data.params.pagination) {
                    totalPages = data.data.params.pagination.totalPages;
                    nextPageBtn.disabled = currentPage >= totalPages;
                }
            })
            .catch(error => {
                // Hiển thị lỗi nếu có
                moviesContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>${error.message || 'Đã xảy ra lỗi khi tải dữ liệu phim.'}</p>
                        <button id="retry-btn">Thử lại</button>
                    </div>
                `;
                
                // Thêm sự kiện thử lại
                document.getElementById('retry-btn').addEventListener('click', fetchMovies);
            });
    }

    // Hiển thị danh sách phim
    function displayMovies(data) {
        // Kiểm tra nếu có lỗi từ API
        if (data.status === 'error') {
            moviesContainer.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>${data.msg || 'Không tìm thấy phim thuộc thể loại này.'}</p></div>`;
            return;
        }

        // Kiểm tra dữ liệu phim
        const movies = data.data || data;
        
        // Kiểm tra xem có dữ liệu phim không hoặc nếu là mảng items
        let movieItems = movies;
        if (movies.items) {
            movieItems = movies.items;
        }

        // Kiểm tra nếu không có phim
        if (!movieItems || movieItems.length === 0) {
            moviesContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-film"></i>
                    <p>Không tìm thấy phim phù hợp</p>
                </div>
            `;
            return;
        }

        // Tạo HTML cho từng phim
        let moviesHTML = '';
        
        movieItems.forEach(movie => {
            const posterUrl = movie.poster_url ? 
                `https://phimimg.com/${movie.poster_url}` : 
                '/images/placeholder.jpg';
            
            const categories = movie.category ? 
                movie.category.map(cat => cat.name).join(', ') : 
                '';
                
            const countries = movie.country ? 
                movie.country.map(c => c.name).join(', ') : 
                '';
            
            moviesHTML += `
                <div class="movie-card" data-id="${movie._id || movie.id}" data-slug="${movie.slug}">
                    <div class="movie-poster" style="background-image: url('${posterUrl}')">
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
        });

        // Cập nhật container phim
        moviesContainer.innerHTML = moviesHTML;
        
        // Thêm sự kiện click cho từng phim
        document.querySelectorAll('.movie-card').forEach(card => {
            card.addEventListener('click', function() {
                const movieId = this.getAttribute('data-id');
                const movieSlug = this.getAttribute('data-slug');
                // Chuyển hướng đến trang chi tiết phim
                window.location.href = `chi-tiet-phim.html?slug=${movieSlug}`;
            });
        });
    }

    // Hiển thị dữ liệu mẫu nếu không lấy được từ API
    function displaySampleMovies() {
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

        // Tạo HTML cho các phim mẫu
        let moviesHTML = '';
        
        sampleMovies.forEach(movie => {
            const categories = movie.category ? 
                movie.category.map(cat => cat.name).join(', ') : 
                '';
                
            const countries = movie.country ? 
                movie.country.map(c => c.name).join(', ') : 
                '';
            
            moviesHTML += `
                <div class="movie-card" data-id="${movie._id}" data-slug="${movie.slug}">
                    <div class="movie-poster" style="background-color: #555; background-position: center;">
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
        });

        // Hiển thị phim mẫu (lặp lại cho đủ số lượng)
        const duplicatedHTML = moviesHTML.repeat(3);
        moviesContainer.innerHTML = duplicatedHTML;
        
        // Cập nhật tổng số trang giả
        totalPages = 5;
        nextPageBtn.disabled = currentPage >= totalPages;
        
        // Thêm sự kiện click cho từng phim mẫu
        document.querySelectorAll('.movie-card').forEach(card => {
            card.addEventListener('click', function() {
                const movieId = this.getAttribute('data-id');
                const movieSlug = this.getAttribute('data-slug');
                // Chuyển hướng đến trang chi tiết phim
                window.location.href = `chi-tiet-phim.html?slug=${movieSlug}`;
            });
        });
    }

    // Xử lý CORS lỗi khi gọi API trực tiếp
    function handleCorsIssue() {
        // Thông báo cho người dùng về vấn đề CORS
        const corsMessage = `
            <div class="cors-warning">
                <h3>Lưu ý về API</h3>
                <p>Do chính sách CORS của trình duyệt, việc gọi API trực tiếp có thể bị chặn. Trong môi trường thực tế, bạn cần:</p>
                <ol>
                    <li>Thiết lập proxy server</li>
                    <li>Hoặc sử dụng API có hỗ trợ CORS</li>
                    <li>Hoặc dùng dữ liệu mẫu từ một tệp JSON cục bộ</li>
                </ol>
                <p>Hiện tại, chúng tôi đang hiển thị dữ liệu mẫu cho thể loại ${currentGenre.name}.</p>
            </div>
        `;
        
        // Hiển thị thông báo
        const infoContainer = document.createElement('div');
        infoContainer.className = 'cors-info-container';
        infoContainer.innerHTML = corsMessage;
        document.querySelector('.page-title').appendChild(infoContainer);
        
        // Sử dụng dữ liệu mẫu thay thế
        displaySampleMovies();
    }

    // Khởi chạy khi trang được tải
    try {
        // Lấy thông tin thể loại từ URL
        getGenreFromUrl();
        
        // Tải danh sách quốc gia cho bộ lọc
        fetchCountryOptions();
        
        // Thử gọi API thực để lấy danh sách phim
        fetchMovies();
        
        // Nếu có lỗi CORS, sử dụng dữ liệu mẫu
        // Đây là phương pháp xử lý tạm thời. Trong thực tế cần proxy server
        setTimeout(() => {
            if (document.querySelector('.error-message')) {
                handleCorsIssue();
            }
        }, 3000);
    } catch (error) {
        console.error('Lỗi khởi tạo:', error);
        displaySampleMovies();
    }
}); 