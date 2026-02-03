// 質問データ
const questions = [
    // E/I軸（外向 vs 内向）- 5問
    {
        id: 1,
        axis: 'EI',
        question: 'セッション中、沈黙が続いたとき',
        optionA: '積極的に話題を振って場を動かしたい',
        optionB: '自分の中で考えを整理する時間にしたい'
    },
    {
        id: 2,
        axis: 'EI',
        question: 'セッション後の過ごし方',
        optionA: '他のPLと感想を語り合う',
        optionB: '一人で余韻に浸る'
    },
    {
        id: 3,
        axis: 'EI',
        question: '情報収集シーンでの行動',
        optionA: 'NPCに積極的に話しかけて聞き込みをする',
        optionB: '図書館や資料で静かに調査する'
    },
    {
        id: 4,
        axis: 'EI',
        question: 'パーティでの会話',
        optionA: '積極的に話題をリードする',
        optionB: '必要最小限の発言で、聞き役に回ることが多い'
    },
    {
        id: 5,
        axis: 'EI',
        question: '他PCとの関わり方',
        optionA: '積極的に話しかけて関係を築く',
        optionB: '単独行動を好むが、必要なら協力する'
    },

    // S/N軸（感覚 vs 直観）- 5問
    {
        id: 6,
        axis: 'SN',
        question: 'GMの状況描写で最初に気になること',
        optionA: '目に見える物理的な状況や証拠',
        optionB: 'その描写が暗示する意味や伏線'
    },
    {
        id: 7,
        axis: 'SN',
        question: '謎解きのアプローチ',
        optionA: '物的証拠や目撃証言などの具体的な事実から推理',
        optionB: '動機や心理から読み解く'
    },
    {
        id: 8,
        axis: 'SN',
        question: '戦闘シーンでの思考',
        optionA: 'ルールに則った確実な戦術を実行',
        optionB: '敵の行動パターンや戦略の裏を読む'
    },
    {
        id: 9,
        axis: 'SN',
        question: 'シナリオで重視すること',
        optionA: '明確な目標と達成可能な手段があること',
        optionB: '複数の解決策や予想外の展開があること'
    },
    {
        id: 10,
        axis: 'SN',
        question: 'NPCの発言を聞いて',
        optionA: '「事実として何を言っているか」を正確に把握する',
        optionB: '「この発言がシナリオ全体で持つ意味」を考える'
    },

    // T/F軸（思考 vs 感情）- 5問
    {
        id: 11,
        axis: 'TF',
        question: '仲間が非効率な行動を提案したとき',
        optionA: '論理的に最適解を説明して提案を変えてもらう',
        optionB: '探索者らしさがあれば尊重して賛同する'
    },
    {
        id: 12,
        axis: 'TF',
        question: '重要な選択を迫られたとき',
        optionA: '成功率、リスク、リターンを計算して決める',
        optionB: '「このキャラならどう感じるか」で決める'
    },
    {
        id: 13,
        axis: 'TF',
        question: 'NPCが困っているとき',
        optionA: '客観的に状況を判断してから行動する',
        optionB: 'まずその人の気持ちに寄り添って話を聞く'
    },
    {
        id: 14,
        axis: 'TF',
        question: 'パーティ内で意見が対立したとき',
        optionA: '公平なルール適用を求める',
        optionB: '全員が納得できる妥協点を探す'
    },
    {
        id: 15,
        axis: 'TF',
        question: 'キャラクターの行動原理',
        optionA: 'よりよいゲーム結果を求められる方を選択',
        optionB: 'キャラの人間関係や心情を考慮して行動を決める'
    },

    // J/P軸（判断 vs 知覚）- 5問
    {
        id: 16,
        axis: 'JP',
        question: 'セッション開始前の準備',
        optionA: '目標や方針はある程度決めておきたい',
        optionB: '流れに任せて臨機応変に対応したい'
    },
    {
        id: 17,
        axis: 'JP',
        question: 'ミッション遂行中の行動',
        optionA: '段取り通りに進行したい',
        optionB: 'その場の直感で自由に動きたい'
    },
    {
        id: 18,
        axis: 'JP',
        question: '予想外の展開が起きたとき',
        optionA: 'できるだけ早く新しい計画を立て直す',
        optionB: '予測不能な状況を楽しむ'
    },
    {
        id: 19,
        axis: 'JP',
        question: '探索シーンでの行動',
        optionA: '優先順位をつけて効率よく探索',
        optionB: '気になったところから自由に調べる'
    },
    {
        id: 20,
        axis: 'JP',
        question: 'セッションの時間配分',
        optionA: '「この時間までにここまで進みたい」と常に意識',
        optionB: '時間より今の展開を楽しむことを優先'
    }
];
