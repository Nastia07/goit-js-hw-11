import Axios from 'axios';

class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.hits = 0;
  }

  async getData() {
    return await Axios
      .get(
        `https://pixabay.com/api/?key=24955423-ef35e097f581ba14a8380bbca&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`,
      )
      .then(response => {
        this.nextPage();
        this.hits += response.data.hits.length;
        return response.data;
      })
      .catch();
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

export default  ApiService