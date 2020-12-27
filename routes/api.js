/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
let mongodb = require('mongodb');
let mongoose = require('mongoose');

let uri = 'mongodb+srv://khushi-saini-1723:' + process.env.PW +'@cluster0.p1sar.mongodb.net/<dbname>?retryWrites=true&w=majority'
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);


module.exports = function (app) {

 	let bookSchema = new mongoose.Schema({
		title: {type: String, required: true},
		comments: [String]
	})

	let Book = mongoose.model('book', bookSchema)

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
			let arrayOfBooks =[]
			Book.find(
				{},
				(error, results) => {
					if(!error && results){
						results.forEach((result) => {
							let book = result.toJSON()
              	book['commentcount'] = book.comments.length
							arrayOfBooks.push(book)
						})
						return res.json(arrayOfBooks)
					}
				}
			)
    })
    
    .post(function (req, res){
      var title = req.body.title;
			if(!title){
				return res.json('missing required field title')
			}
      //response will contain new book object including atleast _id and title
			let newBook = new Book({
				title: title,
			})
			newBook.save((error, savedBook) => {
				if(!error && savedBook){
					res.json(savedBook)
				}
			})
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
			Book.deleteMany(
				{},
				(error, jsonStatus) => {
					if(!error && jsonStatus){
						return res.json('complete delete successful')
					}
				}
			)
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
			Book.findById(
				bookid,
				(error, result) => {
					if(!error && result){
						return res.json(result)
					}else if(!result){
						return res.json('no book exists')
					}
				}
			)
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
    	if(!req.body.comment){
				return res.json('missing required field comment')
			}
      //json res format same as .get
			Book.findByIdAndUpdate(
				bookid,
				{$push: {comments: comment}},
				{new: true},
				(error, updatedBook) => {
					if(!error && updatedBook){
						return res.json(updatedBook)
					}else if(!updatedBook){
						return res.json('no book exists')
					}
				}
			)
    })
    
  .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
			Book.findByIdAndRemove(
				bookid,
				(error, deletedBook) => {
					if(!error && deletedBook){
						return res.json('delete successful')
					}else if(!deletedBook){
						return res.json('no book exists')
					}
				}
			)
    });
  
};
