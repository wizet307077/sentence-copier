document.addEventListener('DOMContentLoaded', () => {
    const sentenceList = document.getElementById('sentence-list');
    const sentenceForm = document.getElementById('sentence-form');
    const newSentenceInput = document.getElementById('new-sentence');
    const db = firebase.firestore();

    // Firestore에서 문장 불러오기
    function loadSentences() {
        db.collection("sentences").get().then((querySnapshot) => {
            sentenceList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const sentence = doc.data().text;
                displaySentence(sentence, doc.id);
            });
        });
    }

    // 문장을 화면에 표시하는 함수
    function displaySentence(sentence, id) {
        const sentenceItem = document.createElement('div');
        sentenceItem.classList.add('sentence-item');
        sentenceItem.innerHTML = `
            <pre>${sentence}</pre>
            <button onclick="editSentence('${id}', '${sentence}')">수정</button>
            <button onclick="deleteSentence('${id}')">삭제</button>
        `;
        sentenceItem.addEventListener('click', () => copyToClipboard(sentence));
        sentenceList.appendChild(sentenceItem);
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
        db.collection("sentences").add({ text: newSentence }).then(() => {
            newSentenceInput.value = '';
            loadSentences();
        });
    });

    // 문장 수정 함수
    window.editSentence = (id, currentText) => {
        const newSentence = prompt('문장을 수정하세요:', currentText);
        if (newSentence !== null) {
            db.collection("sentences").doc(id).set({ text: newSentence }).then(() => {
                loadSentences();
            });
        }
    };

    // 문장 삭제 함수
    window.deleteSentence = (id) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            db.collection("sentences").doc(id).delete().then(() => {
                loadSentences();
            });
        }
    };

    // 초기 문장 목록 표시
    loadSentences();
});
