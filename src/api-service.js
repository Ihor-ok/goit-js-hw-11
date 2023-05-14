export default class GalleryApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;

    };

    fetchImages() {
        const url = `https://pixabay.com/api/?key=35579810-55fc44ce50f1d75978380d9a0&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
        return fetch(url).then(res => {
                if (!res.ok) {
                throw new Error(res.status);
            };
    return res.json();
        }).then(data => {
            this.page += 1;
            console.log(data.totalHits);
            return data.hits;
        }).catch(error => {
            console.log(error)
            return error;
        })
    };
    
    resetPage() {
        this.page = 1;
    };
    
    get query() {
        return this.searchQuery
    };

    set query(newQuery) {
        this.searchQuery = newQuery;
    };
}