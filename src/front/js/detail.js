import { createComment, getComments, getUserId } from '/js/comments.js';

// 현재 URL에서 경로 부분 가져오는 함수 
const getDetailProjectId = function () {
  let detailProjectId
  // 현재 URL에서 경로 부분을 가져오기
  let path = window.location.pathname;

  // 경로에서 숫자 부분 추출
  let match = path.match(/\/detail\/(\d+)/);

  if (match) {
    return detailProjectId = parseInt(match[1]);

  } else {
    console.error(error);
  };
};

// 특정 프로젝트를 가져오는 함수
const getDetailProject = async function (detailProjectId) {
  try {
    const result = await fetch(`/api/post/${detailProjectId}`, { method: 'GET' })
      .then((res) => res.json())
      .catch((err) => err);

    // result.project가 객체인 경우
    const project = result.project;

    if (!project) {
      alert("존재하지 않는 프로젝트 입니다.");
      window.location.href = "/";
    };

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
          return `<div class="tech-icon">${tech.replaceAll('"', '')}</div>`;
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
          <div class="detail-body-contents-text">${description.replaceAll("\n", "<br/>")}</div>
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

    getUserId()

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getDetailProject(getDetailProjectId());
getComments(getDetailProjectId());
createComment(getDetailProjectId());
