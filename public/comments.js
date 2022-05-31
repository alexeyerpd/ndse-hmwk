const commentInput = document.getElementById('comment-input');
const commentBtnSubmit = document.getElementById('comment-btn-send');
const commentList = document.querySelector('.comments__list');

function createComment(comment) {
    return `
    <li class="comments__item">
        <div class="comments__date">Создан: ${new Date(
            comment.date,
        ).toLocaleString()}</div>
        <div class="comments__username">Автор: ${comment.user.name} ${
        comment.user.surname
    }</div>
        <div class="comments__text">${comment.text}</div>
    </li>
    `;
}

function init() {
    if (!commentInput) return;
    const bookId = location.pathname.split('/').pop();
    const socket = io.connect('/', { query: `bookId=${bookId}` });

    commentBtnSubmit.addEventListener('click', (e) => {
        if (!commentInput.value) return;
        socket.emit('add-message', commentInput.value);
        commentInput.value = '';
    });

    socket.on('comment', (data) => {
        commentList.insertAdjacentHTML('beforeend', createComment(data));
    });
}

init();
