document.addEventListener('DOMContentLoaded', () => {
    const sentenceList = document.getElementById('sentence-list');
    const sentenceForm = document.getElementById('sentence-form');
    const newSentenceInput = document.getElementById('new-sentence');

    // 문장을 저장할 배열
    let sentences = JSON.parse(localStorage.getItem('sentences')) || [];

    // 문장 목록을 갱신하는 함수
    function updateSentenceList() {
        sentenceList.innerHTML = '';
        sentences.forEach((sentence, index) => {
            const sentenceItem = document.createElement('div');
            sentenceItem.classList.add('sentence-item');
            sentenceItem.innerHTML = `
                <pre>${sentence}</pre>
                <button onclick="editSentence(${index})">수정</button>
                <button onclick="deleteSentence(${index})">삭제</button>
            `;
            sentenceItem.addEventListener('click', () => copyToClipboard(sentence));
            sentenceList.appendChild(sentenceItem);
        });
    }

    // 클립보드에 복사하는 함수
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('복사되었습니다: ' + text);
        }).catch(err => {
            alert('복사 실패: ' + err);
        });
    }

    // 문장 추가 폼 제출 이벤트 핸들러
    sentenceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newSentence = newSentenceInput.value;
        sentences.push(newSentence);
        localStorage.setItem('sentences', JSON.stringify(sentences));
        newSentenceInput.value = '';
        updateSentenceList();
    });

    // 문장 수정 함수
    window.editSentence = (index) => {
        const newSentence = prompt('문장을 수정하세요:', sentences[index]);
        if (newSentence !== null) {
            sentences[index] = newSentence;
            localStorage.setItem('sentences', JSON.stringify(sentences));
            updateSentenceList();
        }
    };

    // 문장 삭제 함수
    window.deleteSentence = (index) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            sentences.splice(index, 1);
            localStorage.setItem('sentences', JSON.stringify(sentences));
            updateSentenceList();
        }
    };

    // 초기 문장 목록 표시
    updateSentenceList();
});