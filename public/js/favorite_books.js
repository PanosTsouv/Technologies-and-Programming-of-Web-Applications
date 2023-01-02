window.addEventListener("load", () => {
    let detailsButtons = document.getElementsByClassName("details")
    let deleteButtons = document.getElementsByClassName("delete")
    for(let detailsButton of detailsButtons)
    {
        detailsButton.addEventListener("click", function() {
            detailsButtonAction(detailsButton.getAttribute("id"))
        })
    }
    for(let deleteButton of deleteButtons)
    {
        deleteButton.addEventListener("click", function() {
            deleteButtonAction(deleteButton.getAttribute("id"))
        })
    }
})

function deleteButtonAction(id)
{
    deleteRequest(id)
}

function filterButtonAction()
{
    let pressInput = document.getElementById("filter_key");
    let keywords = pressInput.value;
    console.log("keywords")
    console.log(keywords)
    filterRequest(keywords)
}

function detailsButtonAction(id)
{
    detailsRequest(id)
}

function updateBook(id)
{
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let book= {
        id : id.toString(),
        title : document.getElementById("title_form").value,
        author : document.getElementById("author_form").value,
        review : document.getElementById("review-text_area").value,
        image : document.getElementById("image").src
    }

    console.log("Update Request As Object is : \n", book)

    let init = {
        mode : "cors",
        method: "POST",
        headers : myHeaders,
        body: JSON.stringify(book)
    }

    console.log("Update Request As JSON is : \n", JSON.stringify(book))

    fetch('http://localhost:8080/book/update', init)
    .then(function(response){ 
        console.log("Response From Update Request Is : \n",
                    response)
        alert("submit was successful")
        return response.json()
    })
    .then(data => {
        console.log('Success:', data);
        //window.location = "http://localhost:8080/books"
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}