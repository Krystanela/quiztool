        document.addEventListener('DOMContentLoaded', function() {
            // Quiz questions with shuffled options
            const questions = [
                {
                    question: "Which planet is known as the Red Planet?",
                    options: ["Venus", "Mars", "Jupiter", "Mercury"],
                    correctAnswer: "Mars"
                },
                {
                    question: "What is the largest mammal in the world?",
                    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
                    correctAnswer: "Blue Whale"
                },
                {
                    question: "Which element has the chemical symbol 'O'?",
                    options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
                    correctAnswer: "Oxygen"
                },
                {
                    question: "Who painted the Mona Lisa?",
                    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                    correctAnswer: "Leonardo da Vinci"
                },
                {
                    question: "What is the capital of Japan?",
                    options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
                    correctAnswer: "Tokyo"
                }
            ];

            // DOM elements
            const questionCountElement = document.getElementById('question-count');
            const questionTextElement = document.getElementById('question-text');
            const optionsContainer = document.getElementById('options-container');
            const feedbackElement = document.getElementById('feedback');
            const nextButton = document.getElementById('next-btn');
            const scoreContainer = document.getElementById('score-container');
            const restartButton = document.getElementById('restart-btn');
            const progressBar = document.getElementById('progress-bar');

            // Quiz state variables
            let currentQuestionIndex = 0;
            let score = 0;
            let optionsShuffled = false;

            // Initialize the quiz
            function initQuiz() {
                currentQuestionIndex = 0;
                score = 0;
                optionsShuffled = false;
                scoreContainer.textContent = '';
                nextButton.style.display = 'block';
                restartButton.style.display = 'none';
                loadQuestion();
            }

            // Load the current question
            function loadQuestion() {
                const currentQuestion = questions[currentQuestionIndex];
                
                // Update progress bar
                progressBar.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;
                
                // Update question count
                questionCountElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
                
                // Set question text
                questionTextElement.textContent = currentQuestion.question;
                
                // Clear previous options and feedback
                optionsContainer.innerHTML = '';
                feedbackElement.textContent = '';
                feedbackElement.className = 'feedback';
                
                // Shuffle options if not already shuffled for this question
                if (!optionsShuffled) {
                    shuffleArray(currentQuestion.options);
                    optionsShuffled = true;
                }
                
                // Create option buttons
                currentQuestion.options.forEach(option => {
                    const button = document.createElement('button');
                    button.textContent = option;
                    button.className = 'option';
                    button.addEventListener('click', () => checkAnswer(option, currentQuestion.correctAnswer));
                    optionsContainer.appendChild(button);
                });
                
                // Hide next button until an answer is selected
                nextButton.style.display = 'none';
            }

            // Check if the selected answer is correct
            function checkAnswer(selectedOption, correctAnswer) {
                const options = document.querySelectorAll('.option');
                let isCorrect = false;
                
                // Disable all options after selection
                options.forEach(option => {
                    option.disabled = true;
                    
                    // Highlight correct answer
                    if (option.textContent === correctAnswer) {
                        option.classList.add('correct');
                    }
                    
                    // Highlight incorrect selected answer
                    if (option.textContent === selectedOption && option.textContent !== correctAnswer) {
                        option.classList.add('incorrect');
                    }
                });
                
                // Check if selected answer is correct
                if (selectedOption === correctAnswer) {
                    feedbackElement.textContent = "Correct! Well done!";
                    feedbackElement.classList.add('correct-feedback');
                    score++;
                    isCorrect = true;
                } else {
                    feedbackElement.textContent = "Try again.";
                    feedbackElement.classList.add('incorrect-feedback');
                }
                
                // Show next button
                nextButton.style.display = 'block';
                
                return isCorrect;
            }

            // Fisher-Yates shuffle algorithm for shuffling options
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            // Move to the next question or end the quiz
            nextButton.addEventListener('click', function() {
                currentQuestionIndex++;
                optionsShuffled = false;
                
                if (currentQuestionIndex < questions.length) {
                    loadQuestion();
                } else {
                    endQuiz();
                }
            });

            // End the quiz and show the score
            function endQuiz() {
                questionCountElement.textContent = "Quiz Completed!";
                questionTextElement.textContent = "";
                optionsContainer.innerHTML = '';
                feedbackElement.textContent = '';
                nextButton.style.display = 'none';
                
                // Update progress bar to full
                progressBar.style.width = '100%';
                
                // Display score
                scoreContainer.textContent = `Your Score: ${score} out of ${questions.length}`;
                
                // Show restart button
                restartButton.style.display = 'block';
            }

            // Restart the quiz
            restartButton.addEventListener('click', initQuiz);

            // Initialize the quiz when the page loads
            initQuiz();
        });