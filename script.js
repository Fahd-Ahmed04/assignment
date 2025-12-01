const questions = [
    {
        question: "ما هو أطول نهر في العالم؟",
        answers: [
            { text: "نهر النيل", correct: true },
            { text: "نهر الأمازون", correct: false },
            { text: "نهر المسيسيبي", correct: false },
            { text: "نهر اليانغتسي", correct: false }
        ]
    },
    {
        question: "كم عدد القارات في العالم؟",
        answers: [
            { text: "5 قارات", correct: false },
            { text: "6 قارات", correct: false },
            { text: "7 قارات", correct: true },
            { text: "8 قارات", correct: false }
        ]
    },
    {
        question: "ما هو الغاز الأكثر انتشارًا في الغلاف الجوي للأرض؟",
        answers: [
            { text: "الأكسجين", correct: false },
            { text: "الهيدروجين", correct: false },
            { text: "ثاني أكسيد الكربون", correct: false },
            { text: "النيتروجين", correct: true }
        ]
    },
    {
        question: "من هو مخترع المصباح الكهربائي؟",
        answers: [
            { text: "نيكولا تسلا", correct: false },
            { text: "توماس إديسون", correct: true },
            { text: "ألبرت أينشتاين", correct: false },
            { text: "ألكسندر جراهام بيل", correct: false }
        ]
    },
    {
        question: "ما هي عاصمة اليابان؟",
        answers: [
            { text: "أوساكا", correct: false },
            { text: "كيوتو", correct: false },
            { text: "طوكيو", correct: true },
            { text: "هيروشيما", correct: false }
        ]
    },
    {
        question: "كم عدد أوتار آلة العود؟",
        answers: [
            { text: "5 أوتار", correct: false },
            { text: "6 أوتار", correct: false },
            { text: "11 وترًا", correct: false },
            { text: "12 وترًا", correct: true }
        ]
    },
    {
        question: "ما هو أسرع حيوان بري في العالم؟",
        answers: [
            { text: "الأسد", correct: false },
            { text: "الفهد الصياد", correct: true },
            { text: "النمر", correct: false },
            { text: "الحصان", correct: false }
        ]
    },
    {
        question: "من كتب رواية 'البؤساء'؟",
        answers: [
            { text: "فيكتور هوغو", correct: true },
            { text: "ليو تولستوي", correct: false },
            { text: "تشيخوف", correct: false },
            { text: "شارلز ديكنز", correct: false }
        ]
    },
    {
        question: "ما هو المعدن السائل في درجة حرارة الغرفة؟",
        answers: [
            { text: "الذهب", correct: false },
            { text: "الفضة", correct: false },
            { text: "الزئبق", correct: true },
            { text: "النحاس", correct: false }
        ]
    },
    {
        question: "كم عدد أحرف اللغة العربية؟",
        answers: [
            { text: "26 حرفًا", correct: false },
            { text: "28 حرفًا", correct: true },
            { text: "30 حرفًا", correct: false },
            { text: "32 حرفًا", correct: false }
        ]
    }
];

const USER_KEY = 'quiz_current_user';
const EMAIL_KEY = 'quiz_current_email';
const ANSWERS_KEY = 'quiz_saved_answers';
const QUIZ_STATE_KEY = 'quiz_current_state';

const loginContainer = document.getElementById("login-container");
const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");
const loginButton = document.getElementById("login-button");
const questionsContainer = document.getElementById("questions-container");
const submitButton = document.getElementById("submit-button");
const totalQuestionsElement = document.getElementById("total-questions");
const progressFill = document.getElementById("progress-fill");
const progressStatus = document.getElementById("progress-status");
const currentUserElement = document.getElementById("current-user");
const currentEmailElement = document.getElementById("current-email");
const submitText = document.getElementById("submit-text");

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkLoginState() {
    const username = sessionStorage.getItem(USER_KEY);
    const email = sessionStorage.getItem(EMAIL_KEY);
    
    loginContainer.style.display = 'none';
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'none';
    
    if (username && email) {
        currentUserElement.textContent = username;
        currentEmailElement.textContent = email;
        
        const savedState = sessionStorage.getItem(QUIZ_STATE_KEY);
        if (savedState === 'quiz') {
            quizContainer.style.display = 'block';
            loadQuizState();
        } else if (savedState === 'result') {
            showFinalResult();
        } else {
            quizContainer.style.display = 'block';
            startQuiz();
        }
    } else {
        loginContainer.style.display = 'block';
    }
}

function handleLogin() {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    
    if (username && email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("الرجاء إدخال بريد إلكتروني صحيح.");
            return;
        }
        
        sessionStorage.setItem(USER_KEY, username);
        sessionStorage.setItem(EMAIL_KEY, email);
        sessionStorage.setItem(QUIZ_STATE_KEY, 'quiz');
        
        currentUserElement.textContent = username;
        currentEmailElement.textContent = email;
        
        checkLoginState();
    } else {
        alert("الرجاء إدخال الاسم والبريد الإلكتروني.");
    }
}

function startQuiz() {
    shuffleArray(questions);
    
    questionsContainer.innerHTML = '';
    
    totalQuestionsElement.textContent = questions.length;
    
    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question-item';
        questionElement.innerHTML = `
            <div class="question-text">
                <span class="question-number">${index + 1}</span>
                ${question.question}
            </div>
            <div class="answers-container" id="answers-${index}">
                ${question.answers.map((answer, ansIndex) => `
                    <label class="answer-label">
                        <input type="radio" name="question-${index}" value="${ansIndex}" data-question="${index}">
                        <span>${answer.text}</span>
                    </label>
                `).join('')}
            </div>
        `;
        questionsContainer.appendChild(questionElement);
        
        const answersContainer = document.getElementById(`answers-${index}`);
        const answerLabels = Array.from(answersContainer.getElementsByClassName('answer-label'));
        shuffleArray(answerLabels);
        answersContainer.innerHTML = '';
        answerLabels.forEach(label => answersContainer.appendChild(label));
    });
    
    submitButton.disabled = true;
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';
    submitText.textContent = `أجب على جميع الأسئلة (0/${questions.length})`;
    
    loadSavedAnswers();
    
    setupAnswerListeners();
    
    updateProgressBar();
}

function loadQuizState() {
    const savedQuestions = sessionStorage.getItem('quiz_shuffled_questions');
    if (savedQuestions) {
        const parsedQuestions = JSON.parse(savedQuestions);
        questions.length = 0;
        questions.push(...parsedQuestions);
    }
    
    startQuiz();
}

function loadSavedAnswers() {
    const savedAnswers = sessionStorage.getItem(ANSWERS_KEY);
    if (savedAnswers) {
        const answers = JSON.parse(savedAnswers);
        
        questions.forEach((_, index) => {
            if (answers[index] !== undefined) {
                const radioInput = document.querySelector(`input[name="question-${index}"][value="${answers[index]}"]`);
                if (radioInput) {
                    radioInput.checked = true;
                }
            }
        });
        
        checkAllQuestionsAnswered();
    }
}

function setupAnswerListeners() {
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    
    radioInputs.forEach(input => {
        input.addEventListener('change', function() {
            const questionIndex = parseInt(this.dataset.question);
            const answerIndex = parseInt(this.value);
            
            saveAnswer(questionIndex, answerIndex);
            
            checkAllQuestionsAnswered();
            
            updateProgressBar();
        });
    });
}

function saveAnswer(questionIndex, answerIndex) {
    let savedAnswers = JSON.parse(sessionStorage.getItem(ANSWERS_KEY) || '{}');
    savedAnswers[questionIndex] = answerIndex;
    sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(savedAnswers));
}

function checkAllQuestionsAnswered() {
    const totalQuestions = questions.length;
    let answeredCount = 0;
    
    for (let i = 0; i < totalQuestions; i++) {
        const answered = document.querySelector(`input[name="question-${i}"]:checked`);
        if (answered) {
            answeredCount++;
        }
    }
    
    if (answeredCount === totalQuestions) {
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
        submitText.textContent = `إرسال الإجابات (${answeredCount}/${totalQuestions})`;
    } else {
        submitButton.disabled = true;
        submitButton.style.opacity = '0.6';
        submitButton.style.cursor = 'not-allowed';
        submitText.textContent = `أجب على جميع الأسئلة (${answeredCount}/${totalQuestions})`;
    }
    
    return answeredCount;
}

function updateProgressBar() {
    const answeredCount = checkAllQuestionsAnswered();
    const totalQuestions = questions.length;
    const percentage = (answeredCount / totalQuestions) * 100;
    
    progressFill.style.width = `${percentage}%`;
    progressStatus.textContent = `${answeredCount}/${totalQuestions}`;
}

function calculateScore() {
    let score = 0;
    const savedAnswers = JSON.parse(sessionStorage.getItem(ANSWERS_KEY) || '{}');
    
    questions.forEach((question, index) => {
        if (savedAnswers[index] !== undefined) {
            const answerIndex = savedAnswers[index];
            if (question.answers[answerIndex].correct) {
                score++;
            }
        }
    });
    
    return score;
}

function showFinalResult() {
    const score = calculateScore();
    const username = sessionStorage.getItem(USER_KEY);
    const email = sessionStorage.getItem(EMAIL_KEY);
    const percentage = Math.round((score / questions.length) * 100);
    
    sessionStorage.setItem(QUIZ_STATE_KEY, 'result');
    
    let performanceLevel = "";
    let performanceColor = "";
    let performanceIcon = "";
    
    if (percentage >= 90) {
        performanceLevel = "ممتاز! 🎉";
        performanceColor = "#10b981";
        performanceIcon = "fas fa-trophy";
    } else if (percentage >= 80) {
        performanceLevel = "جيد جداً! 👍";
        performanceColor = "#8b5cf6";
        performanceIcon = "fas fa-star";
    } else if (percentage >= 70) {
        performanceLevel = "جيد! 👏";
        performanceColor = "#3b82f6";
        performanceIcon = "fas fa-thumbs-up";
    } else if (percentage >= 60) {
        performanceLevel = "مقبول! 💪";
        performanceColor = "#f59e0b";
        performanceIcon = "fas fa-check-circle";
    } else {
        performanceLevel = "يحتاج تحسين! 📚";
        performanceColor = "#ef4444";
        performanceIcon = "fas fa-book";
    }
    
    quizContainer.style.display = "none";
    resultContainer.style.display = "block";
    resultContainer.innerHTML = `
        <div class="result-header">
            <h2>🎯 نتيجتك النهائية</h2>
            <div class="divider"></div>
        </div>
        
        <div class="user-info-result">
            <div class="info-item card">
                <span class="info-label"><i class="fas fa-user"></i> الاسم</span>
                <span class="info-value">${username}</span>
            </div>
            <div class="info-item card">
                <span class="info-label"><i class="fas fa-envelope"></i> البريد الإلكتروني</span>
                <span class="info-value">${email}</span>
            </div>
            <div class="info-item card">
                <span class="info-label"><i class="fas fa-calendar-alt"></i> تاريخ الاختبار</span>
                <span class="info-value">${new Date().toLocaleDateString('ar-EG')}</span>
            </div>
        </div>
        
        <div class="score-display">
            <div class="score-circle" style="border-color: ${performanceColor}">
                <span class="score-number">${score}</span>
                <span class="score-total">${questions.length}</span>
            </div>
            <div class="percentage" style="color: ${performanceColor}">
                ${percentage}%
            </div>
            <div class="performance-level" style="color: ${performanceColor}">
                <i class="${performanceIcon}"></i> ${performanceLevel}
            </div>
        </div>
        
        <div class="result-actions">
            <button id="show-answers-btn" class="btn-primary result-btn">
                <i class="fas fa-list-check"></i> عرض الإجابات
            </button>
            <button id="restart-btn" class="btn-secondary result-btn">
                <i class="fas fa-redo"></i> إعادة الاختبار
            </button>
            <button id="logout-btn" class="btn-secondary result-btn" style="background: rgba(239, 68, 68, 0.2); color: #ef4444;">
                <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
            </button>
            <button id="video-btn" class="btn-secondary result-btn" style="background: rgba(59, 27, 201, 0.2); color: #ef4444;">
                <i class="fas fa-video"></i> مشاهدة فيديو شرح الماده
            </button>
        </div>

        
    `;
    
    document.getElementById("restart-btn").addEventListener("click", restartQuiz);
    document.getElementById("logout-btn").addEventListener("click", logoutUser);
    document.getElementById("show-answers-btn").addEventListener("click", showCorrectAnswers);
    document.getElementById("video-btn").addEventListener("click", showVideoExplanation);
}

function showVideoExplanation() {
    const videoURL = "video.html";
    window.open(videoURL, '_blank');
}
function showCorrectAnswers() {
    const score = calculateScore();
    const username = sessionStorage.getItem(USER_KEY);
    const email = sessionStorage.getItem(EMAIL_KEY);
    const savedAnswers = JSON.parse(sessionStorage.getItem(ANSWERS_KEY) || '{}');
    
    let answersHTML = `
        <div class="result-header">
            <h2><i class="fas fa-list-check"></i> مراجعة الإجابات</h2>
            <div class="divider"></div>
        </div>
        
        <div class="user-info-result">
            <div class="info-item card">
                <span class="info-label">الاسم</span>
                <span class="info-value">${username}</span>
            </div>
            <div class="info-item card">
                <span class="info-label">النتيجة</span>
                <span class="info-value">${score} / ${questions.length}</span>
            </div>
        </div>
        
        <div class="answers-review">
    `;
    
    questions.forEach((question, index) => {
        const correctAnswer = question.answers.find(answer => answer.correct);
        const userAnswerIndex = savedAnswers[index];
        let userAnswerText = "لم تجب على هذا السؤال";
        let answerClass = "not-answered";
        let statusText = "لم تُجب";
        let statusIcon = "fas fa-question-circle";
        
        if (userAnswerIndex !== undefined) {
            userAnswerText = question.answers[userAnswerIndex].text;
            if (question.answers[userAnswerIndex].correct) {
                answerClass = "correct";
                statusText = "إجابة صحيحة";
                statusIcon = "fas fa-check-circle";
            } else {
                answerClass = "incorrect";
                statusText = "إجابة خاطئة";
                statusIcon = "fas fa-times-circle";
            }
        }
        
        answersHTML += `
            <div class="answer-review-item ${answerClass} card">
                <div class="answer-status">
                    <i class="${statusIcon}"></i> ${statusText}
                </div>
                <div class="question-review">
                    <strong>${index + 1}. ${question.question}</strong>
                </div>
                <div style="margin: 15px 0;">
                    <p><strong>إجابتك:</strong> ${userAnswerText}</p>
                    <p><strong>الإجابة الصحيحة:</strong> ${correctAnswer.text}</p>
                </div>
            </div>
        `;
    });
    
    answersHTML += `
        </div>
        
        <div class="result-actions">
            <button id="back-to-result" class="btn-primary result-btn">
                <i class="fas fa-arrow-right"></i> العودة للنتيجة
            </button>
            <button id="restart-from-answers" class="btn-secondary result-btn">
                <i class="fas fa-redo"></i> إعادة الاختبار
            </button>
        </div>
    `;
    
    resultContainer.innerHTML = answersHTML;
    
    document.getElementById("back-to-result").addEventListener("click", showFinalResult);
    document.getElementById("restart-from-answers").addEventListener("click", restartQuiz);
}

function restartQuiz() {
    sessionStorage.removeItem(ANSWERS_KEY);
    sessionStorage.removeItem('quiz_shuffled_questions');
    sessionStorage.setItem(QUIZ_STATE_KEY, 'quiz');
    
    shuffleArray(questions);
    sessionStorage.setItem('quiz_shuffled_questions', JSON.stringify(questions));
    
    resultContainer.style.display = "none";
    quizContainer.style.display = "block";
    startQuiz();
}

function logoutUser() {
    sessionStorage.clear();
    location.reload();
}

document.addEventListener('DOMContentLoaded', function() {
    checkLoginState();
    
    loginButton.addEventListener('click', handleLogin);
    
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    
    submitButton.addEventListener('click', function() {
        sessionStorage.setItem('quiz_shuffled_questions', JSON.stringify(questions));
        showFinalResult();
    });
    
    window.addEventListener('beforeunload', function() {
    });

      // فحص حالة المستخدم
      function checkUserState() {
        const username = sessionStorage.getItem("quiz_current_user");
        const quizState = sessionStorage.getItem("quiz_current_state");

        if (!username) {
          // إذا لم يكن هناك مستخدم مسجل، إخفاء زر متابعة الاختبار
          document.getElementById("continueQuizBtn").style.display = "none";
          document.getElementById("restartQuizBtn").innerHTML =
            '<i class="fas fa-play-circle"></i> بدء اختبار';
        } else if (quizState === "result") {
          // إذا كان المستخدم قد أكمل الاختبار
          document.getElementById("continueQuizBtn").innerHTML =
            '<i class="fas fa-eye"></i> عرض النتائج';
        }
      }

      // متابعة الاختبار
      document
        .getElementById("continueQuizBtn")
        .addEventListener("click", function () {
          const username = sessionStorage.getItem("quiz_current_user");

          if (username) {
            // إذا كان المستخدم مسجلاً، العودة للاختبار مع الحفاظ على الحالة
            window.location.href = "index.html";
          } else {
            // إذا لم يكن مسجلاً، الذهاب لصفحة تسجيل الدخول
            window.location.href = "index.html";
          }
        });

      // بدء اختبار جديد
      document
        .getElementById("restartQuizBtn")
        .addEventListener("click", function () {
          const username = sessionStorage.getItem("quiz_current_user");

          if (
            username &&
            confirm("هل تريد بدء اختبار جديد؟ سيتم مسح نتائجك الحالية.")
          ) {
            // مسح البيانات المحفوظة وبدء اختبار جديد
            sessionStorage.removeItem("quiz_saved_answers");
            sessionStorage.removeItem("quiz_shuffled_questions");
            sessionStorage.setItem("quiz_current_state", "quiz");
          }

          // الذهاب للصفحة الرئيسية
          window.location.href = "index.html";
        });

      // عند تحميل الصفحة
      document.addEventListener("DOMContentLoaded", function () {
        checkUserState();

        // حفظ حالة زيارة صفحة الفيديو
        sessionStorage.setItem("visited_video_page", "true");
      });
});