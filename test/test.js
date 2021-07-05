var assert = require("assert");
let faker = require("faker")
let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../app");
let expect = chai.expect;

chai.use(chaiHttp);

const createdID = []

describe ("CRUD Operations", function(){
    it ("Should Create a Course", (done)=>{
        const course = {
            name: faker.random.words(),
        }

        chai.request(app)
            .post("/api/courses")
            .send(course)
            .end((err, res)=>{
                if (err) return done(err);
                console.log("----------------------------------------------------------------------");
                console.log("\n");
                console.log("Check Status Code: ", expect(res.status).to.be.equal(200));
                console.log("Check Body is an Array: ", expect(res.body).to.be.instanceOf(Object));
                console.log("Check the body have property named name: ", expect(res.body).to.have.property('name').equals(course.name))
                createdID.push(res.body.id)
                done()
            })
    })

    it('Should NOT Create a course without name', (done) => {
        const course = {}
        chai
          .request(app)
          .post('/api/courses')
          .send(course)
          .end((err, res) => {
            console.log("----------------------------------------------------------------------");
            console.log("\n");
            console.log("Check Status Code: ", expect(res.status).to.be.equal(400));
            console.log("Check Error Message Present: ", expect(res).to.have.property('error'));
            console.log("Error Response: ", res.text);
            done()
          })
      })

    it ("Should Fetch all the Courses", (done)=>{
        chai.request(app)
            .get("/api/courses")
            .end((err, res)=>{
                console.log("----------------------------------------------------------------------");
                console.log("\n");
                console.log("Check Status Code: ", expect(res.status).to.be.equal(200));
                console.log("Check Response is JSON: ", expect(res).to.be.json);
                console.log("Check Response is not null: ", expect(res.body).to.exist);
                console.log("Check Body is an Array: ", expect(res.body).to.be.instanceOf(Array));
                console.log("Check Body includes Objects: ", expect(res.body[0]).to.be.instanceOf(Object));
                
                done()
            })
    })

    it ("Should Fecth Course with specific id", (done)=>{
        const id = createdID.slice(-1).pop()
        chai.request(app)
            .get(`/api/courses/${id}`)
            .end((err, res)=>{
                console.log("----------------------------------------------------------------------");
                console.log("\n");
                console.log("Check Status Code: ", expect(res.status).to.be.equal(200));
                console.log("Check Body is an Object: ", expect(res.body).to.be.instanceOf(Object));
                console.log("Check the body have property name: ", expect(res.body).to.have.property('name'))
                console.log("Check the body have property id as expected: ", expect(res.body).to.have.property('id').equals(id))
                done()
            })
    })

    it ("Should Update an existing Course", (done)=>{
        const id = createdID.slice(-1).pop()
        const course = {
            name: "Course Updated",
          }

        chai.request(app)
            .put(`/api/courses/${id}`)
            .send(course)
            .end((err, res)=>{
                console.log("----------------------------------------------------------------------");
                console.log("\n");
                console.log("Check Status Code: ", expect(res.status).to.be.equal(200));
                console.log("Check Body is an Object: ", expect(res.body).to.be.instanceOf(Object));
                console.log("Check the body have property id as expected:", expect(res.body).to.have.property('id').eql(id))
                console.log("Check the body have property named name: ", expect(res.body).to.have.property('name').equals(course.name))
                createdID.push(res.body.id)
                done()
            })
    })

    it ("Should Delete an existing Course", (done)=>{
        const id = createdID.slice(-1).pop()
        
        chai.request(app)
            .delete(`/api/courses/${id}`)
            .end((err, res)=>{
                console.log("----------------------------------------------------------------------");
                console.log("\n");
                console.log("Check Status Code : ", expect(res.status).to.be.equal(200));
                console.log("Check Body is an Object: ", expect(res.body).to.be.instanceOf(Object));
                console.log("Check the body have property id as expected:", expect(res.body).to.have.property('id').eql(id))
                chai.request(app)
                .get(`/api/courses/${res.body.id}`)
                .end((err, res)=>{
                    console.log("\n");
                    console.log("Check Status Code : ", expect(res.status).to.be.equal(404));
                    done()
                })
            })
    })
});