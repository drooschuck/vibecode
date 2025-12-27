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
        title: 'Input/Output Practice',
        language: Language.PYTHON,
        content: `
          <h3>Activity: Basic Input/Output</h3>
          <p><strong>Concepts:</strong> Practice basic input and output functions (e.g., <code>print()</code> and <code>input()</code>) to gather and display simple text or numbers.</p>
          <p>Use <code>input()</code> to pause the program and wait for user data. Use <code>print()</code> to show results.</p>
        `,
        initialCode: '# Ask the user for their name\nname = input("Enter name: ")\n\n# Print a greeting using the name variable\n',
        solutionCode: 'name = input("Enter your name: ")\nage = input("Enter your age: ")\nprint(f"Hello {name}! You are {age} years old.")'
      },
      {
        id: 'py_2',
        title: 'Variable Declaration',
        language: Language.PYTHON,
        content: `
          <h3>Activity: Data Storage</h3>
          <p><strong>Concepts:</strong> Introduce variables to store input data and calculation results. Practice declaring, assigning, and using variables.</p>
        `,
        initialCode: '# Declare variables to store a favorite number and a city\n\n# Use print to describe these values in a sentence\n',
        solutionCode: 'fav_number = 7\ncity = "London"\nprint(f"My favorite number is {fav_number} and I live in {city}.")'
      },
      {
        id: 'py_3',
        title: 'Basic Selection',
        language: Language.PYTHON,
        content: `
          <h3>Activity: Even or Odd Checker</h3>
          <p><strong>Concepts:</strong> <code>if/else</code>, Modulo (<code>%</code>)</p>
          <p>The modulo operator <code>%</code> finds the remainder of a division. Even numbers always have a remainder of 0 when divided by 2.</p>
        `,
        initialCode: '# Get a number from the user\n\n# Use an IF statement with % to check if it is even\n',
        solutionCode: 'number = int(input("Enter a number: "))\n\n# The modulo operator (%) finds the remainder of a division\nif number % 2 == 0:\n    print("This number is even")\nelse:\n    print("This number is odd")'
      },
      {
        id: 'py_4',
        title: 'Multi-Condition Selection',
        language: Language.PYTHON,
        content: `
          <h3>Activity: Weather Clothing Advisor</h3>
          <p><strong>Concepts:</strong> <code>if/elif/else</code>, Logical operators (<code>and</code>, <code>or</code>)</p>
        `,
        initialCode: '# Ask for weather and temperature\n\n# Provide advice using multi-stage selection\n',
        solutionCode: 'weather = input("What is the weather (sunny/cloudy/rainy)? ").lower()\ntemp = int(input("What is the temperature in degrees? "))\n\nif weather == "rainy":\n    print("Bring an umbrella!")\nelif weather == "sunny" and temp > 20:\n    print("Wear a t-shirt and sunglasses.")\nelif weather == "cloudy" or temp <= 20:\n    print("A light jacket should be fine.")\nelse:\n    print("Dress for the conditions!")'
      },
      {
        id: 'py_5',
        title: 'Introduction to Iteration',
        language: Language.PYTHON,
        content: `
          <h3>Activity: 3-Day Step Counter</h3>
          <p><strong>Concepts:</strong> <code>for</code> loop, Running total</p>
          <p>Initialize a variable at 0 before the loop to accumulate values.</p>
        `,
        initialCode: 'total_steps = 0\n\n# Create a loop that runs 3 times\n\n# Calculate average after the loop\n',
        solutionCode: 'total_steps = 0\n\nfor day in range(1, 4):\n    steps = int(input(f"How many steps for day {day}? "))\n    total_steps += steps  # Running total\n\naverage = total_steps / 3\nprint(f"Total steps: {total_steps}")\nprint(f"Average steps per day: {average}")'
      },
      {
        id: 'py_6',
        title: 'Iteration With Selection',
        language: Language.PYTHON,
        content: `
          <h3>Activity: Mini Quiz (5 Questions)</h3>
          <p><strong>Concepts:</strong> Loops, Selection, Counters</p>
        `,
        initialCode: 'score = 0\n\n# Use a for loop to ask 5 questions\n\n# Print final score\n',
        solutionCode: 'score = 0\n\nfor i in range(5):\n    # Example question: what is 2 + 2?\n    answer = input("What is 2 + 2? ")\n    if answer == "4":\n        print("Correct!")\n        score += 1\n    else:\n        print("Incorrect.")\n\nprint(f"Your final score is {score} out of 5.")'
      },
      {
        id: 'py_7',
        title: 'Using Iteration To Validate Input',
        language: Language.PYTHON,
        content: `
          <h3>Activity: Password Retry System</h3>
          <p><strong>Concepts:</strong> <code>while</code> loop, Break/Control flow</p>
        `,
        initialCode: 'secret_password = "python123"\nattempts = 3\n\n# Use a while loop to check attempts\n',
        solutionCode: 'secret_password = "python123"\nattempts = 3\n\nwhile attempts > 0:\n    guess = input(f"Enter password ({attempts} attempts left): ")\n    if guess == secret_password:\n        print("Access granted")\n        break # Stops the loop immediately\n    else:\n        attempts -= 1\n        print("Wrong password.")\n\nif attempts == 0:\n    print("Access denied")'
      },
      {
        id: 'py_8',
        title: 'Combining Selection + Iteration + Calculations',
        language: Language.PYTHON,
        content: `
          <h3>Activity: Bus Fare Calculator</h3>
          <p><strong>Concepts:</strong> Accumulating totals, Range-based selection</p>
        `,
        initialCode: 'total_fare = 0\n\n# For 5 passengers, check age and calculate fare\n',
        solutionCode: 'total_fare = 0\n\nfor i in range(5):\n    age = int(input(f"Enter age for passenger {i+1}: "))\n    \n    if age < 5:\n        fare = 0\n    elif 5 <= age <= 17:\n        fare = 1.50\n    else:\n        fare = 2.50\n    \n    total_fare += fare\n\nprint(f"Total fare: £{total_fare:.2f}")\nprint(f"Average fare: £{total_fare / 5:.2f}")'
      },
      {
        id: 'py_9',
        title: 'Nested Selection Inside a Loop',
        language: Language.PYTHON,
        content: `
          <h3>Activity: Weekly Weather Report</h3>
          <p><strong>Concepts:</strong> Classification, Conditionals in loops</p>
        `,
        initialCode: 'warm_days = 0\n\n# Loop 7 times, classifying temp as Cold, Mild, or Warm\n',
        solutionCode: 'warm_days = 0\n\nfor day in range(1, 8):\n    temp = int(input(f"Enter temperature for day {day}: "))\n    \n    if temp < 10:\n        print("Cold")\n    elif 10 <= temp <= 20:\n        print("Mild")\n    else:\n        print("Warm")\n        warm_days += 1\n\nprint(f"There were {warm_days} warm days this week.")'
      },
      {
        id: 'py_10',
        title: 'Full Mini-System',
        language: Language.PYTHON,
        content: `
          <h3>Activity: Mini Shopping Checkout System</h3>
          <p><strong>Concepts:</strong> Loops, Percentage discounts, Multi-stage logic</p>
        `,
        initialCode: '# Items >= 20 get 10% off\n# Bulk total >= 100 gets flat 10 discount\n',
        solutionCode: 'num_items = int(input("How many items are you buying? "))\nrunning_total = 0\ndiscount_count = 0\n\nfor i in range(num_items):\n    price = float(input(f"Enter price for item {i+1}: "))\n    \n    if price >= 20:\n        # Apply 10% discount: price * 0.9\n        price = price * 0.9\n        discount_count += 1\n        print("Item discount applied!")\n        \n    running_total += price\n\n# Final check for bulk discount\nif running_total >= 100:\n    running_total -= 10\n    print("Bulk discount of £10 applied!")\n\nprint(f"Final Total: £{running_total:.2f}")\nprint(f"Items receiving individual discounts: {discount_count}")'
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