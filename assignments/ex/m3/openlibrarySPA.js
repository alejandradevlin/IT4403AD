$(function () {
  var allBooks = []; //code taken from class example

  $("#go").on("click", function (event) {
    event.preventDefault(); //prevent page reload
    
    var searchBar = $("#searchBar").val().trim();

    if (!searchBar) {
        $("#results").html("Please enter a search term.");
        return;
    }

    $("#results").text("Loading...");
    $("#visible").show(); //show page number after search button is clicked
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
    .done(function(data) {
        allBooks = (data.docs || []).slice(0, 50); //code taken from class example
      
        if (!allBooks.length) {
            $("#results").text("No books available. Please try another search term.");
            return;
        } 

        let total = Math.min(Math.ceil(data.numFound / 10), 5);
        var select = $("#pageNumber");
        for (var i = 1; i <= total; i++) {
            var opt = document.createElement('option');
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

  $("#pageNumber").on("change", showPage); //taken from https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event. changes displayed books when new page number is selected.

function showPage() {
  $("#results").empty();

  var page = Number($("#pageNumber").val()); //code taken from class example.
  var pageBooks = allBooks.slice((page - 1) * 10, page * 10); //code taken from class example.

  for (var i = 0; i < pageBooks.length; i++) {
      let book = pageBooks[i]; //google gemini used for troubleshooting: was attempting to change var page/pagebooks into 'let' since the same error I faced in milestone 2 was occuring,
                                // I was changing the wrong variable. var book was changed to let book.

      var bookCard = $("<div>").addClass("book-card");
      
      var bookTitle = $("<p>"); //button logic taken from class example
      if (!book.title) {
          bookTitle.text("Title unavailable"); 
      } else {
          $("<button>", {
              type: "button",
              text: book.title
          }).on("click", function () {
              showDetails(book); 
          }).appendTo(bookTitle);
      }
      bookCard.append(bookTitle);

      var searchCover = "";
      if (!book.cover_i) {
          searchCover = "<div class='nocover'>Apologies, this cover isn't available.</div>";
      } else {
          searchCover = '<p><img src="https://covers.openlibrary.org/b/id/' + book.cover_i + '-S.jpg?default=false" alt="Book cover"></p>';
      }
      bookCard.append(searchCover);

      $("#results").append(bookCard);
  }
}

  //detail
function showDetails(book) { //function taken from class example
  var key = book.key;
  var workId = (book.key || "").split("/").pop();
  var author_name = book.author_name;

  $("#details").show(); // shows details since previously hidden with display=none
  $("#details").text("Loading details...");

  $.ajax({
    url: "https://openlibrary.org" + key + ".json",
    dataType: "json",
    timeout: 15000,
    data: {
      fields: "title,subjects,cover_id"
    } 
  })
  .done(function (data) {
    $("#details").empty();

    var bookTitle = "";
    if (!data.title) {
      bookTitle = "<p>Unknown Title</p>"; 
    } else {
      bookTitle = "<p>" + data.title + "</p>";
    }
    $("#details").append(bookTitle);

    $("#details").append("<p>Work ID: " + workId + "</p>");

    var author = "";
    if (!author_name) {
        author = "<p>No author for this title.</p>";
    } else {
        author = "<p>" + author_name + "</p>";
    }
    $("#details").append(author);

    var description = "";
    if (!data.description) {
        description = "<p>No description available for this title.</p>";
    } else if (data.description.value) {
        description = "<p>" + data.description.value + "</p>";
    } else {
        description = "<p>" + data.description + "</p>";
    }
    $("#details").append(description);

    if (!data.subjects || data.subjects.length == 0) {
        $("#details").append("<p>No subjects available for this title.</p>")
    } else {
        for (let i = 0; i <= 10; i++) {
            if (!data.subjects[i]) {
                break;
            } else {
                $("#details").append("<i>" + data.subjects[i] + "</i> | ");
            }
        }
    }

    var bookCover = "";
    if (!data.covers || data.covers.length === 0) {
        bookCover += "<p>No Cover Available</p>"; 
    } else {
        bookCover = '<p><img src="https://covers.openlibrary.org/b/id/' + data.covers[0] + '-M.jpg?default=false"></p>';                  
    }        
    $("#details").append(bookCover);

    var link = '<a href="https://openlibrary.org' + key + '" target="_blank">View on Open Library</a>';
    $("#details").append(link);

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
    $("#bookCollection").append("<h3>Children's Book Collection</h3>"); //before loop so it prints a single time

    $.each(data.works, function(index, book) {

      var bookTitle = $("<p>"); //button logic taken from class example
      if (!book.title) {
          bookTitle.text("Title unavailable");
      } else {
          $("<button>", {// button logic taken from class example 
              type: "button",
              text: book.title
          }).on("click", function () {
              showDetails(book);
          }).appendTo(bookTitle);
      }
      $("#bookCollection").append(bookTitle);

      var bookCover = "";
      if (!book.cover_id) {
          bookCover += "<div class='nocover'>Apologies, this cover isn't available.</div>";
      } else {
          bookCover += '<p><img src="https://covers.openlibrary.org/b/id/' + book.cover_id + '-S.jpg?default=false"></p>';
      }
      $("#bookCollection").append(bookCover);
    });
  })
  .fail(function () {
    $("#bookCollection").html("<p>Collection unavailable.</p>");
  });
});
