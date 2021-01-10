/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let id = '';

// all 10 functional tests requiredd are complete and passing

suite("Functional Tests", function() {

  suite("Routing tests", function() {
  
    // Tests 1 & 2
    suite("POST /api/books with title => create book object/expect book object", function() {
        // test 1
        test("1 Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "Test Book"
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, 'Test Book');
              assert.isNotNull(res.body._id);
              id = res.body._id;
              done();
            });
        }); // Closes Test 1

        // test 2
        test("2 Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({})
            .end(function(err, res) {
              assert.equal(res.body, "missing required field title");
              done();
            });
        }); // Closes Test 2
      }); // Closes Suite "POST /api/books with title => create book object/expect book object"

    // Test 3
    suite("GET /api/books => array of books", function() {

      // test 3
      test("3 Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      }); // Closes Test 3
    }); // Closes Suite "GET /api/books => array of books"

    // Tests 4 & 5
    suite("GET /api/books/[id] => book object with [id]", function() {
      // test 4
      test("4 Test GET /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .get("/api/books/" + "id not in db")
          .end(function(err, res) {
            assert.equal(res.body, "no book exists");
            done();
          });
      }); // Closes Test 4

      // test 5
      test("5 Test GET /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .get("/api/books/" + id)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            assert.equal(res.body.title, "Test Book");
            done();
          });
      }); // Closes Test 5
    }); // Closes Suite "GET /api/books/[id] => book object with [id]"

    // Tests 6, 7 & 8
    suite("POST /api/books/[id] => add comment/expect book object with id", function() {

      // test 6
        test("6 Test POST /api/books/[id] with comment", function(done) {
          chai
            .request(server)
            .post("/api/books/" + id)
            .send({
              comment: "test comment"
            })
            .end(function(err, res) {
              assert.isTrue(res.body.comments.includes("test comment"));
            done();
           });
          }); // Closes Test 6

         // test 7
         test("7 Test POST /api/books/[id] without comment field", function(done) {
           chai
             .request(server)
             .post("/api/books/" + id)
             .end(function(err, res) {
               assert.equal(res.status, 200);
               assert.equal(res.body, "missing required field comment");
               done();
             });
          }); // Closes Test 7

          // test 8
          test("8 Test POST /api/books/[id] with comment, id not in db", function(done) {
            chai
              .request(server)
              .post('/api/books/invalid')
              .send({ comment: "Test" })
              .end(function(err, res) {
                assert.equal(res.body, "no book exists");
                done();
              });
          }); // Closes Test 8
        }); // Closes Suite "POST /api/books/[id] => add comment/expect book object with id"

    // Tests 9 & 10
    suite("DELETE /api/books/[id] => delete book object id", function() {

      // test 9
      test("9 Test DELETE /api/books with valid id in db", function(done) {
            chai
              .request(server)
              .delete("/api/books/" + id)
              .end(function(err, res) {
                assert.equal(res.body, "delete successful");

                done();
              });
          }); // Closes Test 9

      // test 10
      test("10 Test DELETE /api/books with id not in db", function(done) {
            chai
              .request(server)
              .delete("/api/books/id not in db")
              .end(function(err, res) {
                assert.equal(res.body, "no book exists");
                done();
              });
          }); // Closes Test 10
    }); // Closes Suite "DELETE /api/books/[id] => delete book object id"

  }); // Closes Suite "Routing Tests"
  
}); // Closes Suite "Functional Tests"
