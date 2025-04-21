document.addEventListener('DOMContentLoaded', function() {
    // Lấy tham số slug từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieSlug = urlParams.get('slug');
    
    // Các selector DOM
    const movieDetailsContainer = document.getElementById('movie-details-container');
    
    // Biến lưu thông tin phim hiện tại
    let currentMovie = null;
    
    // Kiểm tra nếu không có slug
    if (!movieSlug) {
        showError('Không tìm thấy thông tin phim');
        return;
    }
    
    // Tải thông tin chi tiết phim
    fetchMovieDetails(movieSlug);
    
    // Hàm gọi API lấy thông tin chi tiết phim
    function fetchMovieDetails(slug) {
        // Hiển thị loading
        movieDetailsContainer.innerHTML = `
            <div class="loading-details">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Đang tải thông tin phim...</p>
            </div>
        `;
        
        // Gọi API
        fetch(`https://phimapi.com/phim/${slug}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến API hoặc không tìm thấy phim');
                }
                return response.json();
            })
            .then(data => {
                // In dữ liệu API để gỡ lỗi
                console.log('Dữ liệu API đầy đủ:', data);
                
                // Kiểm tra cấu trúc data trả về
                if (!data || !data.movie) {
                    throw new Error('Cấu trúc API không hợp lệ hoặc không có dữ liệu phim');
                }
                
                // Kiểm tra xem episodes có nằm trong cấu trúc data hay movie
                let episodesData = null;
                if (data.episodes && Array.isArray(data.episodes)) {
                    console.log('Tìm thấy episodes ở cấp root của API');
                    episodesData = data.episodes;
                } else if (data.movie.episodes && Array.isArray(data.movie.episodes)) {
                    console.log('Tìm thấy episodes trong trường movie của API');
                    episodesData = data.movie.episodes;
                } else {
                    console.log('Không tìm thấy trường episodes trong API');
                }
                
                // Thêm episodes vào data.movie nếu tìm thấy ở cấp root
                if (episodesData && !data.movie.episodes) {
                    console.log('Đang chuyển episodes từ root vào movie');
                    data.movie.episodes = episodesData;
                }
                
                // Lưu thông tin phim vào biến toàn cục
                currentMovie = data.movie;
                
                // Hiển thị chi tiết phim 
                displayMovieDetails(data);
            })
            .catch(error => {
                console.error('Lỗi khi tải thông tin phim:', error);
                showError('Không thể tải thông tin phim: ' + error.message);
            });
    }
    
    // Hiển thị chi tiết phim
    function displayMovieDetails(data) {
        // Kiểm tra dữ liệu
        if (!data || !data.movie) {
            showError('Không tìm thấy thông tin phim');
            return;
        }
        
        // Lấy dữ liệu phim từ cấu trúc JSON chính xác
        const movie = data.movie;
        console.log("Thông tin phim:", JSON.stringify(movie, null, 2));
        
        // Debug dữ liệu đánh giá phim
        console.log("Vote Average:", movie.vote_average);
        console.log("Vote Count:", movie.vote_count);
        console.log("Vote Average trong tmdb:", movie.tmdb ? movie.tmdb.vote_average : 'Không có');
        console.log("Vote Count trong tmdb:", movie.tmdb ? movie.tmdb.vote_count : 'Không có');
        
        // Debug: Kiểm tra episodes có ở đâu
        if (data.episodes) {
            console.log("Episodes ở cấp ROOT:", data.episodes);
        }
        if (movie.episodes) {
            console.log("Episodes ở cấp MOVIE:", movie.episodes);
        }
        if (!data.episodes && !movie.episodes) {
            console.error("KHÔNG TÌM THẤY EPISODES Ở BẤT KỲ NƠI NÀO!");
        }
        
        // Chuẩn bị dữ liệu từ cấu trúc API
        // Trong JSON mẫu, URL poster là đường dẫn đầy đủ
        const posterUrl = movie.poster_url || movie.thumb_url || '/images/placeholder.jpg';
        
        // Xử lý thể loại
        let categories = 'Chưa cập nhật';
        if (movie.category && Array.isArray(movie.category)) {
            categories = movie.category.map(cat => cat.name).join(', ');
        }
            
        // Xử lý quốc gia
        let countries = 'Chưa cập nhật';
        if (movie.country && Array.isArray(movie.country)) {
            countries = movie.country.map(c => c.name).join(', ');
        }
        
        // Xử lý đạo diễn
        let directors = 'Chưa cập nhật';
        if (movie.director && Array.isArray(movie.director)) {
            directors = movie.director.join(', ');
        }
        
        // Xử lý diễn viên
        let actors = 'Chưa cập nhật';
        if (movie.actor && Array.isArray(movie.actor)) {
            actors = movie.actor.join(', ');
        }
        
        // Xác định loại phim (bộ hoặc lẻ)
        const movieType = movie.type === 'series' ? 'Phim Bộ' : 'Phim Lẻ';
        
        // Xác định trạng thái phim
        const status = movie.episode_current || movie.status || 'Đang cập nhật';
        
        // Xác định thời lượng từ nhiều trường có thể có
        const duration = movie.time || (movie.runtime ? `${movie.runtime} phút` : 'Chưa cập nhật');
        
        // Xác định năm phát hành
        const year = movie.year || 'Chưa cập nhật';
        
        // Ngôn ngữ
        const language = movie.lang || 'Chưa cập nhật';
        
        // Số tập
        const episodeTotal = movie.episode_total || '?';
        const episodeCurrent = movie.episode_current || 'Đang cập nhật';
        
        // Kiểm tra xem phim có nhiều tập không
        const hasEpisodes = movie.type === 'series' || (movie.episodes && movie.episodes.length > 0);
        
        // Kiểm tra URL có hợp lệ không
        function isValidURL(url) {
            if (!url) return false;
            
            try {
                new URL(url);
                return true;
            } catch (e) {
                return false;
            }
        }
        
        // Định dạng URL để xem trực tiếp
        function formatPlayerURL(url) {
            console.log("Xử lý URL:", url);
            
            // Nếu URL rỗng hoặc không hợp lệ
            if (!url || url.trim() === '') {
                console.log("URL rỗng hoặc không hợp lệ");
                return '';
            }
            
            try {
                // Thử phân tích URL
                const urlObj = new URL(url);
                console.log("Đã phân tích URL thành công:", urlObj.href);
                
                // Nếu URL là player.phimapi.com, sử dụng URL từ tham số url
                if (url.includes('player.phimapi.com/player')) {
                    const directUrl = urlObj.searchParams.get('url');
                    if (directUrl) {
                        console.log(`Đã trích xuất URL từ player: ${directUrl}`);
                        return directUrl;
                    } else {
                        console.log("Không tìm thấy tham số url trong player URL");
                    }
                }
                
                // Trả về URL gốc nếu không phải player URL
                return url;
            } catch (e) {
                console.error("Lỗi khi xử lý URL:", e);
                // Kiểm tra nếu URL không bắt đầu bằng http/https, thử thêm vào
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    console.log("Thử thêm https:// vào URL không hợp lệ");
                    return formatPlayerURL('https://' + url);
                }
                return url;
            }
        }
        
        // Kiểm tra xem đang xem trên mobile hay không
        const isMobile = window.innerWidth <= 480;
        
        // Thêm class specific cho mobile nếu cần
        const mobileClass = isMobile ? 'movie-details-mobile' : '';
        
        // Hiển thị chi tiết phim theo bố cục mới với thông tin bên phải poster
        movieDetailsContainer.innerHTML = `
            <div class="movie-details-container ${mobileClass}">
                <div class="movie-left-column">
                    <div class="movie-poster-large" style="background-image: url('${posterUrl}')">
                        ${isMobile ? `<img src="${posterUrl}" alt="${movie.name}">` : ''}
                        <span class="movie-quality-tag">${movie.quality || 'HD'}</span>
                        <span class="movie-episode-tag">${status}</span>
                    </div>
                    
                    <div class="watch-buttons">
                        ${movie.trailer_url ? `
                        <button class="watch-button watch-trailer" onclick="window.open('${movie.trailer_url}', '_blank')">
                            <i class="fas fa-film"></i> Xem Trailer
                        </button>
                        ` : ''}
                        <button class="watch-button watch-now" id="watch-now-button">
                            <i class="fas fa-play"></i> Xem Phim
                        </button>
                    </div>
                    <!-- Container cho nút yêu thích sẽ được thêm ở đây qua JavaScript -->
                </div>
                
                <div class="movie-right-column">
                    <div class="movie-title-section">
                        <h1 class="movie-title-large">${movie.name}</h1>
                        <div class="movie-title-original">${movie.origin_name || ''}</div>
                    </div>
                    
                    <table class="movie-info-table">
                        <tr>
                            <td class="info-label">Tình trạng</td>
                            <td class="info-value">${status}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Số tập</td>
                            <td class="info-value">${episodeCurrent.includes('Hoàn Tất') ? episodeCurrent : episodeTotal}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Thời lượng</td>
                            <td class="info-value">${duration}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Năm phát hành</td>
                            <td class="info-value">${year}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Chất lượng</td>
                            <td class="info-value">${movie.quality || 'HD'}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Ngôn Ngữ</td>
                            <td class="info-value">${language}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Đạo diễn</td>
                            <td class="info-value">${directors}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Diễn viên</td>
                            <td class="info-value">${actors}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Thể loại</td>
                            <td class="info-value">${categories}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Quốc gia</td>
                            <td class="info-value">${countries}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Điểm trung bình</td>
                            <td class="info-value">${movie.tmdb && movie.tmdb.vote_average ? movie.tmdb.vote_average.toFixed(1) + '/10' : 'Chưa có đánh giá'}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Lượt đánh giá</td>
                            <td class="info-value">${movie.tmdb && movie.tmdb.vote_count ? movie.tmdb.vote_count.toLocaleString() : '0'}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="movie-description">
                    <h3>Nội dung phim</h3>
                    <p>${movie.content || 'Chưa có nội dung phim'}</p>
                </div>
                
                ${hasEpisodes ? renderEpisodesSection(movie) : ''}
            </div>
        `;
        
        // Nếu là mobile, áp dụng style trực tiếp
        if (isMobile) {
            const poster = document.querySelector('.movie-poster-large');
            const watchNowBtn = document.querySelector('.watch-now');
            const trailerBtn = document.querySelector('.watch-trailer');
            const episodesContainer = document.querySelector('.episodes-container');
            
            // Áp dụng style cho poster
            if (poster) {
                poster.style.height = 'auto';
                poster.style.width = '100%';
                poster.style.maxWidth = '100%';
                poster.style.borderRadius = '0';
                poster.style.margin = '0';
                poster.style.boxShadow = 'none';
            }
            
            // Áp dụng style cho nút xem phim
            if (watchNowBtn) {
                watchNowBtn.style.backgroundColor = '#e74c3c';
                watchNowBtn.style.borderRadius = '5px';
                watchNowBtn.style.width = '100%';
                watchNowBtn.style.boxSizing = 'border-box';
            }
            
            // Áp dụng style cho nút trailer
            if (trailerBtn) {
                trailerBtn.style.backgroundColor = '#e74c3c';
                trailerBtn.style.color = 'white';
                trailerBtn.style.border = 'none';
                trailerBtn.style.borderRadius = '5px';
                trailerBtn.style.width = '100%';
                trailerBtn.style.boxSizing = 'border-box';
            }
            
            // Hiển thị phần danh sách tập
            if (episodesContainer) {
                episodesContainer.style.display = 'block';
            }
            
            // Tạo style mới áp dụng cho mobile
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                @media (max-width: 480px) {
                    .movie-details-container {
                        display: flex;
                        flex-direction: column;
                        padding: 0;
                        width: 100%;
                        max-width: 100%;
                        box-sizing: border-box;
                    }
                    
                    .watch-buttons {
                        flex-direction: column;
                        gap: 10px;
                        padding: 0 15px;
                        margin-top: 15px;
                    }
                    
                    .movie-title-section {
                        text-align: center;
                        padding: 15px;
                    }
                    
                    .movie-info-table {
                        display: flex;
                        flex-direction: column;
                        background: none;
                        box-shadow: none;
                        margin: 0;
                    }
                    
                    .movie-info-table tr {
                        display: flex;
                        padding: 8px 15px;
                        border-bottom: 1px solid #eee;
                    }
                    
                    .movie-info-table td {
                        padding: 0;
                        border: none;
                    }
                    
                    .info-label {
                        width: 100px;
                        color: #2c3e50;
                        font-weight: 500;
                        flex-shrink: 0;
                    }
                    
                    .info-value {
                        flex: 1;
                        text-align: right;
                        color: #2c3e50;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: normal;
                        word-wrap: break-word;
                        padding-left: 10px;
                    }
                    
                    .movie-description {
                        display: block;
                        padding: 15px;
                        margin: 15px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }
                    
                    .episodes-container {
                        display: block;
                        padding: 15px;
                        margin: 15px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }
                }
            `;
            document.head.appendChild(styleElement);
        }
        
        // Thêm sự kiện click cho các nút chọn tập phim
        if (hasEpisodes) {
            addEpisodeClickHandlers(movie);
            
            // Thêm sự kiện cho nút Xem Phim
            const watchButton = document.getElementById('watch-now-button');
            if (watchButton) {
                watchButton.addEventListener('click', function() {
                    // Tìm tập phim đầu tiên
                    console.log("Đang cố gắng xem tập đầu tiên...");
                    const firstEpisodeLink = document.querySelector('.episode-item');
                    
                    if (firstEpisodeLink) {
                        // Lấy href từ thẻ a
                        const episodeHref = firstEpisodeLink.getAttribute('href');
                        if (episodeHref && episodeHref !== '#') {
                            console.log("Mở link từ tập đầu tiên:", episodeHref);
                            window.open(episodeHref, '_blank');
                            
                            // Cập nhật lịch sử xem nếu tính năng user-features đã tải
                            if (typeof updateWatchHistory === 'function') {
                                updateWatchHistory(movieSlug);
                            }
                        } else {
                            console.log("Tập đầu tiên không có link hợp lệ");
                            alert('Không tìm thấy link xem phim hợp lệ');
                        }
                    } else {
                        console.log("Không tìm thấy tập phim nào để xem");
                        alert('Không tìm thấy tập phim nào để xem');
                    }
                });
            }
        } else {
            // Nếu là phim lẻ, kiểm tra xem có link_embed không
            const watchButton = document.getElementById('watch-now-button');
            if (watchButton) {
                watchButton.addEventListener('click', function() {
                    // Lấy và kiểm tra link_embed hoặc link_m3u8
                    console.log("Thông tin phim lẻ:", movie);
                    
                    // Ưu tiên sử dụng link_embed thay vì link_m3u8
                    const embedLink = movie.link_embed || movie.link_m3u8;
                    
                    console.log("Link embed phim lẻ:", movie.link_embed);
                    console.log("Link m3u8 phim lẻ:", movie.link_m3u8);
                    console.log("Link sử dụng:", embedLink);
                    
                    if (embedLink) {
                        console.log("Mở link xem phim lẻ:", embedLink);
                        window.open(embedLink, '_blank');
                        
                        // Cập nhật lịch sử xem nếu tính năng user-features đã tải
                        if (typeof updateWatchHistory === 'function') {
                            updateWatchHistory(movieSlug);
                        }
                    } else {
                        // Thử tìm trong episodes - cho phim lẻ có nhiều server
                        if (movie.episodes && Array.isArray(movie.episodes) && movie.episodes.length > 0) {
                            const firstServer = movie.episodes[0];
                            if (firstServer.server_data && firstServer.server_data.length > 0) {
                                const firstEpisode = firstServer.server_data[0];
                                // Ưu tiên sử dụng link_embed thay vì link_m3u8
                                const episodeLink = firstEpisode.link_embed || firstEpisode.link_m3u8;
                                
                                console.log("Tìm thấy link embed trong episodes:", firstEpisode.link_embed);
                                console.log("Tìm thấy link m3u8 trong episodes:", firstEpisode.link_m3u8);
                                console.log("Link sử dụng từ episodes:", episodeLink);
                                
                                if (episodeLink) {
                                    window.open(episodeLink, '_blank');
                                    
                                    // Cập nhật lịch sử xem nếu tính năng user-features đã tải
                                    if (typeof updateWatchHistory === 'function') {
                                        updateWatchHistory(movieSlug);
                                    }
                                    return;
                                }
                            }
                        }
                        
                        alert('Không tìm thấy link xem phim');
                    }
                });
            }
        }
        
        // Cập nhật tiêu đề trang
        document.title = `${movie.name} (${year}) - MovieLand`;
        
        // Thêm nút yêu thích nếu người dùng đã đăng nhập
        if (typeof initMovieDetailsButtons === 'function') {
            // Kiểm tra nếu nút yêu thích đã tồn tại
            if (!document.querySelector('.favorite-button') && !document.querySelector('.favorite-button-container')) {
                console.log('Gọi hàm khởi tạo nút yêu thích từ hiển thị chi tiết phim...');
                setTimeout(() => {
                    initMovieDetailsButtons();
                }, 500);
            } else {
                console.log('Nút yêu thích đã tồn tại, không khởi tạo từ hiển thị chi tiết phim');
            }
        } else {
            console.log('Chức năng yêu thích chưa được tải');
        }
    }
    
    // Hiển thị danh sách các tập phim
    function renderEpisodesSection(movie) {
        console.log("==== DEBUG: renderEpisodesSection ====");
        console.log("Dữ liệu tập phim đầu vào:", movie);
        
        try {
            // Kiểm tra cấu trúc API trả về
            if (movie.episodes && Array.isArray(movie.episodes) && movie.episodes.length > 0) {
                console.log(`Tìm thấy ${movie.episodes.length} mục trong episodes`);
                console.log("Cấu trúc episodes[0]:", JSON.stringify(movie.episodes[0], null, 2));
                
                // Kiểm tra cấu trúc episodes
                const firstEpisode = movie.episodes[0];
                
                if (firstEpisode.server_name && firstEpisode.server_data) {
                    console.log(`Server đầu tiên: ${firstEpisode.server_name}, số tập: ${firstEpisode.server_data ? firstEpisode.server_data.length : 0}`);
                    
                    // Test thử xem link_embed hoặc link_m3u8 có trong server_data[0] không
                    if (firstEpisode.server_data && firstEpisode.server_data.length > 0) {
                        console.log("Thông tin tập đầu tiên:", JSON.stringify(firstEpisode.server_data[0], null, 2));
                        console.log("Link embed của tập đầu tiên:", firstEpisode.server_data[0].link_embed);
                        console.log("Link m3u8 của tập đầu tiên:", firstEpisode.server_data[0].link_m3u8);
                    }
                    
                    // Kiểm tra xem phim này có phải phim lẻ (chỉ có 1 tập) không
                    const isMovieSingle = movie.type === 'single' || (
                        firstEpisode.server_data && 
                        firstEpisode.server_data.length === 1 && 
                        (!movie.episode_total || movie.episode_total === '1')
                    );
                    
                    if (isMovieSingle) {
                        console.log("Đây là phim lẻ có cấu trúc episodes");
                        // Phim lẻ nhưng có cấu trúc episodes, lấy tập đầu tiên của server đầu tiên
                        if (firstEpisode.server_data && firstEpisode.server_data.length > 0) {
                            const embedLink = firstEpisode.server_data[0].link_embed || firstEpisode.server_data[0].link_m3u8 || '';
                            console.log("Link của phim lẻ:", embedLink);
                            
                            return `
                                <div class="episodes-container">
                                    <h3>Xem phim (${firstEpisode.server_name})</h3>
                                    <div class="episodes-list">
                                        <a href="${embedLink}" target="_blank" class="episode-item active">
                                            Xem phim
                                        </a>
                                    </div>
                                </div>
                            `;
                        }
                    }
                    
                    // Trường hợp API trả về episodes với server_name và server_data
                    return renderEpisodesWithServerData(movie.episodes, movie);
                } else {
                    console.log("Cấu trúc episodes không có server_name hoặc server_data");
                }
            } else {
                console.log("Không tìm thấy episodes hoặc episodes trống");
            }
            
            // Trường hợp không có dữ liệu server, tạo danh sách tập dựa vào episode_total
            return renderDefaultEpisodes(movie);
            
        } catch (error) {
            console.error("Lỗi khi render episodes section:", error);
            return `
                <div class="episodes-container">
                    <h3>Danh sách tập phim</h3>
                    <div class="error-message">
                        <p>Có lỗi khi hiển thị danh sách tập phim. Vui lòng thử lại sau.</p>
                        <p>Chi tiết lỗi: ${error.message}</p>
                    </div>
                </div>
            `;
        }
    }
    
    // Hiển thị danh sách tập phim từ cấu trúc episodes với server_name và server_data
    function renderEpisodesWithServerData(episodes, movie) {
        console.log("==== DEBUG: renderEpisodesWithServerData ====");
        console.log("Cấu trúc episodes:", JSON.stringify(episodes, null, 2));
        
        try {
            // Duyệt qua mỗi máy chủ (server) và hiển thị tất cả các tập từ mỗi máy chủ
            const serverSections = episodes.map((server, index) => {
                if (!server.server_data || !Array.isArray(server.server_data) || server.server_data.length === 0) {
                    console.log("Server không có server_data:", server.server_name || `Server ${index + 1}`);
                    return '';
                }
                
                const serverName = server.server_name || `Server ${index + 1}`;
                console.log(`Đang xử lý server: ${serverName}, số tập: ${server.server_data.length}`);
                
                // Tạo danh sách tập cho server này
                const episodeItems = server.server_data.map((episode, epIndex) => {
                    const episodeName = episode.name || `Tập ${episode.slug || epIndex + 1}`;
                    
                    // Ưu tiên sử dụng link_embed thay vì link_m3u8
                    const embedLink = episode.link_embed || episode.link_m3u8 || '#';
                    
                    console.log(`- Tập: ${episodeName}`);
                    console.log(`  Link embed: ${episode.link_embed}`);
                    console.log(`  Link m3u8: ${episode.link_m3u8}`);
                    console.log(`  Link sử dụng: ${embedLink}`);
                    
                    // Sử dụng thẻ a với href trực tiếp thay vì JavaScript
                    return `
                        <a href="${embedLink}" target="_blank" class="episode-item" title="${episodeName}">
                            ${episodeName}
                        </a>
                    `;
                }).join('');
                
                return `
                    <div class="server-episodes" id="server-${serverName.replace(/\s+/g, '-')}" style="display: ${index === 0 ? 'block' : 'none'}">
                        <h4>${serverName}</h4>
                        <div class="episodes-list">
                            ${episodeItems || '<p>Không có tập phim nào hoặc không tìm thấy link</p>'}
                        </div>
                    </div>
                `;
            }).join('');
            
            // Tạo danh sách tab server
            const serverTabsHTML = episodes.map((server, index) => {
                const serverName = server.server_name || `Server ${index + 1}`;
                return `
                    <div class="server-tab ${index === 0 ? 'active' : ''}" data-server="${serverName}">
                        ${serverName}
                    </div>
                `;
            }).join('');
            
            return `
                <div class="episodes-container">
                    <h3>Danh sách tập phim</h3>
                    <div class="server-selection">
                        <div class="server-tabs">
                            ${serverTabsHTML}
                        </div>
                    </div>
                    <div class="episodes-list-container">
                        ${serverSections}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error("Lỗi khi render episodes:", error);
            return `
                <div class="episodes-container">
                    <h3>Danh sách tập phim</h3>
                    <div class="error-message">
                        <p>Có lỗi khi hiển thị danh sách tập phim. Vui lòng thử lại sau.</p>
                        <p>Chi tiết lỗi: ${error.message}</p>
                    </div>
                </div>
            `;
        }
    }
    
    // Hiển thị danh sách tập phim mặc định khi không có dữ liệu server
    function renderDefaultEpisodes(movie) {
        // Kiểm tra xem có link_embed hoặc link_m3u8 trực tiếp không
        if (movie.link_embed || movie.link_m3u8) {
            // Ưu tiên sử dụng link_embed thay vì link_m3u8
            const embedLink = movie.link_embed || movie.link_m3u8 || '#';
            
            console.log(`Phim lẻ - Link embed: ${movie.link_embed}`);
            console.log(`Phim lẻ - Link m3u8: ${movie.link_m3u8}`);
            console.log(`Phim lẻ - Link sử dụng: ${embedLink}`);
            
            return `
                <div class="episodes-container">
                    <h3>Xem phim</h3>
                    <div class="episodes-list">
                        <a href="${embedLink}" target="_blank" class="episode-item active">
                            Xem phim
                        </a>
                    </div>
                </div>
            `;
        }
        
        // Kiểm tra xem có dữ liệu episodes không
        if (movie.episodes && Array.isArray(movie.episodes) && movie.episodes.length > 0) {
            // Nếu có episodes nhưng hàm này vẫn được gọi, có thể thử xử lý lại
            console.log("Phát hiện episodes nhưng đã gọi đến renderDefaultEpisodes, thử xử lý lại...");
            return renderEpisodesWithServerData(movie.episodes, movie);
        }
        
        const episodeTotal = parseInt(movie.episode_total) || parseInt(movie.episode_current) || 1;
        
        let episodesHTML = '';
        for (let i = 1; i <= episodeTotal; i++) {
            episodesHTML += `
                <div class="episode-item" data-episode="${i}">
                    Tập ${i}
                </div>
            `;
        }
        
        return `
            <div class="episodes-container">
                <h3>Danh sách tập phim</h3>
                <div class="episodes-list">
                    ${episodesHTML}
                </div>
            </div>
        `;
    }
    
    // Thêm sự kiện click cho các tập phim
    function addEpisodeClickHandlers(movie) {
        // Thêm sự kiện cho các tập phim
        const episodeItems = document.querySelectorAll('.episode-item');
        episodeItems.forEach(item => {
            // Nếu đã là thẻ a có href, thêm sự kiện để cập nhật lịch sử xem
            if (item.tagName === 'A' && item.getAttribute('href') && item.getAttribute('href') !== '#') {
                item.addEventListener('click', function() {
                    // Cập nhật lịch sử xem nếu tính năng user-features đã tải
                    if (typeof updateWatchHistory === 'function') {
                        const movieSlug = new URLSearchParams(window.location.search).get('slug');
                        if (movieSlug) {
                            updateWatchHistory(movieSlug);
                        }
                    }
                });
            }
        });
        
        // Thêm sự kiện cho các tab server
        const serverTabs = document.querySelectorAll('.server-tab');
        serverTabs.forEach((tab, index) => {
            tab.addEventListener('click', function() {
                // Xóa trạng thái active của tất cả các tab
                serverTabs.forEach(t => t.classList.remove('active'));
                
                // Thêm trạng thái active cho tab được click
                tab.classList.add('active');
                
                // Ẩn tất cả các danh sách tập phim
                const serverEpisodes = document.querySelectorAll('.server-episodes');
                serverEpisodes.forEach(ep => ep.style.display = 'none');
                
                // Hiển thị danh sách tập phim tương ứng
                const serverName = tab.getAttribute('data-server');
                if (serverName) {
                    const targetServer = document.getElementById('server-' + serverName.replace(/\s+/g, '-'));
                    if (targetServer) {
                        targetServer.style.display = 'block';
                    }
                } else {
                    // Nếu không có data-server, hiển thị theo index
                    if (serverEpisodes[index]) {
                        serverEpisodes[index].style.display = 'block';
                    }
                }
            });
        });
    }
    
    // Hiển thị thông báo lỗi
    function showError(message) {
        movieDetailsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button class="watch-button watch-now" style="margin-top: 20px;" onclick="window.location.href='index.html'">
                    <i class="fas fa-home"></i> Về Trang Chủ
                </button>
            </div>
        `;
    }
}); 