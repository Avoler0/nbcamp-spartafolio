import { getAccessToken } from '/script/localStorage.js';

// 특정 프로젝트에 있는 댓글들을 가져오는 함수
export const getComments = async function (detailProjectId) {
  try {
    $('.detail-comments-lists').empty();

    const result = await fetch(`http://localhost:3000/api/${detailProjectId}/comments`, { method: 'GET' })
      .then((res) => res.json())
      .catch((err) => err);

    result.comments.forEach((comment) => {
      const {
        comment_id,
        user_id,
        contents,
        createdAt,
        updatedAt
      } = comment;

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
      };
      const formattedCreatedAt = formatDateTime(createdAt);

      const commentElement = $(`
        <li class="comment" data-comment-id="${comment_id}">
          <h4 class="comment-user">${user_id}</h4>
          <div class="comment-text">${contents}</div>
          <div class="comment-create-at">${formattedCreatedAt}</div>
          <button class="edit-comment-btn">수정</button>
          <button class="delete-comment-btn">삭제</button>        
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
  };
};


// 댓글 생성하는 함수 
export const createComment = async function (detailProjectId) {

  $('.comment-btn').on('click', async (event) => {
    event.preventDefault();

    if (!getAccessToken()) {
      alert("로그인 후 이용 가능합니다.");
      window.location.href = "/";
    }

    const commentInput = $('.comment-input').val();

    try {
      await fetch(`http://localhost:3000/api/comment/${detailProjectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ contents: commentInput }),
      });

      $(".comment-input").val('');
      getComments(detailProjectId);

    } catch (error) {
      console.error('Error posting comment:', error);
    };
  });
};


// 댓글 수정하는 함수
export const editComment = async function (commentElement, comment_id) {
  const commentText = commentElement.find('.comment-text').text();

  // 기존의 수정, 삭제 버튼 숨기기
  commentElement.find('.edit-comment-btn, .delete-comment-btn').hide();

  const editInput = $('<input type="text" class="edit-comment-input" value="' + commentText + '">');
  const confirmBtn = $('<button class="confirm-edit-btn">확인</button>');
  const cancelBtn = $('<button class="cancel-edit-btn">취소</button>');

  commentElement.find('.comment-text').replaceWith(editInput);
  commentElement.append(confirmBtn);
  commentElement.append(cancelBtn);

  confirmBtn.on('click', async function () {
    if (!getAccessToken()) {
      alert("로그인 후 이용 가능합니다.");
      window.location.href = "/";
    }

    const editedText = editInput.val();

    try {
      await fetch(`http://localhost:3000/api/comment/${comment_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ contents: editedText }),
      });

      // 수정 입력란 및 확인 버튼을 다시 댓글 내용으로 교체
      commentElement.find('.edit-comment-input').replaceWith(`<div class="comment-text">${editedText}</div>`);
      confirmBtn.remove();
      cancelBtn.remove();

      // 수정, 삭제 버튼 다시 보이게 하기
      commentElement.find('.edit-comment-btn, .delete-comment-btn').show();

      // 수정 취소 시에 입력된 내용이 아니라 원래의 댓글 내용으로 복원
      cancelBtn.on('click', function () {
        commentElement.find('.edit-comment-input').replaceWith(`<div class="comment-text">${commentText}</div>`);
        confirmBtn.remove();
        cancelBtn.remove();
        commentElement.find('.edit-comment-btn, .delete-comment-btn').show();
      });

    } catch (error) {
      console.error(error);
    }
  });

  // 수정 취소 시에 입력된 내용이 아니라 원래의 댓글 내용으로 복원
  cancelBtn.on('click', function () {
    commentElement.find('.edit-comment-input').replaceWith(`<div class="comment-text">${commentText}</div>`);
    confirmBtn.remove();
    cancelBtn.remove();
    commentElement.find('.edit-comment-btn, .delete-comment-btn').show();
  });
};


// 댓글 삭제하는 함수
export const deleteComment = async function (comment_id, commentElement) {
  try {
    await fetch(`http://localhost:3000/api/comment/${comment_id}`, {
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