const searchForm = document.getElementById('book-search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

// Function to display search results
const displaySearchResults = (results) => {
  searchResults.innerHTML = '';

  if (results.length === 0) {
    searchResults.innerHTML = '<p>No results found</p>';
    return;
  }

  results.forEach((book) => {
    const bookElem = document.createElement('div');
    bookElem.classList.add('book');

    const bookImg = document.createElement('img');
    bookImg.src = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150';

    const bookTitle = document.createElement('h3');
    bookTitle.textContent = book.volumeInfo.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.textContent = `Author(s): ${book.volumeInfo.authors?.join(', ')}`;

    const bookPublisher = document.createElement('p');
    bookPublisher.textContent = `Publisher: ${book.volumeInfo.publisher}`;

    const bookPublishedDate = document.createElement('p');
    bookPublishedDate.textContent = `Published Date: ${book.volumeInfo.publishedDate}`;

    bookElem.append(bookImg, bookTitle, bookAuthor, bookPublisher, bookPublishedDate);
    searchResults.appendChild(bookElem);
  });
};

// Function to retrieve book data from API
const fetchBooks = async (query) => {
//   const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
const url = `https://www.googleapis.com/books/v1/volumes?q=percy+jackson`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching book data:', error);
  }
};

// Function to save search query to local storage
const saveSearchQuery = (query) => {
  const searches = JSON.parse(localStorage.getItem('searches')) || [];
  if (!searches.includes(query)) {
    searches.push(query);
    localStorage.setItem('searches', JSON.stringify(searches));
  }
};

// Function to display search history
const displaySearchHistory = () => {
  const searches = JSON.parse(localStorage.getItem('searches')) || [];
  historyList.innerHTML = '';
  searches.forEach((search) => {
    const listItem = document.createElement('li');
    listItem.textContent = search;
    listItem.addEventListener('click', () => {
      searchInput.value = search;
      searchForm.dispatchEvent(new Event('submit'));
    });
    historyList.appendChild(listItem);
  });
};

// Event listener for search form submit
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query === '') return;
  const results = await fetchBooks(query);
  displaySearchResults(results);
  saveSearchQuery(query);
  displaySearchHistory();
});

// Event listener for clear history button
clearHistoryBtn.addEventListener('click', () => {
  localStorage.removeItem('searches');
  displaySearchHistory();
});

// Display search history on page load
displaySearchHistory();
