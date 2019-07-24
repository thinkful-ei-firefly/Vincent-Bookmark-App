'use strict';



const bookmark = (function () {

  function generateBookmarkElement(newBookmark) {

    let expandedInfo = '';
    let visitSite = '';
    let expandButton = '<button class="js-expand-button" type="button">See Details</button>';

    if (newBookmark.fullView) {
      expandedInfo = `<section class ='bookmark-desc' role="region"><p class="desc">${newBookmark.desc}</p></section>`;


      visitSite = `
                      <button value="Visit Site" class='js-visit-site' type="button">Visit Site</button>
                      `;
      expandButton = '<button class="js-expand-button" type="button">Hide Details</button>';

      return `<li class ='bookmark-display'>
      <div class = 'js-bookmark' data-book-id = ${newBookmark.id}>
        <div class = "flex">
          <div class = 'bookmark-title inline-block'><h3 class = 'bookmark-title-name'>${newBookmark.title}</h3></div>
          <div class = 'bookmark-rating inline-block'><h3 class = 'bookmark-rating-name'>${newBookmark.rating} Star</h3></div>
        </div>
        <div id='bookmark-buttons'>${expandButton}
          <button type="button" class='js-delete-button'>Delete</button>
          ${visitSite}
          </div>
        ${expandedInfo}
      </div>
    </li>`;
    }

    return `<li class ='bookmark-display'>
      <div class = 'js-bookmark' data-book-id = ${newBookmark.id}>
      <div>
        <div class ='flex'>
          <div class = 'bookmark-title'><h3 class = 'bookmark-title-name'>${newBookmark.title}</h3></div>
          <div class = 'bookmark-rating'><h3 class = 'bookmark-rating-name'>${newBookmark.rating} Star</h3></div>
        </div>
          <div id='bookmark-buttons'>${expandButton}
          <button class='js-delete-button' type="button">Delete</button>
          ${visitSite}
          </div>
        </div>
         ${expandedInfo}
      </div>
    </li>`;
  }

  function generateBookmarkElementsString(bookmarkArray) {
    return bookmarkArray.map(book => generateBookmarkElement(book)).join('');
  }

  function handleOpenAddForm() {
    $('#js-add-button').click(function (e) {
      e.preventDefault();
      store.toggleAddNew();
      render();
    });
  }

  function handleAddBookmarkCancel() {
    $('#js-add-cancel').click(e => {
      e.preventDefault();
      store.toggleAddNew();
      render();
    });
  }

  //delete function is working in store and through api
  function handleDeleteBookmark() {
    $('#js-bookmark-list').on('click', '.js-delete-button', e => {
      const id = $(e.currentTarget).closest('.bookmark-display').find('.js-bookmark').attr('data-book-id');
      let error = '';
      api.deleteBookmark(id)
        .then(res => {
          if (!res.ok) {
            error = { code: res.status };
          }
          return res.json();
        })
        .then(res => {
          if (error) {
            error.message = res.message;
            return Promise.reject(error);
          }
          store.findAndDelete(id);
          render();
        })
        .catch(e => {
          store.updateError(e.message);
          render();
        });
    });
  }

  //This is adding to the api and the store now
  function handleAddBookmarkSubmit() {
    $('#js-add-new-bookmark').submit(e => {
      e.preventDefault();

      const title = $('#js-title-input').val();
      $('#js-title-input').val('');
      const url = $('#js-url-input').val();
      $('#js-url-input').val('http://');
      const desc = $('#js-description-input').val();
      $('#js-description-input').val('');
      const rating = $('#js-rating-input').val();
      $('#js-rating-input').val('');

      const bookmark = {
        title,
        desc,
        url,
        rating,
      };
      let error = '';
      api.createBookmark(bookmark)
        .then(res => {
          if (!res.ok) {
            error = { code: res.status };
          }
          return res.json();
        })
        .then(res => {
          if (error) {
            error.message = res.message;
            return Promise.reject(error);
          }
          store.addBookmark(res);
          render();
        })
        .catch(e => {
          store.updateError(e.message);
          render();
        });

      store.toggleAddNew();
    });
  }

  function handleExpandBookmark() {
    $('#js-bookmark-list').on('click', '.js-expand-button', e => {
      const id = $(e.currentTarget).closest('.bookmark-display').find('.js-bookmark').attr('data-book-id');
      store.toggleBookmarkFullView(id);
      render();
    });
  }

  function handleVisitSite() {
    $('#js-bookmark-list').on('click', '.js-visit-site', e => {
      console.log('site loading');
      const id = $(e.currentTarget).closest('.bookmark-display').find('.js-bookmark').attr('data-book-id');
      const bookmark = store.findBookmarkById(id);
      const url = bookmark.url;
      window.location = url;
    });
  }


  function handleFiltering() {
    $('#js-rating-filter').change(e => {
      const rating = $(e.currentTarget).val();
      store.changeRatingFilter(rating);
      render();
    });
  }

  function handleDismissError() {
    $('#js-error-cancel').click((e) => {
      e.preventDefault();
      store.updateError(null);
      render();
    });
  }

  function render() {
    if (store.addingNew) {
      $('#js-add-new-bookmark').removeClass('hidden');
      $('#js-add-filter-form').addClass('hidden');
    }
    else {
      $('#js-add-new-bookmark').addClass('hidden');
      $('#js-add-filter-form').removeClass('hidden');
    }

    if (store.error) {
      $('#js-error').removeClass('hidden');
      $('#js-add-filter-form').addClass('hidden');
      $('#error-message').html(store.error);
    }
    else {
      $('#js-error').addClass('hidden');
      //$('#js-add-filter-form').removeClass('hidden');
    }

    let bookmarks = [...store.bookmarks];

    const filteredList = bookmarks.filter(book => book.rating >= store.ratingFilter);

    const html = generateBookmarkElementsString(filteredList);

    $('#js-bookmark-list').html(html);
  }



  function bindEventListeners() {
    handleOpenAddForm();
    handleAddBookmarkSubmit();
    handleAddBookmarkCancel();
    handleExpandBookmark();
    handleFiltering();
    handleDeleteBookmark();
    handleDismissError();
    handleVisitSite();
  }


  return {
    bindEventListeners,
    render,
  };

})();