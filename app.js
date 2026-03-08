// アプリケーションのメインロジック
const app = {
    answers: {},
    
    init() {
        this.renderQuestions();
        this.setupEventListeners();
        this.checkUrlParams();
    },
    
    // URLパラメータから結果を表示
    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        
        if (type && results[type]) {
            // URLから直接結果表示
            setTimeout(() => {
                this.showResult(type);
                document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    },
    
    // 質問を動的に生成
    renderQuestions() {
        const questionsSection = document.getElementById('questions');
        
        questions.forEach((q, index) => {
            const card = document.createElement('div');
            card.className = 'question-card';
            card.innerHTML = `
                <div class="question-header">
                    <div class="question-number">${index + 1}</div>
                    <div class="question-text">${q.question}</div>
                </div>
                <div class="question-options">
                    <label class="option-label">
                        <input type="radio" name="q${index}" value="3" data-axis="${q.axis}">
                        <span class="option-text">A: ${q.optionA}</span>
                    </label>
                    <label class="option-label">
                        <input type="radio" name="q${index}" value="1" data-axis="${q.axis}">
                        <span class="option-text">どちらかと言えばA</span>
                    </label>
                    <label class="option-label">
                        <input type="radio" name="q${index}" value="-1" data-axis="${q.axis}">
                        <span class="option-text">どちらかと言えばB</span>
                    </label>
                    <label class="option-label">
                        <input type="radio" name="q${index}" value="-3" data-axis="${q.axis}">
                        <span class="option-text">B: ${q.optionB}</span>
                    </label>
                </div>
            `;
            questionsSection.appendChild(card);
        });
        
        // 診断ボタンを表示
        document.getElementById('submit-section').style.display = 'block';
    },
    
    // イベントリスナー設定
    setupEventListeners() {
        // ラジオボタンの選択
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                // 選択されたlabelにクラスを追加
                const labels = e.target.closest('.question-options').querySelectorAll('.option-label');
                labels.forEach(label => label.classList.remove('selected'));
                e.target.closest('.option-label').classList.add('selected');
                
                // 回答を保存
                const questionIndex = parseInt(e.target.name.replace('q', ''));
                this.answers[questionIndex] = {
                    value: parseInt(e.target.value),
                    axis: e.target.dataset.axis
                };
                
                // すべて回答されているかチェック
                this.checkAllAnswered();
            }
        });
        
        // 診断ボタン
        document.getElementById('submit-btn').addEventListener('click', () => {
            if (this.checkAllAnswered()) {
                this.calculateResult();
            }
        });
        
        // 結果コピーボタン
        document.getElementById('copy-result-btn').addEventListener('click', () => {
            this.copyResultText();
        });
        
        // URLコピーボタン
        document.getElementById('copy-url-btn').addEventListener('click', () => {
            this.copyResultUrl();
        });
        
        // もう一度診断ボタン
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restart();
        });
    },
    
    // すべての質問に回答されているかチェック
    checkAllAnswered() {
        const allAnswered = Object.keys(this.answers).length === questions.length;
        const warningText = document.getElementById('warning-text');
        const submitBtn = document.getElementById('submit-btn');
        
        if (!allAnswered) {
            warningText.style.display = 'block';
            submitBtn.disabled = false; // ボタンは常に押せるようにする
            return false;
        } else {
            warningText.style.display = 'none';
            submitBtn.disabled = false;
            return true;
        }
    },
    
    // 結果を計算
    calculateResult() {
        if (!this.checkAllAnswered()) {
            alert('すべての質問に回答してください');
            return;
        }
        
        const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };
        
        Object.values(this.answers).forEach(answer => {
            scores[answer.axis] += answer.value;
        });
        
        const type = 
            (scores.EI > 0 ? 'E' : 'I') +
            (scores.SN > 0 ? 'N' : 'S') +
            (scores.TF > 0 ? 'F' : 'T') +
            (scores.JP > 0 ? 'P' : 'J');
        
        this.showResult(type);
    },
    
    // 結果を表示
    showResult(type) {
        const result = results[type];
        
        if (!result) {
            alert('結果の取得に失敗しました');
            return;
        }
        
        // 結果データを表示
        document.getElementById('type-code').textContent = type;
        document.getElementById('type-name').textContent = result.name;
        
        const typeGroup = document.getElementById('type-group');
        typeGroup.textContent = result.group;
        typeGroup.style.background = result.groupColor;
        
        // 特性バッジ
        const traitsContainer = document.getElementById('traits');
        traitsContainer.innerHTML = '';
        result.traits.forEach(trait => {
            const badge = document.createElement('div');
            badge.className = 'trait-badge';
            badge.textContent = trait;
            traitsContainer.appendChild(badge);
        });
        
        // 説明文
        document.getElementById('pl-description').innerHTML = result.plDescription;
        document.getElementById('gm-description').innerHTML = result.gmDescription;
        document.getElementById('playstyle').innerHTML = result.playstyle;
        
        // 結果セクションを表示
        document.getElementById('result').style.display = 'block';
        
        // 結果までスクロール
        setTimeout(() => {
            document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        // URLを更新（履歴には追加しない）
        const url = new URL(window.location);
        url.searchParams.set('type', type);
        window.history.replaceState({}, '', url);
    },
    
    // 結果テキストをコピー
    copyResultText() {
        const type = document.getElementById('type-code').textContent;
        const result = results[type];
        
        const text = `【TRPG的MBTI診断結果】

タイプ: ${type} - ${result.name}
${result.group}

特性: ${result.traits.join('・')}

PLのあなた:
${this.stripHtml(result.plDescription)}

GMのあなた:
${this.stripHtml(result.gmDescription)}

診断はこちら: ${window.location.origin}${window.location.pathname}
結果を見る: ${window.location.href}`;
        
        this.copyToClipboard(text);
    },
    
    // 結果URLをコピー
    copyResultUrl() {
        this.copyToClipboard(window.location.href);
    },
    
    // クリップボードにコピー
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            const message = document.getElementById('copy-message');
            message.style.display = 'block';
            setTimeout(() => {
                message.style.display = 'none';
            }, 2000);
        }).catch(err => {
            alert('コピーに失敗しました');
        });
    },
    
    // HTMLタグを除去
    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    },
    
    // リスタート
    restart() {
        // 回答をリセット
        this.answers = {};
        
        // ラジオボタンをリセット
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        
        // 選択クラスを削除
        document.querySelectorAll('.option-label').forEach(label => {
            label.classList.remove('selected');
        });
        
        // 結果を非表示
        document.getElementById('result').style.display = 'none';
        
        // URLをリセット
        window.history.replaceState({}, '', window.location.pathname);
        
        // トップにスクロール
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// アプリケーション開始
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
