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
          <h3>Input and Output</h3>
          <p>The <code>print()</code> function is used to output data to the standard output device (screen).</p>
          <p>The <code>input()</code> function allows user input. It always returns the data as a string.</p>
          <br/>
          <p><strong>Activity:</strong> Ask for a name and a favorite color, then display them in a sentence.</p>
        `,
        initialCode: '# Ask the user for their name\n\n# Ask the user for their favorite color\n\n# Print a message using both inputs\n',
        solutionCode: 'name = input("Enter your name: ")\ncolor = input("Enter your favorite color: ")\nprint(f"Hello {name}, your favorite color is {color}!")'
      },
      {
        id: 'py_2',
        title: 'Variable Declaration',
        language: Language.PYTHON,
        content: `
          <h3>Variables and Math</h3>
          <p>Variables are used to store data. You can perform calculations using operators like <code>+</code>, <code>-</code>, <code>*</code>, and <code>/</code>.</p>
          <p>Remember to use <code>int()</code> or <code>float()</code> if you need to convert string input into numbers for calculation.</p>
          <br/>
          <p><strong>Activity:</strong> Calculate the area of a rectangle based on user input for width and height.</p>
        `,
        initialCode: '# Get width and height from user (remember to convert to int)\n\n# Calculate area\n\n# Print the result\n',
        solutionCode: 'width = int(input("Enter width: "))\nheight = int(input("Enter height: "))\narea = width * height\nprint(f"The area of the rectangle is {area}")'
      },
      {
        id: 'py_3',
        title: 'Basic Selection',
        language: Language.PYTHON,
        content: `
          <h3>Selection with If/Else</h3>
          <p>The <code>if</code> statement allows you to execute code only if a condition is true. The <code>else</code> statement provides an alternative.</p>
          <p>The modulo operator <code>%</code> returns the remainder of a division. For example, <code>10 % 2</code> is 0.</p>
          <br/>
          <p><strong>Activity:</strong> Create an Even or Odd Checker.</p>
        `,
        initialCode: '# Ask for a number\n\n# Check if it is even or odd using %\n',
        solutionCode: 'number = int(input("Enter a number: "))\n\n# The modulo operator (%) finds the remainder of a division\nif number % 2 == 0:\n    print("This number is even")\nelse:\n    print("This number is odd")'
      },
      {
        id: 'py_4',
        title: 'Multi-Condition Selection',
        language: Language.PYTHON,
        content: `
          <h3>Complex Decisions</h3>
          <p>Use <code>elif</code> to check multiple conditions. Logical operators like <code>and</code> and <code>or</code> help combine checks.</p>
          <br/>
          <p><strong>Activity:</strong> Build a Weather Clothing Advisor.</p>
        `,
        initialCode: '# Ask for weather (sunny/cloudy/rainy)\n# Ask for temperature\n# Provide clothing advice\n',
        solutionCode: 'weather = input("What is the weather (sunny/cloudy/rainy)? ").lower()\ntemp = int(input("What is the temperature in degrees? "))\n\nif weather == "rainy":\n    print("Bring an umbrella!")\nelif weather == "sunny" and temp > 20:\n    print("Wear a t-shirt and sunglasses.")\nelif weather == "cloudy" or temp <= 20:\n    print("A light jacket should be fine.")\nelse:\n    print("Dress for the conditions!")'
      },
      {
        id: 'py_5',
        title: 'Introduction to Iteration',
        language: Language.PYTHON,
        content: `
          <h3>For Loops and Totals</h3>
          <p>A <code>for</code> loop repeats a block of code a specific number of times. <code>range(1, 4)</code> generates numbers 1, 2, and 3.</p>
          <br/>
          <p><strong>Activity:</strong> Build a 3-Day Step Counter that calculates a total and average.</p>
        `,
        initialCode: '# Initialize total_steps variable\n\n# Use a loop for 3 days\n\n# Calculate and print total and average\n',
        solutionCode: 'total_steps = 0\n\nfor day in range(1, 4):\n    steps = int(input(f"How many steps for day {day}? "))\n    total_steps += steps  # Running total\n\naverage = total_steps / 3\nprint(f"Total steps: {total_steps}")\nprint(f"Average steps per day: {average}")'
      },
      {
        id: 'py_6',
        title: 'Iteration With Selection',
        language: Language.PYTHON,
        content: `
          <h3>Mini Quiz System</h3>
          <p>Combining loops and selection allows you to build interactive systems. Keep track of a score by incrementing a variable.</p>
          <br/>
          <p><strong>Activity:</strong> Build a quiz with 5 identical questions.</p>
        `,
        initialCode: '# Start score at 0\n\n# Loop 5 times\n\n# Ask a question and check answer\n',
        solutionCode: 'score = 0\n\nfor i in range(5):\n    # Example question: what is 2 + 2?\n    answer = input("What is 2 + 2? ")\n    if answer == "4":\n        print("Correct!")\n        score += 1\n    else:\n        print("Incorrect.")\n\nprint(f"Your final score is {score} out of 5.")'
      },
      {
        id: 'py_7',
        title: 'Using Iteration To Validate Input',
        language: Language.PYTHON,
        content: `
          <h3>While Loops</h3>
          <p>A <code>while</code> loop continues as long as a condition is true. Use <code>break</code> to exit early.</p>
          <br/>
          <p><strong>Activity:</strong> Create a Password Retry System with 3 attempts.</p>
        `,
        initialCode: '# Set secret password\n# Set attempts to 3\n# Use while loop\n',
        solutionCode: 'secret_password = "python123"\nattempts = 3\n\nwhile attempts > 0:\n    guess = input(f"Enter password ({attempts} attempts left): ")\n    if guess == secret_password:\n        print("Access granted")\n        break # Stops the loop immediately\n    else:\n        attempts -= 1\n        print("Wrong password.")\n\nif attempts == 0:\n    print("Access denied")'
      },
      {
        id: 'py_8',
        title: 'Combining Selection + Iteration + Calculations',
        language: Language.PYTHON,
        content: `
          <h3>Bus Fare Calculator</h3>
          <p>This challenge requires using range-based selection logic inside an accumulating loop.</p>
          <br/>
          <p><strong>Activity:</strong> Calculate total fare for 5 passengers based on their ages.</p>
        `,
        initialCode: '# Ages: Under 5 (free), 5-17 (1.50), 18+ (2.50)\n# Calculate total for 5 passengers\n',
        solutionCode: 'total_fare = 0\n\nfor i in range(5):\n    age = int(input(f"Enter age for passenger {i+1}: "))\n    \n    if age < 5:\n        fare = 0\n    elif 5 <= age <= 17:\n        fare = 1.50\n    else:\n        fare = 2.50\n    \n    total_fare += fare\n\nprint(f"Total fare: £{total_fare:.2f}")\nprint(f"Average fare: £{total_fare / 5:.2f}")'
      },
      {
        id: 'py_9',
        title: 'Nested Selection Inside a Loop',
        language: Language.PYTHON,
        content: `
          <h3>Weekly Weather Report</h3>
          <p>Classifying data points as they are entered is a common programming task.</p>
          <br/>
          <p><strong>Activity:</strong> Categorize temperatures for 7 days and count "Warm" days.</p>
        `,
        initialCode: '# Loop for 7 days\n# <10 (Cold), 10-20 (Mild), >20 (Warm)\n',
        solutionCode: 'warm_days = 0\n\nfor day in range(1, 8):\n    temp = int(input(f"Enter temperature for day {day}: "))\n    \n    if temp < 10:\n        print("Cold")\n    elif 10 <= temp <= 20:\n        print("Mild")\n    else:\n        print("Warm")\n        warm_days += 1\n\nprint(f"There were {warm_days} warm days this week.")'
      },
      {
        id: 'py_10',
        title: 'Full Mini-System',
        language: Language.PYTHON,
        content: `
          <h3>Mini Shopping Checkout System</h3>
          <p>This final lesson combines everything: user input, arithmetic, percentages, and multi-stage logic.</p>
          <br/>
          <p><strong>Activity:</strong> Apply individual item discounts and a final bulk discount.</p>
        `,
        initialCode: '# Items over 20 get 10% off\n# Total over 100 gets flat 10 discount\n',
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