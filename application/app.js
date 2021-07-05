const Joi = require('joi');
const express = require('express');
const app = express();

// Parsing of JSON object in the body of Request
// As by default this feature is not enabled in Express
app.use(express.json());

const courses = [
    {id: 1, name: 'course 01'},
    {id: 2, name: 'course 02'},
    {id: 3, name: 'course 03'}
]

// GET - Hello World
app.get('/', (req, res) => {
    res.send('Hello World !!');
});

// GET - All courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// GET - Course by id
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send(`The course with the given ID: ${req.params.id} is not found`)
    res.send(course)
});

// POST - Create course with JOI
app.post('/api/courses', (req, res) => {
    // Validate
    // If invalid, return 400 - Bad Request
    const { error } = validateCourse(req.body);     // result.error
    if(error) return res.status(400).send(error.details[0].message)
        
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

// PUT - Update an existing course
app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404 - Not Found
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send(`The course with the given ID: ${req.params.id} is not found`)

    // Validate
    // If invalid, return 400 - Bad Request
    const { error } = validateCourse(req.body);     // result.error
    if(error) return res.status(400).send(error.details[0].message)

    // Update course
    course.name = req.body.name;

    // Return the updated course
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404 - Not Found
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send(`The course with the given ID: ${req.params.id} is not found`);

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the updated course
    res.send(course);
});

let validateCourse = (course) => {
    const schema = {
        name: Joi.string().min(3).required()
    }; 

    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on PORT ${port}...`));

module.exports = app;

