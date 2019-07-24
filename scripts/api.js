'use strict';

const api = (function () {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/dustin/bookmarks';

  //This works properly
  function getBookmarks() {
    return fetch(BASE_URL);
  }

  //this works correctly
  function createBookmark(bookmark) {
    const newBookmark = JSON.stringify(bookmark);
    const options = {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: newBookmark,
    };
    return fetch(BASE_URL, options);
    //.then(res => res.json());
  }

  //This Works correctly
  function deleteBookmark(id) {
    const options = {
      method: 'DELETE'
    };
    return fetch(`${BASE_URL}/${id}`, options);
  }

  return {
    getBookmarks,
    createBookmark,
    deleteBookmark,
  };
})();