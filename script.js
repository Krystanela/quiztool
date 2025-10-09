// Google OAuth Configuration
const CLIENT_ID = '728223667745-pambvbg02dode4d5qefborq82lv9h8i7.apps.googleusercontent.com';

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

// Initialize Google Sign In
function initializeGoogleSignIn() {
    console.log('Initializing Google Sign-In with Client ID:', CLIENT_ID);
    
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleGoogleSignIn,
        auto_select: false,
        cancel_on_tap_outside: true
    });
    
    google.accounts.id.renderButton(
        document.getElementById("googleSignIn"),
        {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
            shape: "pill",
            logo_alignment: "center"
        }
    );
    
    // Also display the One Tap dialog
    google.accounts.id.prompt();
    
    console.log('Google Sign-In button rendered successfully!');
}

// Handle Google Sign In Response
function handleGoogleSignIn(response) {
    console.log("Google Sign-In response received!");
    
    if (response.credential) {
        // Decode the JWT token to get user info
        const userInfo = parseJwt(response.credential);
        console.log("User info:", userInfo);
        
        // Show success message
        const loginMessage = document.getElementById('loginMessage');
        loginMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Successfully signed in as <strong>${userInfo.name}</strong>!
            <br><small>Email: ${userInfo.email}</small>
        `;
        loginMessage.className = 'login-message success';
        loginMessage.style.display = 'block';
        
        // Update UI with user info
        document.getElementById('user-name').textContent = userInfo.name;
        document.getElementById('user-email').textContent = userInfo.email;
        document.getElementById('user-picture').src = userInfo.picture;
        document.getElementById('certificate-name').textContent = userInfo.name;
        
        // Hide message and redirect after delay
        setTimeout(() => {
            loginMessage.style.display = 'none';
            
            // Hide login and show quiz
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('header').style.display = 'flex';
            document.getElementById('quiz-container').style.display = 'block';
            
            // Initialize the quiz
            initQuiz();
        }, 2000);
    } else {
        console.error('No credential in response:', response);
        showLoginMessage('Google sign-in failed. Please try again.', 'error');
    }
}

// Helper function to parse JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error parsing JWT:', e);
        return { name: 'User', email: 'user@example.com', picture: '' };
    }
}

// Password toggle functionality
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Regular login form submission
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (email && password) {
        simulateLogin(email);
    } else {
        showLoginMessage('Please enter both email and password.', 'error');
    }
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', function() {
    // Sign out from Google
    if (typeof google !== 'undefined') {
        google.accounts.id.disableAutoSelect();
    }
    
    // Show login page and hide quiz
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('header').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    
    // Reset form
    document.getElementById('login-form').reset();
    
    showLoginMessage('You have been logged out successfully.', 'success');
    setTimeout(() => {
        document.getElementById('loginMessage').style.display = 'none';
    }, 3000);
});

// Certificate generation
document.getElementById('certificate-btn').addEventListener('click', function() {
    generateCertificate();
});

function simulateLogin(email) {
    const loginMessage = document.getElementById('loginMessage');
    
    // Show success message
    loginMessage.textContent = `Successfully logged in as ${email}!`;
    loginMessage.className = 'login-message success';
    loginMessage.style.display = 'block';
    
    // Update user name
    document.getElementById('user-name').textContent = email.split('@')[0];
    document.getElementById('user-email').textContent = email;
    document.getElementById('certificate-name').textContent = email.split('@')[0];
    
    // Set default profile picture
    document.getElementById('user-picture').src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjUwMDU3Ii8+CjxwYXRoIGQ9Ik0xMDAgMTEwQzExNC4zNjEgMTEwIDEyNiA5OC4zNjA1IDEyNiA4NEMxMjYgNjkuNjM5NSA4NC4zNjA1IDU4IDEwMCA1OEMxMTQuMzYxIDU4IDEyNiA2OS42Mzk1IDEyNiA4NEMxMjYgOTguMzYwNSAxMTQuMzYxIDExMCAxMDAgMTEwWk03NCAxMzJIMTI2QzE0Ni4zMzMgMTMyIDE2MiAxNDcuNjY3IDE2MiAxNjhWMTc0QzE2MiAxODAuNjI3IDE1Ni42MjcgMTg2IDE1MCAxODZINDBDMzMuMzcyNiAxODYgMjggMTgwLjYyNyAyOCAxNzRWMTY4QzI4IDE0Ny42NjcgNDMuNjY3MiAxMzIgNjQgMTMySDc0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
    
    // Hide message and redirect after delay
    setTimeout(() => {
        loginMessage.style.display = 'none';
        
        // Hide login and show quiz
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('header').style.display = 'flex';
        document.getElementById('quiz-container').style.display = 'block';
        
        // Initialize the quiz
        initQuiz();
    }, 2000);
}

function showLoginMessage(message, type) {
    const loginMessage = document.getElementById('loginMessage');
    loginMessage.textContent = message;
    loginMessage.className = `login-message ${type}`;
    loginMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        loginMessage.style.display = 'none';
    }, 5000);
}

function generateCertificate() {
    const certificateContainer = document.getElementById('certificateContainer');
    const certificateDate = document.getElementById('certificate-date');
    const certificateScore = document.getElementById('certificate-score');
    
    // Calculate score if quiz is completed
    const scoreText = document.querySelector('.score') ? 
        document.querySelector('.score').textContent : 'Not completed';
    
    // Set current date
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    certificateDate.textContent = now.toLocaleDateString('en-US', options);
    
    // Set score
    if (scoreText.includes('out of')) {
        const scoreMatch = scoreText.match(/(\d+) out of (\d+)/);
        if (scoreMatch) {
            const userScore = parseInt(scoreMatch[1]);
            const totalQuestions = parseInt(scoreMatch[2]);
            const percentage = Math.round((userScore / totalQuestions) * 100);
            certificateScore.textContent = `${percentage}% (${userScore}/${totalQuestions})`;
        }
    } else {
        certificateScore.textContent = 'Not completed';
    }
    
    // Show certificate with animation
    certificateContainer.style.display = 'block';
    certificateContainer.style.opacity = '0';
    certificateContainer.style.transform = 'translateY(20px)';
    
    let opacity = 0;
    const fadeIn = setInterval(() => {
        opacity += 0.05;
        certificateContainer.style.opacity = opacity;
        certificateContainer.style.transform = `translateY(${20 - opacity * 20}px)`;
        
        if (opacity >= 1) {
            clearInterval(fadeIn);
        }
    }, 30);
    
    // Scroll to certificate
    certificateContainer.scrollIntoView({ behavior: 'smooth' });
}

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
    document.getElementById('certificateContainer').style.display = 'none';
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
    
    // Auto-generate certificate if score is good
    if (score >= questions.length * 0.7) {
        setTimeout(() => {
            generateCertificate();
        }, 1000);
    }
}

// Event listeners
nextButton.addEventListener('click', goToNextQuestion);
prevButton.addEventListener('click', goToPreviousQuestion);
restartButton.addEventListener('click', initQuiz);

// Initialize Google Sign In when the page loads
window.onload = function() {
    console.log('Page loaded, initializing Google Sign-In...');
    
    // Wait for Google library to load
    if (typeof google !== 'undefined') {
        initializeGoogleSignIn();
    } else {
        console.log('Google library not loaded yet, retrying...');
        // Retry after a short delay if Google library isn't loaded yet
        setTimeout(initializeGoogleSignIn, 1000);
    }
};