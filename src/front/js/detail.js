
// 특정 프로젝트를 가져오는 함수
const getDetailProject = async function (detailProjectId) {
  try {
    const result = await fetch(`http://localhost:3000/api/post/${detailProjectId}`, { method: 'GET' })
      .then((res) => res.json())
      .catch((err) => err);

    // result.project가 객체인 경우
    const project = result.project;
    console.log('project: ', project);

    const {
      description,
      core_function,
      demo_site,
      team_name,
      github_address,
      images_path,
      like,
      over_view,
      tech_stack,
      createdAt,
      updatedAt,
      title,
    } = project;

    console.log(description)
    const imagePath = images_path.split(',')
    const thumbnail = images_path
      ? `https://nbcamp-bukkit.s3.ap-northeast-2.amazonaws.com/${imagePath[0]}`
      : null;
    const techStack = tech_stack ? tech_stack.split(",") : [];

    $('main').prepend(`
      <div class="detail-board">
        <div class="back" style="background-image: url('${thumbnail}')"></div>
        <div class="detail-board-left">
          <div class="detail-board-title">${title}</div>
          <div class="detail-board-team">${team_name}</div>
          <div class="detail-board-overview">${over_view}</div>
          <div class="detail-tech-icons">
            ${techStack
              .map((tech) => {
                return `<div class="tech-icon">${tech.replaceAll('"','')}</div>`;
              })
              .join('')}
          </div>
        </div>
        <div class="detail-board-right">
          <button class="go-demo">데모 사이트 보러가기</button>
        </div>
      </div>
      <!-- 상단 보드 끝 -->

      <!-- 본문 시작 -->
      <div class="detail-body">
        <h2 class="detail-body-title">우리 프로젝트를 소개합니다.</h2>
        <div class="detail-body-point">
          <h3 class="detail-body-point-title">프로젝트 포인트</h3>
          <div class="detail-body-point-text">
            ${core_function}
          </div>
        </div>
        <div class="detail-body-contents">
          <h3 class="detail-body-contents-title">상세 내용</h3>
          <div class="detail-body-contents-text">${description.replaceAll("\n","<br/>")}</div>
        </div>
        <ul class="attachments">
          ${imagePath
            .map((path) => {
              return `
                <li class="attachment">
                  <a href="https://nbcamp-bukkit.s3.ap-northeast-2.amazonaws.com/${path}" target="_blank">
                    <img src="https://nbcamp-bukkit.s3.ap-northeast-2.amazonaws.com/${path}"></img> 
                  </a>
                </li>
              `;
            })
            .join('')}
        </ul>
        <button class="like-btn">좋아요</button>
      </div>
      <!-- 본문 끝 -->
    `);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


// 특정 프로젝트에 있는 댓글들을 가져오는 함수
const getComments = async function (detailProjectId) {
  try {
    $('.detail-comments-lists').empty();

    const result = await fetch(`http://localhost:3000/api/${detailProjectId}/comments`, { method: 'GET' })
      .then((res) => res.json())
      .catch((err) => err);

    result.comments.forEach((comment) => {
      const {
        comment_id,
        user_id,
        project_id,
        contents,
        createdAt,
        updatedAt
      } = comment;

      const commentElement = $(`
        <li class="comment" data-comment-id="${comment_id}">
          <h4 class="comment-user">${user_id}</h4>
          <div class="comment-text">${contents}</div>
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
const createComment = async function (detailProjectId) {
  $('.comment-btn').on('click', async (event) => {
    event.preventDefault();

    const commentInput = $('.comment-input').val();

    try {
      await fetch(`http://localhost:3000/api/comment/${detailProjectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents: commentInput }),
      });

      $(".comment-input").val('');
      getComments(detailProjectId);

    } catch (error) {
      console.error('Error posting comment:', error);
    };
  });
}

// 댓글 수정하는 함수
const editComment = async function (commentElement, comment_id) {
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
    const editedText = editInput.val();
    try {
      await fetch(`http://localhost:3000/api/comment/${comment_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
const deleteComment = async function (comment_id, commentElement) {
  try {
    await fetch(`http://localhost:3000/api/comment/${comment_id}`, {
      method: 'DELETE',
    });
    commentElement.remove(); // 댓글 삭제 후 화면에서도 제거
  } catch (error) {
    console.error(error);
  }
};



// 현재 URL에서 경로 부분을 가져오기
let path = window.location.pathname;


// 경로에서 숫자 부분 추출
let match = path.match(/\/detail\/(\d+)/);

if (match) {
  console.log('실행?')
  let detailProjectId = parseInt(match[1]);

  getDetailProject(detailProjectId);
  getComments(detailProjectId);
  createComment(detailProjectId);
} else {
  console.error(error);
}
