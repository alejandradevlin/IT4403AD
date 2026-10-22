const workIds = ["OL20542W", "OL17268007W", "OL453799W","OL17798885W","OL50567W"]; //code for this line taken from class example code.

$(document).ready(function(){
    for (i in workIds) {
        let url = "https://openlibrary.org/works/" + workIds[i] + ".json";
        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
                
            var bookTitle = "";
            var bookCover = "";

            if (!data.title) {
                bookTitle += "<p>Unknown Title</p>";
            } else {
                bookTitle = "<p>"+ data.title + "</p>"
            }
            $("#results").append(bookTitle);

            if (!data.covers) {
                bookCover += "<p>No Cover Available</p>"; 
            } else {
                bookCover = '<p><img src="https://covers.openlibrary.org/b/id/' + data.covers[0] + '-M.jpg"></p>';                    
            }        
            $("#results").append(bookCover);
        });
    }
});