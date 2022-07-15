let myBooks = []
const RENDER_EVENT = 'render-book'
const SAVED_EVENT = 'saved-bookshelf'
const STORAGE_KEY = 'myBookShelf'
const searchInput = document.getElementById('search__input')

document.addEventListener('DOMContentLoaded', () => {
  myBooks =  getBookshelfFromLocalStorage()
  document.dispatchEvent(new Event(RENDER_EVENT))

  const bookForm = document.getElementById('input__book__form')
  bookForm.addEventListener("submit", (event) => {
    event.preventDefault()
    addBook()
  })

  searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value
    searchBook(keyword)
  })
});

const getBookshelfFromLocalStorage = () => {
  const myBooksFromLocalStorage = JSON.parse(localStorage.getItem(STORAGE_KEY))
  if(myBooksFromLocalStorage === null){
    return
  }

  return myBooksFromLocalStorage
}

const searchBook = (keyword) => {
  const searchedBooks = getBookshelfFromLocalStorage().filter(book => book.title.toLowerCase().includes(keyword.toLowerCase()))
  myBooks = searchedBooks
  document.dispatchEvent(new Event(RENDER_EVENT))
}

const generateBookId = () => {
  return +new Date()
}

const generateBookObject = ({ id, title, author, year, isComplete }) => {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

const isStorageExist = () => {
  if(typeof Storage === undefined){
    alert('Browser kamu tidak mendukung local storage')
    return false
  }

  return true
}

const saveUpdatedMyBooksToLocalStorage = () => {
  if(isStorageExist()){
    const myBooksStringfy = JSON.stringify(myBooks)
    localStorage.setItem(STORAGE_KEY,myBooksStringfy)
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

const addBook = () => {
  const bookTitle = document.getElementById('book__title__input').value
  const bookAuthor = document.getElementById('book__author__input').value
  const bookYear = document.getElementById('book__year__input').value
  const isCompleted = document.getElementById('book__iscomplete__input').checked

  const bookId = generateBookId()
  const book = generateBookObject({
    id: bookId,
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    isComplete: isCompleted
  })
  myBooks.unshift(book)
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveUpdatedMyBooksToLocalStorage()
}

const getBookIndex = (bookId) => {
  return myBooks.findIndex(book => book.id === bookId)
}

const removeBook = (bookId) => {
  const bookTitle = myBooks[getBookIndex(bookId)].title
  const text = `Hapus ${bookTitle} dari rak?`
  if(confirm(text)){
    const bookIndexToRemove = getBookIndex(bookId)
    myBooks.splice(bookIndexToRemove, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveUpdatedMyBooksToLocalStorage()
  }
}

const changeBookShelf = (bookId) => {
  const bookIndexToChangeBookShelf = getBookIndex(bookId)
  myBooks[bookIndexToChangeBookShelf].isComplete = !myBooks[bookIndexToChangeBookShelf].isComplete
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveUpdatedMyBooksToLocalStorage()
}

const renderBook = (book) => {
    return `
      <article class="book">
        <h3 class="book__title">${book.title}</h3>
        <p class="book__description">Penulis: ${book.author}</p>
        <p class="book__description">Tahun: ${book.year}</p>
        
        <div class="book__button">
          ${
            book.isComplete ? `<button onClick="changeBookShelf(${book.id})" class="button incomplete__button">Belum selesai dibaca</button>` : `<button onClick="changeBookShelf(${book.id})"  class="button complete__button">Selesai dibaca</button>`
          }
        
          <button onClick="removeBook(${book.id})" class="button delete__button">Hapus</button>
       
        </div>
      </article>
    `
}

{/* <button onClick="editBook(${book.id})" class="button edit__button">Edit</button> */}

const renderBooks = (books) => {
  const inCompleteBookShelfListItem = document.getElementById('incomplete__book__shelf__list__item')
  const completeBookShelfListItem = document.getElementById('complete__book__shelf__list__item')

  let renderedCompleteBookShelf = ``
  let renderedInCompleteBookShelf = ``

  for(let book of books){
    let renderedBook = renderBook(book)
    if(book.isComplete){
      renderedCompleteBookShelf += renderedBook
    }else {
      renderedInCompleteBookShelf += renderedBook
    }
  }
  
  completeBookShelfListItem.innerHTML = renderedCompleteBookShelf
  inCompleteBookShelfListItem.innerHTML = renderedInCompleteBookShelf
 
}

document.addEventListener(RENDER_EVENT, () => {
  renderBooks(myBooks)
})

document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY))
})