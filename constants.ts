import { Course, Language, Project } from './types';

export const INITIAL_PROGRESS = {
  completedLessonIds: [],
  completedProjectIds: [],
  hoursLearned: 0,
  streakDays: 0,
  lastLoginDate: new Date().toISOString(),
};

export const PROJECTS: Project[] = [
  {
    id: 'proj_py_1',
    title: 'Data Analysis Tool',
    difficulty: 'Beginner',
    language: Language.PYTHON,
    description: 'Build a tool that reads a CSV file and calculates the average of a specific column. This project tests your understanding of file I/O and loops.',
    starterCode: 'import csv\n\ndef calculate_average(filename, column_name):\n    """\n    Reads a CSV file and calculates the average of the specified column.\n    """\n    # Your code here\n    pass\n\n# Test your function\n# print(calculate_average("data.csv", "score"))'
  },
  {
    id: 'proj_java_1',
    title: 'Library Management System',
    difficulty: 'Intermediate',
    language: Language.JAVA,
    description: 'Create a class structure to manage books, patrons, and loans. You should implement classes for Book, Patron, and Library.',
    starterCode: 'public class Library {\n    public static void main(String[] args) {\n        // Initialize system\n        System.out.println("Library System Initialized");\n    }\n}\n\nclass Book {\n    // TODO: Add properties and methods\n}'
  },
  {
    id: 'proj_c_1',
    title: 'Memory Allocator',
    difficulty: 'Advanced',
    language: Language.C,
    description: 'Implement a simple version of malloc and free. This project requires deep understanding of pointers and memory management.',
    starterCode: '#include <stdio.h>\n#include <stdlib.h>\n\n// Simple block metadata\ntypedef struct Block {\n    size_t size;\n    struct Block* next;\n    int free;\n} Block;\n\nvoid* my_malloc(size_t size) {\n    // TODO: Implement allocation logic\n    return NULL;\n}\n\nint main() {\n    printf("Memory Allocator Started\\n");\n    return 0;\n}'
  }
];

export const COURSES: Course[] = [
  {
    id: 'course_python',
    language: Language.PYTHON,
    title: 'Python Programming',
    level: 'Beginner Level',
    description: 'Learn the most popular programming language for beginners. Perfect for data science, web development, and automation.',
    color: 'bg-cyan-500',
    icon: '🐍',
    lessons: [
      {
        id: 'py_1',
        title: 'Variables and Types',
        language: Language.PYTHON,
        content: `
          <h3>Introduction to Variables</h3>
          <p>In Python, variables are created when you assign a value to it. Python has no command for declaring a variable.</p>
          <br/>
          <p><strong>Example:</strong></p>
          <pre class="bg-gray-100 p-2 rounded">x = 5\ny = "Hello, World!"</pre>
          <p>Variables do not need to be declared with any particular type, and can even change type after they have been set.</p>
        `,
        initialCode: '# Create a variable named "greeting" and assign it "Hello softvibe"\n\n# Print the variable\n',
        solutionCode: 'greeting = "Hello softvibe"\nprint(greeting)'
      },
      {
        id: 'py_2',
        title: 'Lists and Loops',
        language: Language.PYTHON,
        content: `
          <h3>Python Lists</h3>
          <p>Lists are used to store multiple items in a single variable. Lists are one of 4 built-in data types in Python used to store collections of data.</p>
          <p><strong>Looping:</strong> You can loop through the list items by using a <code>for</code> loop.</p>
        `,
        initialCode: 'fruits = ["apple", "banana", "cherry"]\n# Loop through the list and print each fruit\n',
        solutionCode: 'fruits = ["apple", "banana", "cherry"]\nfor x in fruits:\n  print(x)'
      }
    ]
  },
  {
    id: 'course_java',
    language: Language.JAVA,
    title: 'Java Development',
    level: 'Intermediate Level',
    description: 'Master object-oriented programming with Java. Build robust applications and understand enterprise development.',
    color: 'bg-orange-500',
    icon: '☕',
    lessons: [
      {
        id: 'java_1',
        title: 'Hello World',
        language: Language.JAVA,
        content: '<h3>Your First Java Program</h3><p>Every Java application has a class definition, and the name of the class must match the filename.</p><p>The <code>main</code> method is required and you will see it in every Java program:</p>',
        initialCode: 'public class Main {\n  public static void main(String[] args) {\n    // Print "Hello World" to the console\n  }\n}',
        solutionCode: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}'
      }
    ]
  },
  {
    id: 'course_c',
    language: Language.C,
    title: 'C Programming',
    level: 'Intermediate Level',
    description: 'Understand the fundamentals of programming with C. Learn memory management and system-level programming.',
    color: 'bg-violet-500',
    icon: '⚡',
    lessons: [
      {
        id: 'c_1',
        title: 'Pointers Basics',
        language: Language.C,
        content: '<h3>Understanding Pointers</h3><p>A pointer is a variable whose value is the address of another variable.</p><p>The <code>&</code> operator creates a pointer to a variable.</p>',
        initialCode: '#include <stdio.h>\n\nint main() {\n  int myAge = 43;\n  // Declare a pointer variable "ptr" that stores the address of myAge\n  \n  return 0;\n}',
        solutionCode: '#include <stdio.h>\n\nint main() {\n  int myAge = 43;\n  int* ptr = &myAge;\n  printf("%p", ptr);\n  return 0;\n}'
      }
    ]
  }
];