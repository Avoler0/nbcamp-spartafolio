import { getAccessToken, setAccessToken } from '/js/localStorage.js';

// 로그인 한 사람의 정보를 가져오는 함수
export const getUserId = async function () {
  try {
    const result = await fetch('/api/user', {

      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
  .then((res) => res.json());
    const userId = result.data.user_id;
    return userId;
  } catch (error) {
    console.error(error);
  }
};

// 날짜 포멧팅 하는 함수
// createdAt 포멧팅
function formatDateTime(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 특정 프로젝트에 있는 댓글들을 가져오는 함수
export const getComments = async function (detailProjectId) {
  try {
    $('.detail-comments-lists').empty();

    const result = await fetch(
      `/api/${detailProjectId}/comments`,
      { method: 'GET' },
    )
      .then((res) => res.json())
      .catch((err) => err);

    const currentUserId = await getUserId();

    result.comments.forEach((comment) => {
      const {
        comment_id,
        user_id,
        contents,
        createdAt,
        updatedAt,
        User: { name },
      } = comment;

      const formattedCreatedAt = formatDateTime(createdAt);
      const formattedUpdatedAt = formatDateTime(updatedAt);

      const commentElement = $(`
        <li class="comment" data-comment-id="${comment_id}" data-updated-at="${formattedUpdatedAt}">
          <h4 class="comment-user">${name}</h4>
          <div class="comment-box">
            <div class="comment-contents-box">
              <div class="comment-text">${contents}</div>
              ${
                formattedCreatedAt === formattedUpdatedAt
                  ? `<div class="comment-create-at">${formattedCreatedAt}</div>`
                  : `<div class="comment-create-at">${formattedUpdatedAt} 수정됨</div>`
              }
            </div>
            ${
              user_id === currentUserId
                ? `<div class="comment-btns-box">
             <button class="edit-comment-btn">수정</button>
             <button class="delete-comment-btn">삭제</button>`
                : ''
            }
            </div>
          </div>        
        </li>
      `);

      // 수정 버튼 클릭 시 수정 입력란을 보여주는 이벤트 추가
      commentElement.find('.edit-comment-btn').on('click', function () {
        editComment(commentElement, comment_id);
      });

      // 삭제 버튼 클릭 시 댓글 삭제하는 이벤트 추가
      commentElement.find('.delete-comment-btn').on('click', function () {
        deleteComment(comment_id, commentElement);
      });

      $('.detail-comments-lists').append(commentElement);
    });
  } catch (error) {
    console.error(error);
  }
};

// 댓글 생성하는 함수
export const createComment = async function (detailProjectId) {
  $('.comment-btn').on('click', async (event) => {
    event.preventDefault();

    if (!getAccessToken()) {
      alert('로그인 후 이용 가능합니다.');
      window.location.href = '/';
    }

    const commentInput = $('.comment-input').val();

    try {
      await fetch(`/api/comment/${detailProjectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ contents: commentInput }),
      });

      $('.comment-input').val('');
      getComments(detailProjectId);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  });
};

// 댓글 수정하는 함수
export const editComment = async function (commentElement, comment_id) {
  const commentText = commentElement.find('.comment-text').text();

  // 기존의 수정, 삭제 버튼 숨기기
  commentElement.find('.edit-comment-btn, .delete-comment-btn').hide();

  const editInput = $(
    '<input type="text" class="edit-comment-input" value="' +
      commentText +
      '">',
  );
  const confirmBtn = $('<button class="confirm-edit-btn">확인</button>');
  const cancelBtn = $('<button class="cancel-edit-btn">취소</button>');

  commentElement.find('.comment-text').replaceWith(editInput);

  const editBtnsDiv = $('<div class="edit-btns"></div>');
  editBtnsDiv.append(confirmBtn);
  editBtnsDiv.append(cancelBtn);

  commentElement.find('.comment-box').append(editBtnsDiv);

  editInput.on('keydown', async function (event) {
    if (event.key === 'Enter') {
      // event.preventDefault();
      confirmBtn.trigger('click');
    }
  });

  confirmBtn.on('click', async function () {
    const editedText = editInput.val();

    const result = await fetch(
      `/api/comment/${comment_id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ contents: editedText }),
      },
    );

    const { updatedComment } = await result.json();

    // 수정 입력란 및 확인 버튼을 다시 댓글 내용으로 교체
    commentElement
      .find('.edit-comment-input')
      .replaceWith(`<div class="comment-text">${editedText}</div>`);
    commentElement
      .find('.comment-create-at')
      .replaceWith(
        `<div class="comment-updated-at">${formatDateTime(
          updatedComment.updatedAt,
        )} 수정됨</div>`,
      );
    editBtnsDiv.remove();

    // 수정, 삭제 버튼 다시 보이게 하기
    commentElement.find('.edit-comment-btn, .delete-comment-btn').show();
  });

  // 수정 취소 시에 입력된 내용이 아니라 원래의 댓글 내용으로 복원
  cancelBtn.on('click', function () {
    commentElement
      .find('.edit-comment-input')
      .replaceWith(`<div class="comment-text">${commentText}</div>`);
    editBtnsDiv.remove();

    commentElement.find('.edit-comment-btn, .delete-comment-btn').show();
  });
};

// 댓글 삭제하는 함수
export const deleteComment = async function (comment_id, commentElement) {
  try {
    await fetch(`/api/comment/${comment_id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    commentElement.remove(); // 댓글 삭제 후 화면에서도 제거
  } catch (error) {
    console.error(error);
  }
};
