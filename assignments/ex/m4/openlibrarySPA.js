$(function () {
  var searchWorks = []; //array for search, updated name
  var collectionWorks = []; //array for children's book collection 

  $("#res").on("click", function () { //search results view
    $("#bookCollection").hide();
    $("#pageNumber").show();
    $("#bookSearch").show();
  });

  $("#gridview").on("click", function () { //grid view for collection and results
    $("#results").addClass("grid");
    $("#bookCollection").addClass("grid");
  });

  $("#listview").on("click", function () { //list view for collection and results
    $("#results").removeClass("grid");
    $("#bookCollection").removeClass("grid");
  });


  $(document).on("click", "#results .book-card", function () {  // click handler for search result titles, code referenced from class example (m4), troubleshot with gemini on adding key to titles when selected
    const bookKey = $(this).data("key");
    const selectedBook = searchWorks.find(function (book) {
      return book.key === bookKey;
    });
    if (selectedBook) {
      showDetails(selectedBook);
    }
  });

  $(document).on("click", "#bookCollection .book-card", function () {   //click handler for collection titles, code referenced from class example (m4),  troubleshot with gemini on adding key to titles when selected
    const bookKey = $(this).data("key");
    const selectedBook = collectionWorks.find(function (book) {
      return book.key === bookKey;
    });
    if (selectedBook) {
      showDetails(selectedBook);
    }
  });

  $("#go").on("click", function (event) {
    event.preventDefault(); //prevent page reload

    var searchBar = $("#searchBar").val().trim();

    if (!searchBar) {
      $("#results").html("Please enter a search term.");
      return;
    }

    $("#results").text("Loading...");
    $(".visible").show(); //show page number after search button is clicked, changed to class to accommodate list and grid views buttons
    $("#pageNumber").empty(); //clear page number is new search is made

    $.ajax({
      url: "https://openlibrary.org/search.json",
      dataType: "json",
      timeout: 15000,
      data: {
        q: searchBar,
        limit: 50,
        fields: "key,title,cover_i,author_name"
      }
    })
    .done(function (data) {
      searchWorks = (data.docs || []).slice(0, 50); //code taken from class example (m3)

      if (!searchWorks.length) {
        $("#results").text("No books available. Please try another search term.");
        return;
      }

      let total = Math.min(Math.ceil(data.numFound / 10), 5);
      var select = $("#pageNumber");
      for (var i = 1; i <= total; i++) {
        var opt = document.createElement("option");
        opt.value = i;
        opt.innerHTML = i;
        select.append(opt);
      }

      $("#pageNumber").val(1);
      showPage();
    })
    .fail(function () {
      $("#results").text("Request failed. Try again.");
    });
  });

  $("#pageNumber").on("change", showPage); //changes displayed books when new page number is selected.

  function showPage() {
    $("#results").empty();

    var page = Number($("#pageNumber").val()); //code taken from class example (m3)
    var pageBooks = searchWorks.slice((page - 1) * 10, page * 10); //code taken from class example. (m3)

    var templateData = pageBooks.map(function (book) { //mustache template: previous if/else statements not compatible with mustache, code referenced from class example (m4), g
      return {
        key: book.key,
        title: book.title || "Title unavailable",
        coverUrl: "https://covers.openlibrary.org/b/id/" + book.cover_i + "-S.jpg?default=false" || "No cover avaliable.",
        openLibraryUrl: "https://openlibrary.org" + book.key
      };
    });

    var template = $("#book-card-template").html(); // code take from class example (m4)
    var html = Mustache.render(template, { books: templateData });
    $("#results").html(html);
  }

  //detail
  function showDetails(book) { //function taken from class example (m3)
    var key = book.key;
    var workId = (book.key || "").split("/").pop();

    $("#details").show(); // shows details since previously hidden with display=none
    $("#details").text("Loading details...");

    $.ajax({
      url: "https://openlibrary.org" + key + ".json",
      dataType: "json",
      timeout: 15000,
      data: {
        fields: "title,subjects,cover_id,description"
      }
    })
    .done(function (data) {
      var subjectList = [];

      if (data.subjects && data.subjects.length > 0) {
        for (let i = 0; i < 10; i++) {
          if (!data.subjects[i]) {
            break;
          }
          subjectList.push(data.subjects[i]); //https://www.w3schools.com/jsref/jsref_push.asp, had to replace .append() with .push() as arrays are not compatible with append
        }
      }

      var coverArray = []

      if (data.covers && data.covers.length > 0) {     
        coverArray.push(data.covers[0]);
      }

      var detailsData = { 
        title: data.title || "Unknown Title", //code structure referenced from class example (m4) 
        workId: workId,
        author: data.author_name || "No author for this title.",
        description: data.description.value || data.description || "No description available for this title.",
        subjects: subjectList || "No Subjects Avaliable for this title.",
        coverUrl: "https://covers.openlibrary.org/b/id/" + coverArray[0] + "-M.jpg?default=false" || "<div class='nocover'>No cover avaliable.</div>",
        openLibraryUrl: "https://openlibrary.org" + key
      };

      var template = $("#book-details-template").html(); //code referenced from class example (m4)
      var html = Mustache.render(template, detailsData);
      $("#details").html(html);
    })
    .fail(function () {
      $("#details").text("Failed to load details. Try again.");
    });
  }

  //collection
  $.ajax({
    url: "https://openlibrary.org/subjects/picture_books.json",
    dataType: "json",
    timeout: 15000,
    data: {
      limit: 10,
      fields: "key,title,cover_id"
    }
  })
  .done(function (data) {
    $("#bookCollection").hide(); //hide collection initially

    $("#collection").on("click", function () {
      $("#bookCollection").show();
      $("#bookSearch").hide();
      $("#pageNumber").hide();
    });

    collectionWorks = data.works || [];
    var collectionData = collectionWorks.map(function (book) { //code structure taken from class example (m4)
      return {
        key: book.key,
        title: book.title || "Title unavailable",
        coverUrl: "https://covers.openlibrary.org/b/id/" + book.cover_id + "-S.jpg?default=false" || "No cover avaliable.",
        openLibraryUrl: "https://openlibrary.org" + book.key
      };
    });

    var template = $("#book-card-template").html();  //code referenced from class example (m4)
    var html = Mustache.render(template, { books: collectionData });
    $("#bookCollection").html(html);
  })
  .fail(function () {
    $("#bookCollection").html("<p>Collection unavailable.</p>");
  });
});
