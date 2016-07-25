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
 *  Send GET request on Wikipedia API with searched text
 * @param query Searched text
 * @param limit Maximum count of results
 * @param cl successful callback function
 * @param err error callback function
 */
function searchWiki(query, limit, cl, err) {
    var uri = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&limit="+ limit + "&search=" + query;
    if ("local" == "local") {
        uri = "http://cors.io/?u="+ encodeURIComponent(uri);
    }
    getJSON(uri, cl, err);
}
/* Helping functions (factories) */
function makeItem(heading, link, desc) {
    var item = document.createElement('li');
    var itemHeading = document.createElement('h2');
    var itemHeadingAnchor = document.createElement('a');
    itemHeadingAnchor.appendChild(document.createTextNode(heading));
    itemHeadingAnchor.href = link;
    itemHeading.appendChild(itemHeadingAnchor);

    var itemDescription = document.createElement('p');
    itemDescription.appendChild(document.createTextNode(desc));

    item.appendChild(itemHeading);
    item.appendChild(itemDescription);

    return item;
}
function makeErrorItem(msg) {
    var item = document.createElement('li');
    var itemHeading = document.createElement('h2');
    itemHeading.appendChild(document.createTextNode(msg));
    item.appendChild(itemHeading);
    return item;
}
function makeAutcompleteItem(text){
    var item = document.createElement('li');
    item.appendChild(document.createTextNode(text));
    var a = function (a) {
        item.addEventListener("click", function () {
            document.getElementById("search-input").value = a;
            e.stopPropagation();
            search();
        });
    }(text);
    return item;
}
/**
 * Function, which handles searching and showing results
 */
function search() {
    document.getElementById("autocomplete").style.visibility = "hidden";
    var list = document.getElementById("results");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    searchWiki(document.getElementById("search-input").value, 100, function (response) {
        if (response[1].length === 0) {
            list.appendChild(makeErrorItem("Nothing found."));
        }
        for (var i = 0; i < response[1].length; i++) {
            list.appendChild(makeItem(response[1][i],response[3][i],response[2][i]));
        }
    }, function () {
        list.appendChild(makeErrorItem("Error."));
    });
}
/**
 * Function, which handles autocomplete searching and showing results
 */
function autocomplete() {
    var list = document.getElementById("autocomplete");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    searchWiki(document.getElementById("search-input").value, 5, function (response) {
        document.getElementById("autocomplete").style.visibility = response[1].length === 0 ? "hidden" : "visible";
        for (var i = 0; i < response[1].length; i++) {
            list.appendChild(makeAutcompleteItem(response[1][i]));
        }
        x = -1;
    }, function () {});
}

document.getElementById("search-button").addEventListener("click", search); // Big button
document.getElementById("search-button2").addEventListener("click", search); // Small button
document.getElementById("search-input").addEventListener("keyup", function (e) { // Autocomplete
    if (e.keyCode == 13) { // Enter
        search();
    }
    else if(e.key == "ArrowDown" || e.key == "ArrowUp") {
        var list = document.getElementById("autocomplete").childNodes;
        if (e.key == "ArrowDown" && x + 1 < list.length ) x++;
        if (e.key == "ArrowUp" && x > -1 ) x--;
        for (var i = 0; i < list.length; i++)
            list[i].style.backgroundColor = "transparent";
        if (x < 0) return;
        document.getElementById("search-input").value = list[x].innerHTML;
        list[x].style.backgroundColor = "white";
    }
    else if(e.key == "Escape") {
        document.getElementById("autocomplete").style.visibility = "hidden";
    }
    else {
        autocomplete();
    }
});
window.addEventListener("click", function(){ // Hide autocomplete results, when user click out of autocomplete box
    document.getElementById("autocomplete").style.visibility = "hidden";
});