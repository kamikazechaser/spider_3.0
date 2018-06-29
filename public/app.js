/**
 * Spider Task 3
 * Mohamed Sohail
 */

$(document).ready(() => {
    $("#input-id").rating({ size: "sm", animate: false, showCaption: false, showClear: false});

    $.get("/api/bookstatus", ctx => {
        if (ctx.length > 0) {
            const data = ctx[0];

            if (data.read !== null) {
               $(".selectpicker").selectpicker("val", data.read);
            }

            if (data.rating !== null) {
                $("#input-id").rating("update", parseFloat(data.rating));
            }
        }
    });

    $("#input-id").on("rating:change", (event, value, caption) => {
        const title = $("#title").text();
        const author = (/(Author: )([\S\s]*)/ig).exec($("#author").text())[2];

        return $.post("/api/newrating", { rating: value, title: `${title} - ${author}` });
    });

    $("#status").on("changed.bs.select", event => {
        const title = $("#title").text();
        const author = (/(Author: )([\S\s]*)/ig).exec($("#author").text())[2];
        const value = $("#status").val()

        return $.post("/api/newstatus", { status: value, title: `${title} - ${author}` });
    });

    $("#profilecheck").click(() => {
        const value = $("#profilecheck").prop("checked");

        return $.post("/api/profilevisibility", { visibility: value }); 
    });

    $("#favourite").click(() => {
        const title = $("#title").text();
        const author = (/(Author: )([\S\s]*)/ig).exec($("#author").text())[2];

        return $.post("/api/newfavourite", { title: `${title} - ${author}`}).fail(res => {
            if (res.status === 409) {
                $("#favourite").tooltip({ title: res.responseJSON.message });
                $("#favourite").addClass("disabled");
            }
        })
    });

    $("#library").click(() => {
        const title = $("#title").text();
        const author = (/(Author: )([\S\s]*)/ig).exec($("#author").text())[2];

        return $.post("/api/newlibrary", { title: `${title} - ${author}`}).fail(res => {
            if (res.status === 409) {
                $("#library").tooltip({ title: res.responseJSON.message });
                $("#library").addClass("disabled");
            }
        });
    })

    const maxSearch = 5;
    let searchBy = "";

    $("#searchbar").on("changed.bs.select", (e) => {
        const val = $("#searchbar").val();

        switch (val) {
            case "Author":
                searchBy = "inauthor:";
                break;
            case "ISBN":
                searchBy = "isbn:";
                break;
            case "Publisher":
                searchBy = "inpublisher:";
                break
            default:
                searchBy = "intitle:";
                break;
        }
    });

    $("#autocomplete").autocomplete({
        minChars: 3,
        lookup: function(name, done) {
            $.ajax({
                type: "GET",
                dataType: "json",
                // Just a demo key, dont abuse it!
                url: `https://www.googleapis.com/books/v1/volumes?q=${searchBy}${name}&key=AIzaSyCOZLUJvNAtBASWnOzub9_G6NaWBU30zbc`,
                success: function(data) {
                    const search = data;
                    const searchResults = [];

                    for (let i = 0; i < search.items.length; i++) {
                        if (search.items[i].volumeInfo.authors === "undefined") {
                            const searchResult = {
                                value: `${search.items[i].volumeInfo.title} by ${search.items[i].volumeInfo.authors}`,
                                data: search.items[i].id
                            }
                            searchResults.push(searchResult);
                        } else {
                            const searchResult = {
                                value: search.items[i].volumeInfo.title,
                                data: search.items[i].id
                            }
                            searchResults.push(searchResult);
                        }

                    }
                    const result = {
                        suggestions: searchResults
                    }

                    done(result);
                }
            });
        },
        onSelect: function(result) {
            window.location.href = `/api/book/${result.data}`
        }
    });
});