
const subjects = [
  {
    id: 1,
    name: "DBMS",
    description: "Database Management System",

    topics: [
      {
        unit: "Unit 1",
        title: "Introduction to DBMS",
        description: "Learn DBMS basics and database concepts.",

        studyMaterial: {
          heading: "What is DBMS?",

          explanation:
            "A Database Management System (DBMS) is software used to create, store, organize, manage and retrieve data efficiently.",

          realWorldExample: {
            title: "College Student Management System",

            scenario:
              "A college stores information about 5,000 students, including names, roll numbers, courses, attendance and marks.",

            working:
              "The DBMS stores this information in organized tables. An administrator can search for a student's roll number and retrieve the required information."
          }
        },

        importantPoints: [
          "DBMS stands for Database Management System.",
          "It helps store and retrieve data efficiently.",
          "It reduces unnecessary data duplication.",
          "It provides data security and access control.",
          "It helps maintain data consistency."
        ],

        quiz: [
          {
            question: "What is the primary purpose of a DBMS?",

            options: [
              "To design web pages",
              "To manage and organize data",
              "To create computer hardware",
              "To edit images"
            ],

            answer: "To manage and organize data",

            explanation:
              "A DBMS manages databases by allowing users to store, organize, update and retrieve data efficiently."
          },

          {
            question: "Which real-world application commonly uses a DBMS?",

            options: [
              "Student management system",
              "A simple text editor",
              "A calculator without data storage",
              "A basic image viewer"
            ],

            answer: "Student management system",

            explanation:
              "A student management system stores student records, attendance, marks and course information in a database."
          },

          {
            question: "Which feature helps protect database information from unauthorized access?",

            options: [
              "Data security",
              "Data duplication",
              "Data formatting",
              "Data printing"
            ],

            answer: "Data security",

            explanation:
              "DBMS security features use permissions and access controls to restrict unauthorized users."
          }
        ]
      },

      {
        unit: "Unit 2",
        title: "ER Model",
        description: "Learn entities, attributes and relationships."
      },

      {
        unit: "Unit 3",
        title: "SQL and Relational Algebra",
        description: "Learn SQL queries and relational operations."
      },

      {
        unit: "Unit 4",
        title: "Normalization",
        description: "Learn 1NF, 2NF, 3NF and BCNF."
      }
    ]
  },

  {
    id: 2,
    name: "Operating Systems",
    description: "Learn operating system concepts.",

    topics: [
      {
        unit: "Unit 1",
        title: "Introduction to Operating Systems",
        description: "Learn OS basics and functions."
      },

      {
        unit: "Unit 2",
        title: "Process Management",
        description: "Understand processes and scheduling."
      },

      {
        unit: "Unit 3",
        title: "Memory Management",
        description: "Learn paging and segmentation."
      },

      {
        unit: "Unit 4",
        title: "Disk Scheduling",
        description: "Understand disk scheduling algorithms."
      }
    ]
  },

  {
    id: 3,
    name: "Data Structures",
    description: "Learn data structures and algorithms.",

    topics: [
      {
        unit: "Unit 1",
        title: "Introduction to Data Structures",
        description: "Learn arrays, stacks and queues."
      },

      {
        unit: "Unit 2",
        title: "Linked Lists",
        description: "Understand singly and doubly linked lists."
      },

      {
        unit: "Unit 3",
        title: "Trees and Graphs",
        description: "Learn binary trees, BST and graphs."
      },

      {
        unit: "Unit 4",
        title: "Sorting and Searching",
        description: "Learn sorting and searching algorithms."
      }
    ]
  },

  {
    id: 4,
    name: "Web Technology",
    description: "Learn modern web development.",

    topics: [
      {
        unit: "Unit 1",
        title: "HTML Fundamentals",
        description: "Learn HTML elements and forms."
      },

      {
        unit: "Unit 2",
        title: "CSS and Styling",
        description: "Learn CSS layouts and responsive design."
      },

      {
        unit: "Unit 3",
        title: "JavaScript",
        description: "Learn JavaScript functions and DOM."
      },

      {
        unit: "Unit 4",
        title: "React Fundamentals",
        description: "Learn React components and hooks."
      }
    ]
  }
];

export default subjects;
