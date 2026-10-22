const workIds = ["OL50567W", "OL20542W", "OL17268007W", "OL453799W","OL17798885W"]; //code for this line taken from class example code.

$(document).ready(function(){
    for (i in workIds) {
        let url = "https://openlibrary.org/works/" + workIds[i] + ".json";
        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data); 

            var bookTitle =""
            if (!data.title) {
                bookTitle += "<p>Unknown Title</p> " 
            } else {
                bookTitle = '<p><a href="details.html?workId=' + workIds[i] + '">' + data.title + '</a></p>';
            }
            $("#results").append(bookTitle);

            var bookCover = "";
            if (!data.covers) {
                bookCover += "<p>No Cover Available</p>"; 
            } else {
                bookCover = '<p><img src="https://covers.openlibrary.org/b/id/' + data.covers[0] + '-M.jpg"></p>';                    
            }        
            $("#results").append(bookCover);
        });
    }
});
