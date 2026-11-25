
const express = require("express");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));
const courses = require("./data/courses");
// Set EJS as the template engine
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Serve static files like CSS and images
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
    res.render("pages/index", {
        title: "Home",
        courses: courses
    });
});



app.get("/courses", (req, res) => {

    // Get search and category values from URL
    const search = req.query.search || "";
    const selectedCategory = req.query.category || "All";

    // Start with all courses
    let filteredCourses = courses;

    // Filter by category
    if (selectedCategory !== "All") {
        filteredCourses = filteredCourses.filter(course =>
            course.category === selectedCategory
        );
    }

    // Filter by course name
    if (search.trim() !== "") {
        filteredCourses = filteredCourses.filter(course =>
            course.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Get unique categories
    const categories = [...new Set(
        courses.map(course => course.category)
    )];

    // Render Courses page
    res.render("pages/courses", {
        title: "Courses",
        courses: filteredCourses,
        categories: categories,
        selectedCategory: selectedCategory,
        search: search
    });

});

// About route
app.get("/about", (req, res) => {
    res.render("pages/about", {
        title: "About Us"
    });
});

// Individual Course Details
app.get("/courses/:id", (req, res) => {

    const courseId = Number(req.params.id);

    const course = courses.find(c => c.id === courseId);

    if (!course) {
        return res.status(404).render("pages/404", {
            title: "Page Not Found"
        });
    }

    res.render("pages/course-detail", {
        title: course.name,
        course: course
    });

});

// Display the enrollment form
app.get("/enroll/:id", (req, res) => {

    const course = courses.find(
        course => course.id === Number(req.params.id)
    );

    if (!course) {
        return res.status(404).render("pages/404", {
            title: "Page Not Found"
        });
    }

    res.render("pages/enroll", {
        title: "Course Enrollment",
        course: course
    });

});

// Process the enrollment form
app.post("/enroll/:id", (req, res) => {

    const course = courses.find(
        course => course.id === Number(req.params.id)
    );

    if (!course) {
        return res.status(404).render("pages/404", {
            title: "Page Not Found"
        });
    }

    const studentName = req.body.name;

    res.render("pages/enrollment-success", {
        title: "Enrollment Successful",
        studentName: studentName,
        course: course
    });

});




// Handle unknown URLs
app.use((req, res) => {

    res.status(404).render("pages/404", {
        title: "Page Not Found"
    });

});
// Start the server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

