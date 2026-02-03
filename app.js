// アプリケーションのメイン処理
const app = {
    currentQuestion: 0,
    answers: {
        EI: 0,  // 正の値=E, 負の値=I
        SN: 0,  // 正の値=S, 負の値=N
        TF: 0,  // 正の値=T, 負の値=F
        JP: 0   // 正の値=J, 負の値=P
    },

    // 診断開始
    startQuiz() {
        this.currentQuestion = 0;
        this.answers = { EI: 0, SN: 0, TF: 0, JP: 0 };
        this.showScreen('quiz-screen');
        this.displayQuestion();
    },

    // 画面切り替え
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    },

    // 質問を表示
    displayQuestion() {
        const question = questions[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / questions.length) * 100;

        // 進捗バーを更新
        document.getElementById('progress-fill').style.width = progress + '%';
        document.getElementById('question-number').textContent = 
            `質問 ${this.currentQuestion + 1} / ${questions.length}`;

        // 質問文を表示
        document.getElementById('question-text').textContent = question.question;

        // 選択肢を表示
        document.getElementById('option-a-text').textContent = question.optionA;
        document.getElementById('option-a-weak-text').textContent = question.optionA;
        document.getElementById('option-b-weak-text').textContent = question.optionB;
        document.getElementById('option-b-text').textContent = question.optionB;

        // ボタンにイベントリスナーを設定
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(button => {
            // 既存のリスナーを削除して再追加
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', () => {
                this.answerQuestion(parseInt(newButton.dataset.value));
            });
        });
    },

    // 回答を記録して次へ
    answerQuestion(value) {
        const question = questions[this.currentQuestion];
        
        // スコアを記録
        this.answers[question.axis] += value;

        // 次の質問へ
        this.currentQuestion++;

        if (this.currentQuestion < questions.length) {
            this.displayQuestion();
        } else {
            this.showResult();
        }
    },

    // 結果を判定して表示
    showResult() {
        // タイプを判定
        const type = this.determineType();
        const result = results[type];

        // 結果画面に切り替え
        this.showScreen('result-screen');

        // タイプコードと名前を表示
        document.getElementById('type-code').textContent = type;
        document.getElementById('type-name').textContent = result.name;

        // グループを表示
        const groupElement = document.getElementById('type-group');
        groupElement.textContent = result.group;
        groupElement.style.borderColor = result.groupColor;

        // 特性を表示
        const traitsElement = document.getElementById('traits');
        traitsElement.innerHTML = '';
        result.traits.forEach(trait => {
            const traitSpan = document.createElement('span');
            traitSpan.className = 'trait';
            traitSpan.textContent = trait;
            traitSpan.style.borderColor = result.groupColor;
            traitSpan.style.color = result.groupColor;
            traitsElement.appendChild(traitSpan);
        });

        // 説明を表示
        document.getElementById('pl-description').innerHTML = result.plDescription;
        document.getElementById('gm-description').innerHTML = result.gmDescription;
        document.getElementById('playstyle').innerHTML = result.playstyle;

        // ヘッダーの背景色を設定
        const typeHeader = document.querySelector('.type-header');
        typeHeader.style.background = `linear-gradient(135deg, ${result.groupColor} 0%, ${this.adjustColor(result.groupColor, -20)} 100%)`;
    },

    // タイプを判定
    determineType() {
        let type = '';
        
        // E/I
        type += this.answers.EI >= 0 ? 'E' : 'I';
        
        // S/N
        type += this.answers.SN >= 0 ? 'S' : 'N';
        
        // T/F
        type += this.answers.TF >= 0 ? 'T' : 'F';
        
        // J/P
        type += this.answers.JP >= 0 ? 'J' : 'P';
        
        return type;
    },

    // 色を調整（明るく/暗く）
    adjustColor(color, amount) {
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        
        let r = (num >> 16) + amount;
        let g = ((num >> 8) & 0x00FF) + amount;
        let b = (num & 0x0000FF) + amount;
        
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));
        
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    },

    // 診断をやり直す
    restart() {
        this.showScreen('start-screen');
    }
};

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('TRPG的MBTI診断 - 準備完了');
});
