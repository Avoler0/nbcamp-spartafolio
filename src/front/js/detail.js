
// 특정 프로젝트를 가져오는 함수
async function getDetailProject() {
  try {
    const result = await fetch(`http://localhost:3000/api/posts/1`, { method: 'GET' })
      .then((res) => res.json())
      .catch((err) => err);

    // result.project가 객체인 경우
    const project = result.project;

    const {
      user_id,
      project_id,
      description,
      core_function,
      demo_site,
      github_address,
      images_path,
      like,
      over_view,
      tech_stack,
      createdAt,
      updatedAt,
      title,
    } = project;

    const thumbnail = images_path ? images_path.split(",")[0] : null;
    const techStack = tech_stack ? tech_stack.split(",") : [];

    $('main').prepend(`
      <div class="detail-board">
        <div class="detail-board-left">
          <div class="detail-board-title">${title}</div>
          <div class="detail-board-team">팀 이름 일단 없고요</div>
          <div class="detail-board-overview">${over_view}</div>
          <div class="detail-tech-icons">
            ${techStack.map((tech) => {
      return `<div class="tech-icon">${tech}</div>`;
    }).join("")}
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
            프로젝트 포인트도 없네요 ! 프로젝트 포인트도 없네요 ! 
            <p>프로젝트 포인트도 없네요 ! </p>
            <p>프로젝트 포인트도 없네요 ! </p>
            <p>프로젝트 포인트도 없네요 ! </p>
          </div>
        </div>
        <div class="detail-body-contents">
          <h3 class="detail-body-contents-title">상세 내용</h3>
          <div class="detail-body-contents-text">${description}</div>
        </div>
        <ul class="attachments">
          <li class="attachment">첨부파일1</li>
          <li class="attachment">첨부파일3</li>
          <li class="attachment">첨부파일4</li>
        </ul>
        <button class="like-btn">좋아요</button>
      </div>
      <!-- 본문 끝 -->
    `);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
getDetailProject();


// 특정 프로젝트에 있는 댓글들을 가져오는 함수
async function getComments() {
  try {
    const result = await fetch('http://localhost:3000/api/1/comments', { method: 'GET' })
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

      $('.detail-comments-lists').append(`
      <li class="comment">
        <h4 class="comment-user">${user_id}</h4>
        <div class="comment-text">
          ${contents}
        </div>
        <div class="comment-date">${createdAt}</div>
      </li>
      `);
    });



  } catch (error) {
    console.error(error);
  }

};

getComments();