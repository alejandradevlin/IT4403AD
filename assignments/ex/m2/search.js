function search(page){

    var searchBar = $("#searchBar").val(); //grab keyword entered into form element #searchBar

    if (!searchBar) {
        $("#results").html("Please enter a search term."); //can't use append, it just keeps printing.
            return
        }
    let url = "https://openlibrary.org/search.json?q="+ searchBar + "&fields=key,title,cover_i&limit=10&page=" + page;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
    console.log(data.docs); 
    
    $("#results").empty(); //needed to "empty" the html prev. loaded into #results when using a new search term
    $("#visible").show(); //show page select after search has been made

    $("#pageNumber").empty(); 
        let total = Math.min(Math.ceil(data.numFound / 10), 6); //code for this line is from class example
        var select = $('#pageNumber');

        for (var i = 1; i <= total; i++){ //pagination code referenced here https://stackoverflow.com/questions/8674618/adding-options-to-select-with-javascript 
            var opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = i;
            select.append(opt);
        }
        $("#pageNumber").val(page);  //grab page number append to selector
    
        $.each(data.docs, function(index, book) {

            const workId = book.key.split("/").pop(); //code for this line taken from class example code.

            var bookTitle =""
            if (!book.title) {
                bookTitle += "<p>Unknown Title</p> " 
            } else {
                bookTitle = '<p><a href="details.html?workId=' + workId + '">' + book.title + '</a></p>';
            }
            $("#results").append(bookTitle);

            var bookCover =""
            if (!book.cover_i) {
                bookCover += "<div class='nocover'>Apologies, this cover isn't available.</div>" 
            } else {
                bookCover = '<p><img src="https://covers.openlibrary.org/b/id/' + book.cover_i + '-S.jpg?default=false"></p>';                    
            }        
            $("#results").append(bookCover);
    });
});

}
$(document).ready(function() {
    $("#search").submit(function() {
        search(1); //recalls function at page 1
        return false; //prevents page from refreshing when searching and clear the field
    });

    $("#pageNumber").change(function() {
        search($('#pageNumber').val());
    });
});