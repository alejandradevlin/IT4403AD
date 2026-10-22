const workId = new URLSearchParams(location.search).get("workId"); //code for this line taken from class example code.

let url = "https://openlibrary.org/works/" + workId + ".json"; 

$(document).ready(function(){
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data); 
    
        var bookTitle = "";
        if (!data.title) {
            bookTitle += "<p>Unknown Title</p>";
        } else {
            bookTitle = "<p>"+data.title+"</p>"
        }
        $("#results").append(bookTitle);


        var id = "<p>Work ID: " + workId + "</p>"
        $("#results").append(id);

        if (!data.subjects || data.subjects.length == 0) {
            $("#results").append("<p>No subjects available for this title.</p>");
            } else {
                for (let i = 0; i <= 10; i++) {
                    if (!data.subjects[i]) {
                        break;
                    } else {
                        $("#results").append("<i>" + data.subjects[i] + "<i> | ");
                }
            }
        }

        var description = ""
        if (!data.description) {
            description = "<p>No description available for this title.</p>";
        } else if (data.description.value) {
            description = "<p>" + data.description.value + "</p>";
        } else {
            description = "<p>" + data.description + "</p>";
        }

        $("#results").append(description);

        var bookCover = ""
        if (!data.covers) {
        bookCover += "<p>No Cover Avaliable</p>" 
        } else {
            bookCover = '<p><img src="https://covers.openlibrary.org/b/id/' + data.covers[0] + '-M.jpg?default=false"></p>';                    
        }        
        $("#results").append(bookCover);

        var link = "<p><a href=https://openlibrary.org/works/"+ workId +">Open Library Record</a></p>"
        $("#results").append(link);

    });
});

