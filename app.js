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
        
        // 画像生成ボタン
        document.getElementById('generate-image-btn').addEventListener('click', () => {
            this.generateResultImage();
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
        
        // 専用ページへリダイレクト
        window.location.href = `${type.toLowerCase()}.html`;
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
        
        // キャッチコピー
        const catchphraseSection = document.getElementById('catchphrase-section');
        if (result.catchphrases && result.catchphrases.length > 0) {
            catchphraseSection.innerHTML = '';
            result.catchphrases.forEach(phrase => {
                const item = document.createElement('div');
                item.className = 'catchphrase-item';
                item.textContent = phrase;
                catchphraseSection.appendChild(item);
            });
        }
        
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
    
    // 結果画像を生成
    async generateResultImage() {
        const type = document.getElementById('type-code').textContent;
        const result = results[type];
        
        // Canvas作成
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        
        // 背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 枠線
        ctx.strokeStyle = result.groupColor;
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        // タイプコード
        ctx.fillStyle = result.groupColor;
        ctx.font = 'bold 72px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(type, canvas.width / 2, 120);
        
        // タイプ名
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText(result.name, canvas.width / 2, 170);
        
        // キャッチコピー（最初の1つ）
        ctx.fillStyle = '#333';
        ctx.font = '20px sans-serif';
        const catchphrase = result.catchphrases[0];
        this.wrapText(ctx, catchphrase, canvas.width / 2, 230, canvas.width - 100, 28);
        
        // 特徴（3つ）
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'left';
        const features = [
            result.catchphrases[0].substring(0, 30) + '...',
            result.catchphrases[1].substring(0, 30) + '...',
            result.catchphrases[2].substring(0, 30) + '...'
        ];
        
        features.forEach((feature, index) => {
            ctx.fillText(`• ${feature}`, 80, 340 + (index * 40));
        });
        
        // URL
        ctx.fillStyle = '#666';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(window.location.origin + window.location.pathname, canvas.width / 2, 550);
        
        // 画像をダウンロード
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `trpg-mbti-${type}.png`;
        link.href = dataUrl;
        link.click();
    },
    
    // テキスト折り返し
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split('');
        let line = '';
        let testLine = '';
        let currentY = y;
        
        for (let n = 0; n < words.length; n++) {
            testLine = line + words[n];
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n];
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
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
