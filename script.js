async function startLoading() {
    const searchBtn = document.getElementById('search-btn');
    const loadingBtn = document.getElementById('loading-btn');

    searchBtn.classList.add('is-hidden');
    loadingBtn.classList.remove('is-hidden');

    try {
        await new Promise(resolve => setTimeout(resolve, 3000));
    } finally {
        searchBtn.classList.remove('is-hidden');
        loadingBtn.classList.add('is-hidden');
    }
}