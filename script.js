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
    const prevButton = document.getElementById('prev-btn');
    const scoreContainer = document.getElementById('score-container');
    const restartButton = document.getElementById('restart-btn');
    const progressBar = document.getElementById('progress-bar');
    const timerElement = document.getElementById('timer');
    const timerProgress = document.querySelector('.timer-progress');

    // Quiz state variables
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let timer;
    let timeRemaining = 10;
    let quizStartTime;
    let quizEndTime;

    // Labels A, B, C, D
    const LABELS = ["A", "B", "C", "D"];

    // Initialize the quiz
    function initQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        scoreContainer.textContent = '';
        nextButton.style.display = 'block';
        prevButton.style.display = 'block';
        restartButton.style.display = 'none';
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
        quizStartTime = new Date();
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
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
        
        // Check if user has already answered this question
        const userAnswer = userAnswers[currentQuestionIndex];
        
        // Create option buttons
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.innerHTML = `<span>${LABELS[index]}</span> ${option}`;
            button.className = 'option';
            
            // If user has already answered this question
            if (userAnswer !== undefined) {
                if (option === currentQuestion.correctAnswer) {
                    button.classList.add('correct');
                } else if (userAnswer === index && option !== currentQuestion.correctAnswer) {
                    button.classList.add('incorrect');
                }
                button.disabled = true;
            }
            
            button.addEventListener('click', () => selectAnswer(option, currentQuestion.correctAnswer, index));
            optionsContainer.appendChild(button);
        });
        
        // Update navigation buttons
        prevButton.disabled = currentQuestionIndex === 0;
        nextButton.disabled = userAnswers[currentQuestionIndex] === undefined;
        nextButton.textContent = currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question';
        
        // Start timer if not answered yet
        if (userAnswers[currentQuestionIndex] === undefined) {
            startTimer();
        }
    }

    // Start timer function (10 seconds)
    function startTimer() {
        timeRemaining = 10;
        timerElement.textContent = timeRemaining;
        timerElement.classList.remove('timer-warning');
        timerProgress.style.strokeDashoffset = 0;
        
        clearInterval(timer);
        timer = setInterval(() => {
            timeRemaining--;
            timerElement.textContent = timeRemaining;
            
            // Update circular progress
            const offset = 283 - (timeRemaining / 10 * 283);
            timerProgress.style.strokeDashoffset = offset;
            
            if (timeRemaining <= 5) {
                timerElement.classList.add('timer-warning');
            }
            
            if (timeRemaining <= 0) {
                clearInterval(timer);
                // Auto-select no answer and move to next question
                userAnswers[currentQuestionIndex] = -1; // -1 indicates no answer
                if (currentQuestionIndex < questions.length - 1) {
                    goToNextQuestion();
                } else {
                    endQuiz();
                }
            }
        }, 1000);
    }

    // Select answer function
    function selectAnswer(selectedOption, correctAnswer, index) {
        // If already answered, do nothing
        if (userAnswers[currentQuestionIndex] !== undefined) return;

        // Mark this question as answered
        userAnswers[currentQuestionIndex] = index;
        
        // Highlight correct/incorrect answers
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.disabled = true;
            const optionText = option.textContent.replace(/^[A-D] /, '');
            
            if (optionText === correctAnswer) {
                option.classList.add('correct');
            } else if (optionText === selectedOption && optionText !== correctAnswer) {
                option.classList.add('incorrect');
            }
        });
        
        // Check if selected answer is correct
        if (selectedOption === correctAnswer) {
            feedbackElement.textContent = "Correct!";
            feedbackElement.classList.add('correct-feedback');
            score++;
        } else {
            feedbackElement.textContent = "Incorrect!";
            feedbackElement.classList.add('incorrect-feedback');
        }
        
        // Enable next button
        nextButton.disabled = false;
        
        // Stop timer
        clearInterval(timer);
    }

    // Go to next question
    function goToNextQuestion() {
        // Stop current timer
        clearInterval(timer);
        
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            endQuiz();
        }
    }

    // Go to previous question
    function goToPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            // Stop current timer
            clearInterval(timer);
            
            currentQuestionIndex--;
            loadQuestion();
            
            // Don't restart timer for previous questions
        }
    }

    // End the quiz and show the score
    function endQuiz() {
        quizEndTime = new Date();
        const timeSpent = Math.round((quizEndTime - quizStartTime) / 1000);
        
        questionCountElement.textContent = "Quiz Completed!";
        questionTextElement.textContent = "";
        optionsContainer.innerHTML = '';
        feedbackElement.textContent = '';
        nextButton.style.display = 'none';
        prevButton.style.display = 'none';
        
        // Update progress bar to full
        progressBar.style.width = '100%';
        
        // Display score and details
        scoreContainer.innerHTML = `
            <div class="score">Your Score: ${score} out of ${questions.length}</div>
            <div class="result-details">
                <h3>Performance Summary</h3>
                <div class="result-item">
                    <span>Total Questions:</span>
                    <span>${questions.length}</span>
                </div>
                <div class="result-item">
                    <span>Correct Answers:</span>
                    <span>${score}</span>
                </div>
                <div class="result-item">
                    <span>Incorrect Answers:</span>
                    <span>${questions.length - score}</span>
                </div>
                <div class="result-item">
                    <span>Time Taken:</span>
                    <span>${timeSpent}s</span>
                </div>
                <div class="result-item">
                    <span>Accuracy:</span>
                    <span>${Math.round((score / questions.length) * 100)}%</span>
                </div>
            </div>
        `;
        
        // Show restart button
        restartButton.style.display = 'block';
    }

    // Event listeners
    nextButton.addEventListener('click', goToNextQuestion);
    prevButton.addEventListener('click', goToPreviousQuestion);
    restartButton.addEventListener('click', initQuiz);

    // Initialize the quiz when the page loads
    initQuiz();
});