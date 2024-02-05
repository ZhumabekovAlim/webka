use('University');

db.createCollection("Courses")
db.createCollection("Enrollments")

db.Students.insertMany([
    { name: "Alim", age: 19, email: "alim@example.com" },
    { name: "Malika", age: 18, email: "malika@example.com" }
  ]);

db.Courses.insertMany([
    { title: "Mathematics", description: "Introduction to calculus", credits: 3 },
    { title: "Computer Science", description: "Programming fundamentals", credits: 4 }
]);

db.Enrollments.insertMany([
    {
        student_id: "658d1a2710471f0b765c4289",
        course_id: "658d1a5010471f0b765c428b",
        enrollment_date: new Date() 
    },
]);

db.Enrollments.createIndex({ student_id: 1 })
db.Enrollments.createIndex({ course_id: 1 })

//CRUD Operations
//Students CRUD
db.Students.find();
db.Students.find({ age: { $gt: 19 } })
db.Students.find({ email: { $eq: "alice@example.com" } })
db.Students.updateOne(
    { name: "Bob" },
    { $set: { email: "bob2@example.com" } }
);
db.Students.deleteOne({ name: "Bob" });

//Courses CRUD
db.Courses.insertOne({ title: "Physics", description: "Introductory physics", credits: 5 });
db.Courses.find()
db.Courses.find({ credits: { $lte: 3 } })
db.Courses.find({ title: { $eq: "Mathematics" } })
db.Courses.updateOne(
    { title: "Physics" },
    { $set: { description: "Physics 2.0" } }
);
db.Courses.deleteOne({ title: "Physics" });

//Enrollments CRUD
use('University');
db.Enrollments.insertOne({
    student_id: "658d1a2710471f0b765c428a",
    course_id: "658d1a5010471f0b765c428c",
    enrollment_date: new Date()
});
db.Enrollments.find()
db.Enrollments.find({ student_id: { $eq: "658d1a2710471f0b765c4289" } })
db.Enrollments.find({ course_id: { $in: ["658d1a5010471f0b765c428b", "658d1a5010471f0b765c428c"] } })
db.Enrollments.updateOne(
    { student_id: "658d1a2710471f0b765c4289", course_id: "658d1a5010471f0b765c428b" },
    { $set: { enrollment_date: new Date("2024-01-01") } }
);
db.Enrollments.deleteOne({ student_id: "658d1a2710471f0b765c4289", course_id: "658d1a5010471f0b765c428b" });

//Aggregation Framework
db.Students.aggregate([
    {
      $group: {
        _id: null,
        averageAge: { $avg: "$age" }
      }
    }
]);

db.Enrollments.aggregate([
    {
        $sort: { "enrollment_date": -1}
    },
    {
        $project: {
            "course_id": 1,
            "student_id":0,
            "enrollment_date":1
        }  
    }
  ]);

  use('University');
db.Students.aggregate([
    {
        $match: {
            age: 18
        }
    },
    {
        $count : "ageCount"
    }
])

//Indexes
use('University');
db.Students.createIndex({ age: 1 })
db.Students.createIndex({ email: 1 })

db.Courses.createIndex({ credits: 1 })
db.Courses.createIndex({ title: 1 })

use('University');
db.Students.find({ age: { $gt: 18 } }).explain("executionStats");

use('University');
db.Students.createIndex({ name: "text" })
db.Students.find({ $text: { $search: "Alice" } })


//Geospatial Queries
use('University')
db.StudentsTree.createIndex({ location: "2dsphere" })
const givenLocation = {
    type: "Point",
    coordinates: [12, 32] 
  };
  
  db.Students.find({
    location: {
      $near: {
        $geometry: givenLocation,
        $maxDistance: 1000 
      }
    }
  });

  //Data Validation
  use('University')
  const studentSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age", "email"],
      properties: {
        name: {
          bsonType: "string"
        },
        age: {
          bsonType: "int",
          minimum: 16,
          maximum: 100
        },
        email: {
          bsonType: "string"
        }
      }
    }
  };
  db.createCollection("StudentsValidate", { validator: studentSchema })


  //Transaction
const session = db.getMongo().startSession();

session.startTransaction();

try {

  db.Enrollments.deleteOne(
    { student_id: studentId, course_id: currentCourseId },
    { session }
  );

  db.Enrollments.insertOne(
    { student_id: studentId, course_id: newCourseId },
    { session }
  );

  session.commitTransaction();
} catch (error) {
  print("Transaction errror:", error);
  session.abortTransaction();
} finally {
  session.endSession();
}

// mongodump --db University --out E:\Рабочий стол\mongodb
