var books = []

class Book{
    constructor(bookId, bookTitle, bookAuthor, bookReview, bookImage)
    {
        this.bookId = bookId
        this.bookTitle = bookTitle
        this.bookReview = bookReview
        this.bookAuthor = bookAuthor
        this.bookImage = bookImage
    }

    equals(other)
    {
        if(this.bookId === other.bookId)
        {
            return true
        }
        return false
    }


}

function pushBook(requestBook)
{
    for(let book of books)
    {
        if(book.equals(requestBook))
        {
            return false
        }
    }
    books.push(requestBook)
    return true
}

function deleteBook(bookId)
{
    let index = -1
    let count = 0
    for(let book of books)
    {
        if(book.bookId == bookId)
        {
            index = count
            break;
        }
        count = count + 1
    }
    if (index > -1) {
        books.splice(index, 1);
        return true
    }
    else
    {
        return false
    }
}

function searchBook(bookId)
{
    for(let book of books)
    {
        if(book.bookId == bookId)
        {
            return book
        }
    }
}

function searchKeywords(keywords)
{
    let temp = []
    for(let book of books)
    {
        let wordsExist = true;
        let text = book.bookTitle + " " + book.bookAuthor
        let textToLowerCase = text.toLowerCase()
        for(keyword of keywords)
        {
            if(textToLowerCase.indexOf(keyword) === -1)
            {
                wordsExist = false
                break
            }
        }
        if(wordsExist)
        {
            temp.push(book)
        }
    }
    return temp
}

function getArray()
{
    return books
}

module.exports =
{
    add : pushBook,
    delete : deleteBook,
    search : searchBook,
    booksWithKeywords : searchKeywords,
    constructor : Book,
    listOfBooks : getArray
}

