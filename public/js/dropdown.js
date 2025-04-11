document.addEventListener('DOMContentLoaded', function() {
    // Lấy dropdown elements
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Tạo container để hiển thị phim khi chọn thể loại
    let moviesContainer;
    
    // Kiểm tra xem đã có phần tử hiển thị phim chưa, nếu chưa thì tạo mới
    if (!document.getElementById('genre-movies-container')) {
        moviesContainer = document.createElement('div');
        moviesContainer.id = 'genre-movies-container';
        moviesContainer.className = 'movie-grid';
        moviesContainer.style.marginTop = '50px';
        
        // Tạo section chứa phim
        const moviesSection = document.createElement('section');
        moviesSection.className = 'videos-section';
        
        // Tạo tiêu đề cho phần phim
        const sectionTitle = document.createElement('h2');
        sectionTitle.id = 'genre-title';
        // sectionTitle.textContent = 'Danh sách phim';
        
        moviesSection.appendChild(sectionTitle);
        moviesSection.appendChild(moviesContainer);
        
        // Thêm vào main hoặc body
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.appendChild(moviesSection);
        } else {
            document.body.appendChild(moviesSection);
        }
    } else {
        moviesContainer = document.getElementById('genre-movies-container');
    }
    
    // Khởi tạo dropdown menus
    dropdowns.forEach((dropdown, index) => {
        const toggleElement = dropdown.querySelector('.dropdown-toggle');
        
        // Tạo dropdown menu element
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu';
        dropdown.appendChild(dropdownMenu);
        
        // Xác định loại dropdown (Thể Loại hoặc Quốc Gia)
        if (toggleElement.textContent.includes('Thể Loại')) {
            dropdown.classList.add('genre-dropdown');
            fetchGenres(dropdownMenu);
        } else if (toggleElement.textContent.includes('Quốc Gia')) {
            dropdown.classList.add('country-dropdown');
            fetchCountries(dropdownMenu);
        }
    });
    
    // Lấy danh sách thể loại từ API
    function fetchGenres(menuElement) {
        fetch('https://phimapi.com/the-loai')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến API');
                }
                return response.json();
            })
            .then(data => {
                displayInColumns(data, menuElement, 5, 'genre-column', 'the-loai');
            })
            .catch(error => {
                console.error('Lỗi khi tải danh sách thể loại:', error);
                // Sử dụng dữ liệu mẫu nếu không thể kết nối API
                const sampleGenres = [
                    { name: "Hành Động", slug: "hanh-dong" },
                    { name: "Tình Cảm", slug: "tinh-cam" },
                    { name: "Hài Hước", slug: "hai-huoc" },
                    { name: "Cổ Trang", slug: "co-trang" },
                    { name: "Viễn Tưởng", slug: "vien-tuong" },
                    { name: "Kinh Dị", slug: "kinh-di" },
                    { name: "Hoạt Hình", slug: "hoat-hinh" },
                    { name: "Võ Thuật", slug: "vo-thuat" },
                    { name: "Phiêu Lưu", slug: "phieu-luu" },
                    { name: "Tâm Lý", slug: "tam-ly" },
                    { name: "Bí Ẩn", slug: "bi-an" },
                    { name: "Chiến Tranh", slug: "chien-tranh" },
                    { name: "Hình Sự", slug: "hinh-su" },
                    { name: "Âm Nhạc", slug: "am-nhac" },
                    { name: "Thể Thao", slug: "the-thao" }
                ];
                displayInColumns(sampleGenres, menuElement, 5, 'genre-column', 'the-loai');
            });
    }
    
    // Lấy danh sách quốc gia từ API
    function fetchCountries(menuElement) {
        fetch('https://phimapi.com/quoc-gia')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến API');
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
                
                displayInColumns(sortedData, menuElement, 4, 'country-column', 'quoc-gia');
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
                
                // Đảm bảo mẫu cũng có "Quốc Gia Khác" ở cuối nếu cần
                const sampleOtherCountryIndex = sampleCountries.findIndex(country => country.name === "Quốc Gia Khác");
                if (sampleOtherCountryIndex !== -1) {
                    const otherCountry = sampleCountries.splice(sampleOtherCountryIndex, 1)[0];
                    sampleCountries.push(otherCountry);
                }
                
                displayInColumns(sampleCountries, menuElement, 4, 'country-column', 'quoc-gia');
            });
    }
    
    // Hiển thị danh sách thành nhiều cột
    function displayInColumns(items, menuElement, columnCount, columnClass, urlPrefix) {
        // Tính toán số lượng items mỗi cột
        const totalItems = items.length;
        const itemsPerColumn = Math.ceil(totalItems / columnCount);
        
        // Tạo các cột
        for (let i = 0; i < columnCount; i++) {
            const column = document.createElement('div');
            column.className = `dropdown-column ${columnClass}`;
            
            // Tính toán chỉ số bắt đầu và kết thúc cho mỗi cột
            const startIndex = i * itemsPerColumn;
            const endIndex = Math.min(startIndex + itemsPerColumn, totalItems);
            
            // Thêm các mục vào cột
            for (let j = startIndex; j < endIndex; j++) {
                if (items[j]) {
                    const item = items[j];
                    const link = document.createElement('a');
                    link.className = 'dropdown-link';
                    
                    // Thay đổi href để trỏ tới trang the-loai.html với tham số slug và name
                    if (urlPrefix === 'the-loai') {
                        link.href = `the-loai.html?slug=${item.slug}&name=${encodeURIComponent(item.name)}`;
                    } else {
                        link.href = `#${item.slug}`;
                    }
                    
                    link.textContent = item.name;
                    link.setAttribute('data-slug', item.slug);
                    
                    // Thêm sự kiện click
                    link.addEventListener('click', function(e) {
                        // Chỉ ngăn chặn hành vi mặc định nếu không phải liên kết thể loại
                        if (urlPrefix !== 'the-loai') {
                            e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
                            
                            // Cập nhật tiêu đề phần phim
                            const genreTitle = document.getElementById('genre-title');
                            if (genreTitle) {
                                genreTitle.textContent = `Phim ${item.name}`;
                            }
                            
                            // Cuộn trang đến phần hiển thị phim
                            const moviesSection = document.querySelector('.videos-section');
                            if (moviesSection) {
                                moviesSection.scrollIntoView({ behavior: 'smooth' });
                            }
                            
                            // Lấy và hiển thị danh sách phim theo quốc gia
                            fetchMoviesByCountry(item.slug, item.name);
                        }
                        // Đối với thể loại, để liên kết hoạt động bình thường và chuyển hướng đến trang the-loai.html
                    });
                    
                    column.appendChild(link);
                }
            }
            
            menuElement.appendChild(column);
        }
    }
    
    // Hàm lấy danh sách phim theo thể loại
    function fetchMoviesByGenre(genreSlug, genreName) {
        // Hiển thị trạng thái đang tải
        moviesContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Đang tải phim...</p></div>';
        
        // Gọi API để lấy danh sách phim
        fetch(`https://phimapi.com/v1/api/the-loai/${genreSlug}?page=1&limit=30`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến API');
                }
                return response.json();
            })
            .then(data => {
                // Xóa trạng thái đang tải
                moviesContainer.innerHTML = '';
                
                // Kiểm tra nếu có lỗi từ API
                if (data.status === 'error') {
                    moviesContainer.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>${data.msg || 'Không tìm thấy phim thuộc thể loại này.'}</p></div>`;
                    return;
                }
                
                // Kiểm tra dữ liệu phim
                const movies = data.data || data;
                
                // Kiểm tra nếu không có phim
                if (!movies || movies.length === 0) {
                    moviesContainer.innerHTML = '<div class="no-results"><i class="fas fa-film"></i><p>Không tìm thấy phim nào thuộc thể loại này.</p></div>';
                    return;
                }
                
                // Hiển thị danh sách phim
                movies.forEach(movie => {
                    const movieCard = createMovieCard(movie);
                    moviesContainer.appendChild(movieCard);
                });
            })
            .catch(error => {
                console.error('Lỗi khi tải danh sách phim:', error);
                moviesContainer.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Đã xảy ra lỗi khi tải danh sách phim. Vui lòng thử lại sau.</p></div>';
            });
    }
    
    // Hàm lấy danh sách phim theo quốc gia
    function fetchMoviesByCountry(countrySlug, countryName) {
        // Hiển thị trạng thái đang tải
        moviesContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Đang tải phim...</p></div>';
        
        // Gọi API để lấy danh sách phim
        fetch(`https://phimapi.com/v1/api/quoc-gia/${countrySlug}?page=1&limit=30`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến API');
                }
                return response.json();
            })
            .then(data => {
                // Xóa trạng thái đang tải
                moviesContainer.innerHTML = '';
                
                // Kiểm tra nếu có lỗi từ API
                if (data.status === 'error') {
                    moviesContainer.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>${data.msg || 'Không tìm thấy phim thuộc quốc gia này.'}</p></div>`;
                    return;
                }
                
                // Kiểm tra dữ liệu phim
                const movies = data.data || data;
                
                // Kiểm tra nếu không có phim
                if (!movies || movies.length === 0) {
                    moviesContainer.innerHTML = '<div class="no-results"><i class="fas fa-film"></i><p>Không tìm thấy phim nào thuộc quốc gia này.</p></div>';
                    return;
                }
                
                // Hiển thị danh sách phim
                movies.forEach(movie => {
                    const movieCard = createMovieCard(movie);
                    moviesContainer.appendChild(movieCard);
                });
            })
            .catch(error => {
                console.error('Lỗi khi tải danh sách phim:', error);
                moviesContainer.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Đã xảy ra lỗi khi tải danh sách phim. Vui lòng thử lại sau.</p></div>';
            });
    }
    
    // Hàm tạo thẻ phim
    function createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        
        // Tạo poster phim
        const poster = document.createElement('div');
        poster.className = 'movie-poster';
        if (movie.poster_url || movie.thumb_url || movie.thumbnail) {
            poster.style.backgroundImage = `url('${movie.poster_url || movie.thumb_url || movie.thumbnail || ''}')`;
        } else {
            poster.style.backgroundImage = "url('/images/placeholder.jpg')";
        }
        
        // Thêm chất lượng phim (nếu có)
        if (movie.quality) {
            const quality = document.createElement('div');
            quality.className = 'movie-quality';
            quality.textContent = movie.quality;
            poster.appendChild(quality);
        }
        
        // Tạo phần thông tin phim
        const info = document.createElement('div');
        info.className = 'movie-info';
        
        // Tiêu đề phim
        const title = document.createElement('h3');
        title.className = 'movie-title';
        title.textContent = movie.name || movie.title || 'Không có tên';
        
        // Thông tin phụ
        const meta = document.createElement('div');
        meta.className = 'movie-meta';
        
        // Năm sản xuất
        if (movie.year || movie.release_year) {
            const year = document.createElement('span');
            year.className = 'movie-year';
            year.textContent = movie.year || movie.release_year;
            meta.appendChild(year);
        }
        
        // Thể loại
        if (movie.genres && movie.genres.length > 0) {
            const categories = document.createElement('span');
            categories.className = 'movie-categories';
            // Nếu genres là mảng các đối tượng có thuộc tính name
            if (typeof movie.genres[0] === 'object' && movie.genres[0].name) {
                categories.textContent = movie.genres.map(genre => genre.name).join(', ');
            } else {
                categories.textContent = movie.genres.join(', ');
            }
            meta.appendChild(categories);
        } else if (movie.category) {
            const categories = document.createElement('span');
            categories.className = 'movie-categories';
            categories.textContent = movie.category;
            meta.appendChild(categories);
        }
        
        // Thêm các phần tử vào card
        info.appendChild(title);
        info.appendChild(meta);
        card.appendChild(poster);
        card.appendChild(info);
        
        // Thêm sự kiện click
        card.addEventListener('click', function() {
            const slugToUse = movie.slug || movie.id || title.textContent.toLowerCase().replace(/\s+/g, '-');
            window.location.href = `/phim/${slugToUse}`;
        });
        
        return card;
    }
}); 