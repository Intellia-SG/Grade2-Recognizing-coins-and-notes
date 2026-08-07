// ──────────────────────────────────────────────────
// Question Bank — Recognizing Coins and Notes
// Aligned with Grade 2 Math Standards (Singapore Math, CCSS 2.MD.C.8)
// ──────────────────────────────────────────────────

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── WORLD 0: COIN FOREST (Coin Recognition) ───
function generateWorld0Questions() {
  return [
    {
      id: 'w0_q1',
      type: 'multiple_choice',
      questionText: "**Wei Ming** finds a copper-colored coin with Abraham Lincoln on it. What is its name?",
      visual: 'coinShow',
      coinType: 'penny',
      hint1: "It is the only **copper-colored** coin.",
      hint2: "It is worth exactly **1 cent**.",
      explanation: "A **Penny** is copper-colored and features Abraham Lincoln. It is worth **1 cent**.",
      options: ["Penny", "Nickel", "Dime", "Quarter"],
      correctAnswer: "Penny"
    },
    {
      id: 'w0_q2',
      type: 'multiple_choice',
      questionText: "Which coin is the **smallest in size** but is worth **10 cents**?",
      visual: 'coinShow',
      coinType: 'dime',
      hint1: "It is small, thin, and **silver-colored**.",
      hint2: "It is worth **ten cents**.",
      explanation: "A **Dime** is the smallest coin in physical size, but it is worth **10 cents**.",
      options: ["Penny", "Nickel", "Dime", "Quarter"],
      correctAnswer: "Dime"
    },
    {
      id: 'w0_q3',
      type: 'multiple_choice',
      questionText: "What is the value of a **Quarter**?",
      visual: 'coinShow',
      coinType: 'quarter',
      hint1: "It is the largest of the common silver coins.",
      hint2: "Four of them make a whole **1 dollar**.",
      explanation: "A **Quarter** is worth **25 cents**.",
      options: ["5 cents", "10 cents", "25 cents", "50 cents"],
      correctAnswer: "25 cents"
    },
    {
      id: 'w0_q4',
      type: 'multiple_choice',
      questionText: "What is the name of the silver-colored coin worth **5 cents**?",
      visual: 'coinShow',
      coinType: 'nickel',
      hint1: "It is thicker than a dime and worth more than a penny.",
      hint2: "Its name sounds like a metal.",
      explanation: "A **Nickel** is worth **5 cents**.",
      options: ["Penny", "Nickel", "Dime", "Quarter"],
      correctAnswer: "Nickel"
    },
    {
      id: 'w0_q5',
      type: 'true_false',
      questionText: "**True or False**: A **Quarter** is worth **25 cents**.",
      visual: 'coinShow',
      coinType: 'quarter',
      hint1: "Think about the value of a quarter.",
      hint2: "It takes 4 quarters to make 100 cents (**1 dollar**).",
      explanation: "**True**! A Quarter is worth exactly **25 cents**.",
      options: ["True", "False"],
      correctAnswer: "True"
    },
    {
      id: 'w0_q6',
      type: 'multiple_choice',
      questionText: "Which coin features **Thomas Jefferson** on the front and Monticello on the back?",
      visual: 'coinShow',
      coinType: 'nickel',
      hint1: "It is worth **5 cents**.",
      hint2: "It is silver-colored and thicker than a dime.",
      explanation: "The **Nickel** features Thomas Jefferson.",
      options: ["Penny", "Nickel", "Dime", "Quarter"],
      correctAnswer: "Nickel"
    },
    {
      id: 'w0_q7',
      type: 'multiple_choice',
      questionText: "**Wei Ming** spots a **Penny** in the stream. What is its value?",
      visual: 'coinShow',
      coinType: 'penny',
      hint1: "A penny has the smallest value of all coins.",
      hint2: "It is copper-colored.",
      explanation: "A **Penny** is worth **1 cent**.",
      options: ["1 cent", "5 cents", "10 cents", "25 cents"],
      correctAnswer: "1 cent"
    },
    {
      id: 'w0_q8',
      type: 'multiple_choice',
      questionText: "Which coin is worth more: a **Nickel** or a **Dime**?",
      hint1: "A nickel is worth **5 cents** and a dime is worth **10 cents**.",
      hint2: "**10 cents** is more than 5 cents.",
      explanation: "A **Dime** is worth **10 cents**, which is more than a **Nickel** (5 cents).",
      options: ["Nickel", "Dime"],
      correctAnswer: "Dime"
    },
    {
      id: 'w0_q9',
      type: 'true_false',
      questionText: "**True or False**: A **Dime** is worth 5 cents.",
      visual: 'coinShow',
      coinType: 'dime',
      hint1: "A nickel is worth 5 cents.",
      hint2: "A dime is worth **10 cents**.",
      explanation: "**False**. A **Dime** is worth **10 cents**. A Nickel is worth 5 cents.",
      options: ["True", "False"],
      correctAnswer: "False"
    },
    {
      id: 'w0_q10',
      type: 'multiple_choice',
      questionText: "Identify the large silver-colored coin worth **25 cents**.",
      visual: 'coinShow',
      coinType: 'quarter',
      hint1: "It is larger than a penny, nickel, and dime.",
      hint2: "It features George Washington on the front.",
      explanation: "A **Quarter** is the largest common coin, worth **25 cents**.",
      options: ["Penny", "Nickel", "Dime", "Quarter"],
      correctAnswer: "Quarter"
    }
  ];
}

// ─── WORLD 1: SILVER RIVER (Values and Comparison) ───
function generateWorld1Questions() {
  return [
    {
      id: 'w1_q1',
      type: 'multiple_choice',
      questionText: "Which of these coins has the **greatest (highest) value**?",
      hint1: "Compare values: Penny (**1¢**), Nickel (**5¢**), Dime (**10¢**), Quarter (**25¢**).",
      hint2: "**25 cents** is the largest amount.",
      explanation: "A **Quarter** has the greatest value (**25 cents**) among the common coins.",
      options: ["Penny", "Nickel", "Dime", "Quarter"],
      correctAnswer: "Quarter"
    },
    {
      id: 'w1_q2',
      type: 'multiple_choice',
      questionText: "Order these coins from **LEAST to GREATEST** value.",
      hint1: "Start with **1¢**, then **5¢**, **10¢**, and **25¢**.",
      hint2: "Penny, Nickel, Dime, Quarter.",
      explanation: "The correct order is **Penny (1¢)**, **Nickel (5¢)**, **Dime (10¢)**, then **Quarter (25¢)**.",
      options: [
        "Penny, Nickel, Dime, Quarter",
        "Quarter, Dime, Nickel, Penny",
        "Penny, Dime, Nickel, Quarter",
        "Nickel, Penny, Dime, Quarter"
      ],
      correctAnswer: "Penny, Nickel, Dime, Quarter"
    },
    {
      id: 'w1_q3',
      type: 'true_false',
      questionText: "**True or False**: A **Nickel** is worth more than a **Dime**.",
      hint1: "A nickel is worth 5¢. A dime is worth 10¢.",
      hint2: "5 is less than 10.",
      explanation: "**False**! A Nickel is worth 5 cents, which is **less than** a Dime (10 cents).",
      options: ["True", "False"],
      correctAnswer: "False"
    },
    {
      id: 'w1_q4',
      type: 'multiple_choice',
      questionText: "Which is worth more: **5 Pennies** or **1 Nickel**?",
      hint1: "5 pennies = **5 cents**. 1 nickel = **5 cents**.",
      hint2: "5 cents and 5 cents are equal.",
      explanation: "They are worth the **exact same**! Both equal **5 cents**.",
      options: ["5 Pennies", "1 Nickel", "They are equal!"],
      correctAnswer: "They are equal!"
    },
    {
      id: 'w1_q5',
      type: 'multiple_choice',
      questionText: "Compare: **1 Dime** is __________ than **1 Quarter**.",
      hint1: "1 Dime = 10¢. 1 Quarter = 25¢.",
      hint2: "10 cents is less than 25 cents.",
      explanation: "A **Dime (10¢)** is **less than** a **Quarter (25¢)**.",
      options: ["greater than", "less than", "equal to"],
      correctAnswer: "less than"
    },
    {
      id: 'w1_q6',
      type: 'true_false',
      questionText: "**True or False**: A **Dime** is smaller in physical size than a Nickel, but is worth more.",
      hint1: "Look at the sizes. The dime is indeed smaller.",
      hint2: "A dime is worth 10¢ and a nickel is worth 5¢.",
      explanation: "**True**! Physical size does not determine value in coins. A dime is smaller but worth more than a nickel.",
      options: ["True", "False"],
      correctAnswer: "True"
    },
    {
      id: 'w1_q7',
      type: 'multiple_choice',
      questionText: "If **Wei Ming** has **3 Dimes** and **1 Quarter**, which is worth more?",
      hint1: "3 Dimes = 30 cents. 1 Quarter = 25 cents.",
      hint2: "30 cents is more than 25 cents.",
      explanation: "**3 Dimes** are worth **30 cents**, which is more than **1 Quarter** (25 cents).",
      options: ["3 Dimes", "1 Quarter", "They are equal!"],
      correctAnswer: "3 Dimes"
    },
    {
      id: 'w1_q8',
      type: 'multiple_choice',
      questionText: "What is the total value of **2 Dimes** and **1 Nickel**?",
      hint1: "Dimes are 10¢ each, Nickels are 5¢.",
      hint2: "10 + 10 + 5 = 25 cents.",
      explanation: "2 Dimes (20¢) and 1 Nickel (5¢) equal **25 cents**.",
      options: ["15 cents", "20 cents", "25 cents", "30 cents"],
      correctAnswer: "25 cents"
    },
    {
      id: 'w1_q9',
      type: 'multiple_choice',
      questionText: "Compare: **1 Quarter** is __________ than **2 Dimes**.",
      hint1: "1 Quarter = 25¢. 2 Dimes = 20¢.",
      hint2: "25 cents is more than 20 cents.",
      explanation: "A **Quarter (25¢)** is **greater than** 2 Dimes (20¢).",
      options: ["greater than", "less than", "equal to"],
      correctAnswer: "greater than"
    },
    {
      id: 'w1_q10',
      type: 'multiple_choice',
      questionText: "Order these coin values from **SMALLEST to LARGEST**.",
      hint1: "1¢ is smallest, then 5¢, 10¢, and 25¢ is largest.",
      hint2: "Look at the numbers carefully.",
      explanation: "The correct order is **1¢, 5¢, 10¢, 25¢**.",
      options: [
        "1¢, 5¢, 10¢, 25¢",
        "25¢, 10¢, 5¢, 1¢",
        "1¢, 10¢, 5¢, 25¢",
        "5¢, 1¢, 10¢, 25¢"
      ],
      correctAnswer: "1¢, 5¢, 10¢, 25¢"
    }
  ];
}

// ─── WORLD 2: NOTE CASTLE (Note/Bill Recognition) ───
function generateWorld2Questions() {
  return [
    {
      id: 'w2_q1',
      type: 'multiple_choice',
      questionText: "Whose portrait is on the front of the green **$1 bill**?",
      visual: 'noteShow',
      noteType: '1dollar',
      hint1: "He was the first President of the United States.",
      hint2: "His last name starts with W.",
      explanation: "**George Washington** is featured on the $1 bill.",
      options: ["George Washington", "Abraham Lincoln", "Alexander Hamilton", "Andrew Jackson"],
      correctAnswer: "George Washington"
    },
    {
      id: 'w2_q2',
      type: 'multiple_choice',
      questionText: "Which paper bill has a giant **5** in the corners and features **Abraham Lincoln**?",
      visual: 'noteShow',
      noteType: '5dollar',
      hint1: "It is worth exactly five dollars.",
      hint2: "Look at the options.",
      explanation: "The **$5 bill** features Abraham Lincoln and is worth five dollars.",
      options: ["$1 bill", "$5 bill", "$10 bill", "$20 bill"],
      correctAnswer: "$5 bill"
    },
    {
      id: 'w2_q3',
      type: 'true_false',
      questionText: "**True or False**: A **$10 bill** is worth more than a **$5 bill**.",
      hint1: "Compare 10 dollars to 5 dollars.",
      hint2: "10 is greater than 5.",
      explanation: "**True**! A $10 bill has twice the value of a $5 bill.",
      options: ["True", "False"],
      correctAnswer: "True"
    },
    {
      id: 'w2_q4',
      type: 'multiple_choice',
      questionText: "What is the value of a **ten-dollar note**?",
      visual: 'noteShow',
      noteType: '10dollar',
      hint1: "It has a '10' printed on it.",
      hint2: "It is worth ten dollars.",
      explanation: "A **$10 note** is worth exactly **$10**.",
      options: ["$1", "$5", "$10", "$20"],
      correctAnswer: "$10"
    },
    {
      id: 'w2_q5',
      type: 'multiple_choice',
      questionText: "Which bill is worth the most among these notes?",
      hint1: "Compare $1, $5, $10, and $20.",
      hint2: "20 is the largest number here.",
      explanation: "The **$20 bill** is worth the most among these options.",
      options: ["$1 bill", "$5 bill", "$10 bill", "$20 bill"],
      correctAnswer: "$20 bill"
    },
    {
      id: 'w2_q6',
      type: 'multiple_choice',
      questionText: "Whose portrait is featured on the **$10 bill**?",
      visual: 'noteShow',
      noteType: '10dollar',
      hint1: "He was the first Secretary of the Treasury.",
      hint2: "His last name is Hamilton.",
      explanation: "**Alexander Hamilton** is featured on the $10 bill.",
      options: ["George Washington", "Abraham Lincoln", "Alexander Hamilton", "Andrew Jackson"],
      correctAnswer: "Alexander Hamilton"
    },
    {
      id: 'w2_q7',
      type: 'multiple_choice',
      questionText: "If **Wei Ming** has **one $5 bill** and **five $1 bills**, which has more value?",
      hint1: "One $5 bill = $5. Five $1 bills = $5.",
      hint2: "Compare $5 to $5.",
      explanation: "They are **equal**! Both collections equal exactly 5 dollars.",
      options: ["One $5 bill", "Five $1 bills", "They are equal!"],
      correctAnswer: "They are equal!"
    },
    {
      id: 'w2_q8',
      type: 'true_false',
      questionText: "**True or False**: A **$20 bill** features Andrew Jackson on the front.",
      visual: 'noteShow',
      noteType: '20dollar',
      hint1: "He is the portrait on the 20-dollar bill.",
      hint2: "It is the largest note in this adventure.",
      explanation: "**True**! Andrew Jackson is featured on the $20 bill.",
      options: ["True", "False"],
      correctAnswer: "True"
    },
    {
      id: 'w2_q9',
      type: 'multiple_choice',
      questionText: "Which paper note has the **smallest value**?",
      hint1: "Compare $1, $5, and $10.",
      hint2: "1 is the smallest number.",
      explanation: "The **$1 note** is the smallest denomination of paper money.",
      options: ["$1 note", "$5 note", "$10 note"],
      correctAnswer: "$1 note"
    },
    {
      id: 'w2_q10',
      type: 'true_false',
      questionText: "**True or False**: A **$10 bill** is worth exactly **1,000 pennies**.",
      hint1: "$1 is worth 100 pennies.",
      hint2: "10 times 100 is 1,000.",
      explanation: "**True**! Since $1 = 100 cents, a $10 bill is worth 10 × 100 = 1,000 pennies.",
      options: ["True", "False"],
      correctAnswer: "True"
    }
  ];
}

// ─── WORLD 3: TREASURE BANK (Counting Money) ───
function generateWorld3Questions() {
  return [
    {
      id: 'w3_q1',
      type: 'multiple_choice',
      questionText: "If we skip-count by **fives**, what is the total value of **5 Nickels**?",
      hint1: "Nickels are worth 5 cents each.",
      hint2: "Count: 5, 10, 15, 20, 25...",
      explanation: "5 Nickels = 5 × 5¢ = **25 cents**.",
      options: ["15 cents", "20 cents", "25 cents", "30 cents"],
      correctAnswer: "25 cents"
    },
    {
      id: 'w3_q2',
      type: 'multiple_choice',
      questionText: "If we skip-count by **tens**, what is the total value of **4 Dimes**?",
      hint1: "Dimes are worth 10 cents each.",
      hint2: "Count: 10, 20, 30, 40...",
      explanation: "4 Dimes = 4 × 10¢ = **40 cents**.",
      options: ["20 cents", "30 cents", "40 cents", "50 cents"],
      correctAnswer: "40 cents"
    },
    {
      id: 'w3_q3',
      type: 'multiple_choice',
      questionText: "What is the total value of **two $5 bills** and **three $1 bills**?",
      hint1: "Two $5 bills = $10. Three $1 bills = $3.",
      hint2: "$10 + $3 = ...",
      explanation: "Two $5 bills ($10) plus three $1 bills ($3) equals **$13**.",
      options: ["$8", "$10", "$13", "$15"],
      correctAnswer: "$13"
    },
    {
      id: 'w3_q4',
      type: 'multiple_choice',
      questionText: "What is the total value of **1 Quarter**, **2 Dimes**, and **3 Pennies**?",
      hint1: "1 Quarter = 25¢. 2 Dimes = 20¢. 3 Pennies = 3¢.",
      hint2: "25 + 20 + 3 = ...",
      explanation: "25¢ + 20¢ + 3¢ = **48 cents**.",
      options: ["38 cents", "43 cents", "48 cents", "53 cents"],
      correctAnswer: "48 cents"
    },
    {
      id: 'w3_q5',
      type: 'multiple_choice',
      questionText: "If **Wei Ming** opens a bank vault and finds **three $10 bills**, how much money does he have?",
      hint1: "Count by tens: $10, $20, $30.",
      hint2: "3 × 10 = ...",
      explanation: "Three $10 bills equal **$30**.",
      options: ["$20", "$30", "$40", "$50"],
      correctAnswer: "$30"
    },
    {
      id: 'w3_q6',
      type: 'multiple_choice',
      questionText: "Count this collection: **2 Quarters** and **1 Nickel**.",
      hint1: "2 Quarters = 50 cents. 1 Nickel = 5 cents.",
      hint2: "50 + 5 = ...",
      explanation: "2 Quarters (50¢) + 1 Nickel (5¢) = **55 cents**.",
      options: ["30 cents", "50 cents", "55 cents", "60 cents"],
      correctAnswer: "55 cents"
    },
    {
      id: 'w3_q7',
      type: 'multiple_choice',
      questionText: "Which of these collections equals exactly **50 cents**?",
      hint1: "1 Quarter = 25¢, 1 Dime = 10¢, 1 Nickel = 5¢.",
      hint2: "5 Dimes = 50¢.",
      explanation: "**5 Dimes (50¢)** or 2 Quarters (50¢) equal fifty cents.",
      options: ["5 Nickels", "5 Dimes", "3 Quarters", "4 Pennies"],
      correctAnswer: "5 Dimes"
    },
    {
      id: 'w3_q8',
      type: 'multiple_choice',
      questionText: "Count: **one $5 bill**, **2 Quarters**, and **1 Dime**.",
      hint1: "2 Quarters = 50¢, 1 Dime = 10¢. Total cents = 60¢.",
      hint2: "Combine: $5 + 60 cents.",
      explanation: "One $5 bill + 60 cents = **$5.60**.",
      options: ["$5.20", "$5.50", "$5.60", "$6.00"],
      correctAnswer: "$5.60"
    },
    {
      id: 'w3_q9',
      type: 'multiple_choice',
      questionText: "Count: **6 Nickels**. What is the total in cents?",
      hint1: "Count by fives 6 times.",
      hint2: "6 × 5 = ...",
      explanation: "6 Nickels equal **30 cents**.",
      options: ["20 cents", "25 cents", "30 cents", "35 cents"],
      correctAnswer: "30 cents"
    },
    {
      id: 'w3_q10',
      type: 'true_false',
      questionText: "**True or False**: Three Dimes and four Pennies equal **34 cents**.",
      hint1: "3 Dimes = 30¢. 4 Pennies = 4¢.",
      hint2: "30 + 4 = 34.",
      explanation: "**True**! 30¢ + 4¢ = **34 cents**.",
      options: ["True", "False"],
      correctAnswer: "True"
    }
  ];
}

// ─── WORLD 4: MARKET SQUARE (Using Money / Shopping) ───
function generateWorld4Questions() {
  return [
    {
      id: 'w4_q1',
      type: 'multiple_choice',
      questionText: "A muffin at Baker Bertie's costs **45¢**. Which coins pay the exact price?",
      hint1: "Look for combinations that add up to 45¢.",
      hint2: "1 Quarter (25¢) + 2 Dimes (20¢) = 45¢.",
      explanation: "**1 Quarter and 2 Dimes** make 25¢ + 20¢ = 45¢.",
      options: [
        "1 Quarter and 2 Dimes",
        "2 Quarters",
        "4 Nickels",
        "1 Dime and 3 Nickels"
      ],
      correctAnswer: "1 Quarter and 2 Dimes"
    },
    {
      id: 'w4_q2',
      type: 'true_false',
      questionText: "**Wei Ming** wants to buy a toy sword for **$4**. He has a **$5 bill**. Does he have enough money?",
      hint1: "Compare his $5 bill to the price of $4.",
      hint2: "$5 is more than $4.",
      explanation: "**True**! He has enough money because $5 is greater than $4.",
      options: ["True", "False"],
      correctAnswer: "True"
    },
    {
      id: 'w4_q3',
      type: 'multiple_choice',
      questionText: "An apple costs **30¢**. **Wei Ming** pays with **2 Dimes and 2 Nickels**. Did he pay the exact amount?",
      hint1: "2 Dimes (20¢) + 2 Nickels (10¢) = 30¢.",
      hint2: "Compare 30¢ to 30¢.",
      explanation: "He paid the **Exact amount** because 2 Dimes and 2 Nickels add up to exactly 30 cents.",
      options: ["Too much", "Too little", "Exact amount"],
      correctAnswer: "Exact amount"
    },
    {
      id: 'w4_q4',
      type: 'multiple_choice',
      questionText: "A flower costs **75¢**. If **Wei Ming** pays with a **$1 bill (100¢)**, how much change will he get back?",
      hint1: "Subtract the price from the money paid.",
      hint2: "100 - 75 = ...",
      explanation: "He paid 100 cents for a 75-cent flower, so his change is **25 cents**.",
      options: ["10 cents", "15 cents", "25 cents", "35 cents"],
      correctAnswer: "25 cents"
    },
    {
      id: 'w4_q5',
      type: 'multiple_choice',
      questionText: "A storybook costs **$7**. Which notes pay the exact price?",
      hint1: "Look for notes that add up to $7.",
      hint2: "One $5 note + two $1 notes = $7.",
      explanation: "**One $5 note and two $1 notes** equal exactly 7 dollars.",
      options: [
        "One $5 note and two $1 notes",
        "One $10 note",
        "Three $2 notes",
        "One $5 note and one $5 note"
      ],
      correctAnswer: "One $5 note and two $1 notes"
    },
    {
      id: 'w4_q6',
      type: 'true_false',
      questionText: "**Wei Ming** has **3 Quarters**. A box of candy costs **80¢**. Does he have enough to buy it?",
      hint1: "3 Quarters = 75 cents.",
      hint2: "Compare 75 cents to the price of 80 cents.",
      explanation: "**False**! 3 Quarters is 75¢, which is less than 80¢. He needs 5¢ more.",
      options: ["True", "False"],
      correctAnswer: "False"
    },
    {
      id: 'w4_q7',
      type: 'multiple_choice',
      questionText: "A cup of juice costs **60¢**. **Wei Ming** pays with **1 Quarter, 3 Dimes, and 1 Nickel**. Is that correct?",
      hint1: "1 Quarter (25¢) + 3 Dimes (30¢) + 1 Nickel (5¢).",
      hint2: "25 + 30 + 5 = 60 cents.",
      explanation: "Yes! 25¢ + 30¢ + 5¢ equals exactly **60 cents**.",
      options: ["Yes, exact amount", "No, too much", "No, too little"],
      correctAnswer: "Yes, exact amount"
    },
    {
      id: 'w4_q8',
      type: 'multiple_choice',
      questionText: "A pencil costs **15¢**. **Wei Ming** pays with a Quarter (**25¢**). How much change does he receive?",
      hint1: "Subtract the price from the coin value.",
      hint2: "25 - 15 = ...",
      explanation: "His change is **10 cents** (which is 1 dime).",
      options: ["5 cents", "10 cents", "15 cents", "20 cents"],
      correctAnswer: "10 cents"
    },
    {
      id: 'w4_q9',
      type: 'true_false',
      questionText: "**Wei Ming** has **4 Nickels and 2 Dimes**. Can he buy a toy balloon that costs **50¢**?",
      hint1: "4 Nickels = 20¢. 2 Dimes = 20¢. Total = 40¢.",
      hint2: "Compare 40¢ to the cost of 50¢.",
      explanation: "**False**! He only has 40 cents in total, so he cannot buy the 50-cent balloon.",
      options: ["True", "False"],
      correctAnswer: "False"
    },
    {
      id: 'w4_q10',
      type: 'multiple_choice',
      questionText: "A notebook costs **$2**. **Wei Ming** pays with a **$10 bill**. How much change does he get?",
      hint1: "$10 minus $2.",
      hint2: "10 - 2 = ...",
      explanation: "His change is **$8**.",
      options: ["$2", "$5", "$8", "$9"],
      correctAnswer: "$8"
    }
  ];
}

// ─── WORLD 5: ROYAL BAZAAR (Mastery / Word Problems) ───
function generateWorld5Questions() {
  return [
    {
      id: 'w5_q1',
      type: 'multiple_choice',
      questionText: "**Wei Ming** has two **$5 notes**. Banker Reginald has one **$10 note**. Who has more money?",
      hint1: "Two $5 notes = $10. Banker Reginald has $10.",
      hint2: "Compare $10 to $10.",
      explanation: "They have the **same amount**! Both have exactly 10 dollars.",
      options: ["Wei Ming", "Banker Reginald", "They have the same amount!"],
      correctAnswer: "They have the same amount!"
    },
    {
      id: 'w5_q2',
      type: 'multiple_choice',
      questionText: "**Wei Ming** wants to buy a toy shield for **$8** and a book for **$5**. How much money does he need in total?",
      hint1: "Add the two prices together.",
      hint2: "8 + 5 = ...",
      explanation: "Wei Ming needs $8 + $5 = **$13** in total.",
      options: ["$11", "$12", "$13", "$15"],
      correctAnswer: "$13"
    },
    {
      id: 'w5_q3',
      type: 'multiple_choice',
      questionText: "**Wei Ming** has **3 Quarters, 2 Dimes, and 4 Pennies**. How many more cents does he need to make **$1.00 (100¢)**?",
      hint1: "Count his money: 75¢ + 20¢ + 4¢ = 99¢.",
      hint2: "Subtract 99¢ from 100¢.",
      explanation: "Wei Ming has 99 cents. He needs exactly **1 cent** more to reach 100 cents (1 dollar).",
      options: ["1 cent", "5 cents", "10 cents", "25 cents"],
      correctAnswer: "1 cent"
    },
    {
      id: 'w5_q4',
      type: 'true_false',
      questionText: "**Wei Ming** buys markers for **$6**. He pays with a **$10 note** and gets two **$2 bills** back. Is his change correct?",
      hint1: "Calculate change: $10 - $6 = $4.",
      hint2: "Two $2 bills = $4.",
      explanation: "**True**! His change is 4 dollars, which can be given as two $2 bills.",
      options: ["True", "False"],
      correctAnswer: "True"
    },
    {
      id: 'w5_q5',
      type: 'multiple_choice',
      questionText: "**Wei Ming** saves **2 Dimes** every day. How much money will he save in **5 days**?",
      hint1: "2 Dimes = 20¢. Multiply 20¢ by 5 days.",
      hint2: "20 × 5 = 100 cents.",
      explanation: "Wei Ming saves 20¢ × 5 = 100 cents, which is exactly **$1.00**.",
      options: ["50 cents", "$1.00", "$2.00", "$5.00"],
      correctAnswer: "$1.00"
    },
    {
      id: 'w5_q6',
      type: 'multiple_choice',
      questionText: "A magic crystal costs **$15**. If **Wei Ming** pays with a **$20 bill**, what is his change?",
      hint1: "Subtract $15 from $20.",
      hint2: "20 - 15 = ...",
      explanation: "His change is **$5**.",
      options: ["$2", "$3", "$5", "$10"],
      correctAnswer: "$5"
    },
    {
      id: 'w5_q7',
      type: 'multiple_choice',
      questionText: "What is the **fewest number of coins** needed to make **35 cents**?",
      hint1: "Use the largest denomination possible first.",
      hint2: "1 Quarter (25¢) + 1 Dime (10¢) = 35¢.",
      explanation: "The fewest number of coins is **2 coins**: one quarter and one dime.",
      options: ["2 coins", "3 coins", "4 coins", "7 coins"],
      correctAnswer: "2 coins"
    },
    {
      id: 'w5_q8',
      type: 'true_false',
      questionText: "**True or False**: **Five Dimes** are worth the same as **two Quarters**.",
      hint1: "5 Dimes = 50 cents. 2 Quarters = 50 cents.",
      hint2: "Compare 50¢ to 50¢.",
      explanation: "**True**! Both equal exactly **50 cents**.",
      options: ["True", "False"],
      correctAnswer: "True"
    },
    {
      id: 'w5_q9',
      type: 'multiple_choice',
      questionText: "A toy dragon shield costs **$12**. **Wei Ming** pays with **three $5 bills**. How much change does he get?",
      hint1: "Three $5 bills = $15.",
      hint2: "$15 minus the price of $12.",
      explanation: "He pays $15 for a $12 shield, so his change is **$3**.",
      options: ["$2", "$3", "$5", "$8"],
      correctAnswer: "$3"
    },
    {
      id: 'w5_q10',
      type: 'multiple_choice',
      questionText: "**Wei Ming** has **four $5 bills**. Banker Reginald has **two $10 bills**. Who has more money?",
      hint1: "Four $5 bills = $20. Two $10 bills = $20.",
      hint2: "Compare $20 to $20.",
      explanation: "They have the **same amount**! Both have exactly 20 dollars.",
      options: ["Wei Ming", "Banker Reginald", "They have the same amount!"],
      correctAnswer: "They have the same amount!"
    }
  ];
}

export function generateSessionQuestions() {
  const world0 = shuffleArray(generateWorld0Questions()).slice(0, 10);
  const world1 = shuffleArray(generateWorld1Questions()).slice(0, 10);
  const world2 = shuffleArray(generateWorld2Questions()).slice(0, 10);
  const world3 = shuffleArray(generateWorld3Questions()).slice(0, 10);
  const world4 = shuffleArray(generateWorld4Questions()).slice(0, 10);
  const world5 = shuffleArray(generateWorld5Questions()).slice(0, 10);

  world0.forEach(q => q.world = 0);
  world1.forEach(q => q.world = 1);
  world2.forEach(q => q.world = 2);
  world3.forEach(q => q.world = 3);
  world4.forEach(q => q.world = 4);
  world5.forEach(q => q.world = 5);

  return [...world0, ...world1, ...world2, ...world3, ...world4, ...world5];
}
