'use strict';

const store = (function () {

  function findBookmarkById(id) {
    return store.bookmarks.find(book => book.id === id);
  }

  function findAndDelete(id) {
    this.bookmarks = this.bookmarks.filter(book => book.id !== id);
  }

  function addBookmark(bookmark) {
    bookmark.fullView = false;
    this.bookmarks.push(bookmark);
  }

  function toggleAddNew() {
    this.addingNew = !this.addingNew;
  }

  function changeRatingFilter(rating) {
    this.ratingFilter = rating;
  }

  function updateError(error) {
    this.error = error;
  }

  function toggleBookmarkFullView(id) {
    let book = findBookmarkById(id);
    book.fullView = !book.fullView;
  }

  return {
    bookmarks: [],
    addingNew: false,
    ratingFilter: 0,
    error: null,

    addBookmark,
    toggleAddNew,
    changeRatingFilter,
    updateError,
    findAndDelete,
    toggleBookmarkFullView,
    findBookmarkById,
  };
})();