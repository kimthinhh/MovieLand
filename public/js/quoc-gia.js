document.addEventListener('DOMContentLoaded', function() {
    // Các biến cho phân trang
    let currentPage = 1;
    const itemsPerPage = 30;
    let totalPages = 0;
    
    // Biến lưu thông tin quốc gia hiện tại
    let currentCountry = {
        slug: '',
        name: 'Quốc Gia'
    };

    // Các selector DOM
    const moviesContainer = document.getElementById('movies-container');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    const countryTitle = document.getElementById('country-title');
    const countryDescription = document.getElementById('country-description');
    
    // Các bộ lọc
    const genreFilter = document.getElementById('genre-filter');
    const yearFilter = document.getElementById('year-filter');
    const sortFilter = document.getElementById('sort-filter');

    // Lấy thông tin quốc gia từ URL
    function getCountryFromUrl() {
        // Lấy tham số slug từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        const name = urlParams.get('name') || 'Quốc Gia';
        
        if (slug) {
            currentCountry = {
                slug: slug,
                name: decodeURIComponent(name)
            };
            
            // Cập nhật tiêu đề trang
            document.title = `Phim ${currentCountry.name} - MovieLand`;
            countryTitle.textContent = `Phim ${currentCountry.name}`;
            countryDescription.textContent = `Danh sách phim quốc gia ${currentCountry.name}, cập nhật mới nhất`;
        } else {
            // Chuyển hướng về trang chủ nếu không có thông tin quốc gia
            window.location.href = 'index.html';
        }
    }

    // Lấy danh sách thể loại từ API để điền vào bộ lọc
    function fetchGenreOptions() {
        fetch('https://phimapi.com/the-loai')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến API thể loại');
                }
                return response.json();
            })
            .then(data => {
                // Sắp xếp danh sách
                const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
                
                // Thêm các option mới từ API
                sortedData.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre.slug;
                    option.textContent = genre.name;
                    genreFilter.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Lỗi khi tải danh sách thể loại:', error);
                
                // Dữ liệu mẫu cho thể loại
                const sampleGenres = [
                    { name: "Hành Động", slug: "hanh-dong" },
                    { name: "Tình Cảm", slug: "tinh-cam" },
                    { name: "Hài Hước", slug: "hai-huoc" },
                    { name: "Cổ Trang", slug: "co-trang" },
                    { name: "Tâm Lý", slug: "tam-ly" },
                    { name: "Hình Sự", slug: "hinh-su" },
                    { name: "Chiến Tranh", slug: "chien-tranh" },
                    { name: "Thể Thao", slug: "the-thao" },
                    { name: "Võ Thuật", slug: "vo-thuat" },
                    { name: "Viễn Tưởng", slug: "vien-tuong" },
                    { name: "Phiêu Lưu", slug: "phieu-luu" },
                    { name: "Khoa Học", slug: "khoa-hoc" },
                    { name: "Kinh Dị", slug: "kinh-di" },
                    { name: "Âm Nhạc", slug: "am-nhac" },
                    { name: "Thần Thoại", slug: "than-thoai" },
                    { name: "Tài Liệu", slug: "tai-lieu" },
                    { name: "Gia Đình", slug: "gia-dinh" },
                    { name: "Học Đường", slug: "hoc-duong" }
                ];
                
                // Thêm các option từ dữ liệu mẫu
                sampleGenres.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre.slug;
                    option.textContent = genre.name;
                    genreFilter.appendChild(option);
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
    genreFilter.addEventListener('change', resetAndFetch);
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
        let apiUrl = `https://phimapi.com/v1/api/quoc-gia/${currentCountry.slug}?page=${currentPage}&limit=${itemsPerPage}`;
        
        // Thêm các tham số bộ lọc nếu được chọn
        const genre = genreFilter.value;
        const year = yearFilter.value;
        const sort = sortFilter.value;
        
        if (genre) apiUrl += `&genre=${genre}`;
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
            moviesContainer.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>${data.msg || 'Không tìm thấy phim thuộc quốc gia này.'}</p></div>`;
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

        // Thay đổi nội dung của container
        moviesContainer.innerHTML = moviesHTML;
        
        // Thêm sự kiện click cho các card phim
        document.querySelectorAll('.movie-card').forEach(card => {
            card.addEventListener('click', function() {
                const movieId = this.getAttribute('data-id');
                const movieSlug = this.getAttribute('data-slug');
                // Chuyển hướng đến trang chi tiết phim
                window.location.href = `chi-tiet-phim.html?slug=${movieSlug}`;
            });
        });
    }

    // Hiển thị dữ liệu phim mẫu trong trường hợp không thể kết nối đến API
    function displaySampleMovies() {
        const sampleMovies = [
            {
                id: "sample1",
                name: "Phim Mẫu 1",
                year: "2023",
                quality: "HD",
                episode_current: "Full",
                poster_url: null,
                category: [{ name: "Hành Động" }, { name: "Phiêu Lưu" }],
                country: [{ name: currentCountry.name }]
            },
            {
                id: "sample2",
                name: "Phim Mẫu 2",
                year: "2023",
                quality: "HD",
                episode_current: "22/22",
                poster_url: null,
                category: [{ name: "Tình Cảm" }, { name: "Tâm Lý" }],
                country: [{ name: currentCountry.name }]
            },
            {
                id: "sample3",
                name: "Phim Mẫu 3",
                year: "2023",
                quality: "HD",
                episode_current: "Full",
                poster_url: null,
                category: [{ name: "Hài Hước" }],
                country: [{ name: currentCountry.name }]
            },
            {
                id: "sample4",
                name: "Phim Mẫu 4",
                year: "2022",
                quality: "HD",
                episode_current: "16/16",
                poster_url: null,
                category: [{ name: "Cổ Trang" }, { name: "Võ Thuật" }],
                country: [{ name: currentCountry.name }]
            },
            {
                id: "sample5",
                name: "Phim Mẫu 5",
                year: "2022",
                quality: "HD",
                episode_current: "Full",
                poster_url: null,
                category: [{ name: "Kinh Dị" }, { name: "Hình Sự" }],
                country: [{ name: currentCountry.name }]
            },
            {
                id: "sample6",
                name: "Phim Mẫu 6",
                year: "2022",
                quality: "HD",
                episode_current: "10/10",
                poster_url: null,
                category: [{ name: "Viễn Tưởng" }],
                country: [{ name: currentCountry.name }]
            }
        ];

        const data = {
            items: sampleMovies
        };

        displayMovies(data);
    }

    // Xử lý vấn đề CORS (nếu API không cho phép truy cập)
    function handleCorsIssue() {
        console.warn('Không thể kết nối đến API do vấn đề CORS, hiển thị dữ liệu mẫu.');
        displaySampleMovies();
    }

    // Khởi tạo trang
    function initPage() {
        try {
            // Lấy thông tin quốc gia từ URL
            getCountryFromUrl();
            
            // Lấy danh sách thể loại
            fetchGenreOptions();
            
            // Tải danh sách phim
            fetchMovies();
        } catch (error) {
            console.error('Lỗi khởi tạo trang:', error);
            handleCorsIssue();
        }
    }

    // Bắt đầu chạy ứng dụng
    initPage();
}); 