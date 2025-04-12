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
    // const loginButton = document.querySelector('.login-button button');
    
    // if (loginButton) {
    //     loginButton.addEventListener('click', () => {
    //         // Trong triển khai thực tế, sẽ hiển thị form đăng nhập hoặc chuyển đến trang đăng nhập
    //         alert('Chức năng đăng nhập sẽ được hiển thị ở đây');
    //     });
    // }
    
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
   
    // // Thêm code để lấy danh sách thể loại cho category-grid
    // const categoryGrid = document.querySelector('.category-grid');
    // if (categoryGrid) {
    //     populateCategoryGrid(categoryGrid);
    // }
    
    // // Hàm để lấy và hiển thị danh sách thể loại trong category-grid
    // function populateCategoryGrid(gridElement) {
    //     fetch('https://phimapi.com/the-loai')
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Không thể kết nối đến API');
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             // Xóa nội dung hiện tại
    //             gridElement.innerHTML = '';
                
    //             // Thêm các thể loại từ API
    //             data.forEach(genre => {
    //                 const categoryCard = document.createElement('a');
    //                 categoryCard.href = `/the-loai/${genre.slug}`;
    //                 categoryCard.className = 'category-card';
    //                 categoryCard.textContent = genre.name;
    //                 gridElement.appendChild(categoryCard);
    //             });
    //         })
    //         .catch(error => {
    //             console.error('Lỗi khi tải danh sách thể loại cho lưới:', error);
                
    //             // Xóa nội dung hiện tại
    //             gridElement.innerHTML = '';
                
    //             // Thêm các thể loại mẫu
    //             sampleGenres.forEach(genre => {
    //                 const categoryCard = document.createElement('a');
    //                 categoryCard.href = `/the-loai/${genre.slug}`;
    //                 categoryCard.className = 'category-card';
    //                 categoryCard.textContent = genre.name;
    //                 gridElement.appendChild(categoryCard);
    //             });
    //         });
    // }
    
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

