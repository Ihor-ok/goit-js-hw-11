import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox"; 
import "simplelightbox/dist/simple-lightbox.min.css";
import GalleryApiService from "./api-service";
import LoadMoreBtn from "./load-more-btn";
import './css/styles.css'

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    // buttonLoadMore: document.querySelector('.load-more'),
};
const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
    hidden: true,
});
const galleryApiService = new GalleryApiService();

// console.log(loadMoreBtn);
// console.log(refs.buttonLoadMore);



loadMoreBtn.enable();



refs.searchForm.addEventListener('submit', onSearchImg);
loadMoreBtn.refs.button.addEventListener('click', onButtonLoadMore);


function onSearchImg(evt) {
    evt.preventDefault()
    // console.log(evt.currentTarget.searchQuery.value);
    // let searchByName = evt.currentTarget.searchQuery.value;
    // fetchImg(searchByName).then(res => res.json()).then(renderFoto);

    loadMoreBtn.show();
    loadMoreBtn.disable();

    galleryApiService.query = evt.currentTarget.searchQuery.value;
    galleryApiService.resetPage();
    galleryApiService.fetchImages().then(hits => {
        if (hits.length === 0 || galleryApiService.query === '') {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            clearGallery();
            loadMoreBtn.hide();
            return;
        }
        clearGallery();
        renderFoto(hits);
        loadMoreBtn.enable();
        // console.log(hits.totalHits);

} )
    // console.log("Test");
    

}

function onButtonLoadMore() {
    loadMoreBtn.disable();
    galleryApiService.fetchImages().then(hits => {
        renderFoto(hits);
        loadMoreBtn.enable();
        
    }).catch(error => {
        loadMoreBtn.hide();
        reachedTheEnd();
        console.log(error)
    });
};

    // function fetchImg(searchByName) {
    //     return fetch(`https://pixabay.com/api/?key=35579810-55fc44ce50f1d75978380d9a0&q=${searchByName}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`)
    // };

// function renderFoto(fotos) {
//     const arreyFoto = fotos.hits;
//     const markup = arreyFoto.map((foto) => `<div class="photo-card"><a href="${foto.largeImageURL}" ><img src="${foto.previewURL}" alt="" loading="lazy" class="card-img" /></a><div class="info"><p class="info-item"><b>Likes</b><span class="info-value">${foto.likes}</span></p><p class="info-item"><b>Views</b><span class="info-value">${foto.views}</span></p><p class="info-item"><b>Comments</b><span class="info-value">${foto.comments}</span></p><p class="info-item"><b>Downloads</b><span class="info-value">${foto.downloads}</span></p></div></div>`).join("");
//     refs.gallery.innerHTML = markup;
//     new SimpleLightbox('.gallery a', {});
// };

function renderFoto(hits) {
    const markup = hits.map((hit) => `<div class="photo-card"><a href="${hit.largeImageURL}" ><img src="${hit.previewURL}" alt="" loading="lazy" class="card-img" /></a><div class="info"><p class="info-item"><b>Likes</b><span class="info-value">${hit.likes}</span></p><p class="info-item"><b>Views</b><span class="info-value">${hit.views}</span></p><p class="info-item"><b>Comments</b><span class="info-value">${hit.comments}</span></p><p class="info-item"><b>Downloads</b><span class="info-value">${hit.downloads}</span></p></div></div>`).join("");
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    new SimpleLightbox('.gallery a', {});
};

function clearGallery() {
    refs.gallery.innerHTML = '';
}

function reachedTheEnd() {
    const markup = `<span class="reached-the-end">We're sorry, but you've reached the end of search results.</span>`
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}