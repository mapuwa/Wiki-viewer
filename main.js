/**
 * Send GET request on the url a call function with parsed JSON or with error
 * @param url url with JSON
 * @param cl function, which is called with parsed JSON
 * @param err function, which is called, when error occurs.
 */
function getJSON(url, cl, err){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (oEvent) {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200)
                cl(JSON.parse(xhttp.responseText));
            else
                err("Error", xhttp.statusText);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

/**
 * Wikipedia API queries
 * ######################
 *
 * Search
 * ======
 * https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=php
 * Array- first item = query
 *        second item = results names
 *        third item = results descriptions
 *        fourth item = results links
 *
 * Random page
 * ===========
 * https://en.wikipedia.org/wiki/Special:Random
 */
function searchWiki(query, limit, cl, err) {
    var uri = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&limit="+ limit + "&search=" + query;
    if ("local" == "local") {
        uri = "http://cors.io/?u="+ encodeURIComponent(uri);
    }
    getJSON(uri, cl, err);
}

document.getElementById("search-button").addEventListener("click", function () {
    var list = document.getElementById("results");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    searchWiki(document.getElementById("search-input").value, 100, function (response) {
        if (response[1].length === 0) {
            var item = document.createElement('li');
            var itemHeading = document.createElement('h2');
            itemHeading.appendChild(document.createTextNode("Nothing found."));
            item.appendChild(itemHeading);
            list.appendChild(item);
        }
        for (var i = 0; i < response[1].length; i++) {
            var item = document.createElement('li');

            var itemHeading = document.createElement('h2');
            var itemHeadingAnchor = document.createElement('a');
            itemHeadingAnchor.appendChild(document.createTextNode(response[1][i]));
            itemHeadingAnchor.href = response[3][i];
            itemHeading.appendChild(itemHeadingAnchor);

            var itemDescription = document.createElement('p');
            itemDescription.appendChild(document.createTextNode(response[2][i]))

            item.appendChild(itemHeading);
            item.appendChild(itemDescription)
            list.appendChild(item);
        }
    }, function () {
        var item = document.createElement('li');
        var itemHeading = document.createElement('h2');
        itemHeading.appendChild(document.createTextNode("Error"));
        item.appendChild(itemHeading);
        list.appendChild(item);
    });
});
document.getElementById("search-input").addEventListener("keydown", function (e) {
    console.log(e);
    if(e.keyCode == 13) { // Enter

    }
});