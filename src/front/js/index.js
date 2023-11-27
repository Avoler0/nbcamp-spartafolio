let projectsList = [];

// console.log('<%= process.env.PORT %>');

function searchProject() {
  $('nav .search-input').on('keypress', async (event) => {
    if (event.key !== 'Enter') return;

    const searchValue = $('nav .search-input').val();

    await fetch(`/api/post?postName=${searchValue}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) throw new Error(res.message);
        drawProjectsCard(res.projects);
      })
      .catch((err) => {
        alert(err.message);
      });
  });
}

searchProject();

function mainTitleSelect() {
  if (projectsList.length === 0) return;

  const maxLikeProjecet = projectsList.reduce((prev, next) => {
    return prev.like > next.like ? prev : next;
  });

  const { project_id, images_path, over_view, team_name, title } =
    maxLikeProjecet;

  const thumbnail = images_path
    ? `https://nbcamp-bukkit.s3.ap-northeast-2.amazonaws.com/${images_path.split(',')[0]
    }`
    : 'https://t1.daumcdn.net/cfile/tistory/171034435043238224';

  $('main #main-title .content').empty();
  $('main #main-title .back').css('background-image', `url("${thumbnail}")`);
  $('main #main-title .content').append(`
    <div class="title">
      ${title}
    </div>
    <div class="sub-title">
      ${team_name}
    </div>
    <div class="over-view">
      ${over_view}
    </div>
    <div class="go-project">
      <button>
        <a href="/detail/${project_id}">프로젝트 구경하기</a>
      </button>
    </div>
  `);
}

function sortSelect() {
  $('#main-content nav ul')
    .find('li')
    .on('click', (event) => {
      const readyActive = $('#main-content nav ul').children('.active');
      readyActive.removeClass('active');
      event.currentTarget.classList.add('active');
      const sortOrder = $('#main-content nav ul')
        .children('.active')[0]
        .getAttribute('data-sort');

      if (sortOrder === 'latest') latestSort();
      if (sortOrder === 'like') likeSort();
      if (sortOrder === 'view') viewSort();
    });
}

const latestSort = () => {
  projectsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  drawProjectsCard(projectsList);
};
const likeSort = () => {
  projectsList.sort((a, b) => b.like - a.like);
  drawProjectsCard(projectsList);
};
const viewSort = () => {
  projectsList.sort((a, b) => b.view - a.view);
  drawProjectsCard(projectsList);
};

async function getProjects() {
  const result = await fetch('/api/posts', {
    method: 'GET',
  })
    .then((res) => res.json())
    .catch((err) => err);

  if (result.success) {
    projectsList = result.projects;
    mainTitleSelect();
    drawProjectsCard(result.projects);
    sortSelect();
  }
}

function drawProjectsCard(projects) {
  const contentDiv = $('main #main-content .content');

  contentDiv.empty();
  // console.log(projects);

  projects.forEach((project) => {
    const {
      project_id,
      github_address,
      images_path,
      like,
      view,
      over_view,
      tech_stack,
      title,
      comment_count,
    } = project;
    const thumbnail = images_path
      ? `https://nbcamp-bukkit.s3.ap-northeast-2.amazonaws.com/${images_path.split(',')[0]
      }`
      : 'https://t1.daumcdn.net/cfile/tistory/171034435043238224';
    const techStack = tech_stack ? tech_stack.split(',') : [];
    contentDiv.append(`
    <div class="community-card">
      <div class="card-thumbnail">
        <a href="/detail/${project_id}">
          <img
          src="${thumbnail}" />
        </a>
      </div>
      <div class="card-description">
        <div class="card-title">
          <a href="/detail/${project_id}">
            ${title}
          </a>
        </div>
        <div class="card-overview">${over_view ? over_view : '소개가 없습니다.'
      }</div>
        <div class="card-footer">
          <div class="card-tech">
            ${techStack
        .map((tech) => {
          return `
                <div>${tech.replaceAll('"', '')}</div>
              `;
        })
        .join('')}
          </div>
          <div class="card-info">
            <div class="card-image github">
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              <span>
                <a href="${github_address}" target="_blank">${github_address}</a>
              </span>
            </div>
            <div class="info-right">
              <div class="card-image like">
                <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                <span>${like}</span>
              </div>
              <div class="card-image view">
                <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>
                <span>${view}</span>
              </div>
              <div class="card-image comment">
                <svg viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 1C2.34315 1 1 2.34315 1 4V15C1 16.6569 2.34315 18 4 18H6V22C6 22.388 6.22446 22.741 6.57584 22.9056C6.92723 23.0702 7.3421 23.0166 7.64018 22.7682L13.362 18H20C21.6569 18 23 16.6569 23 15V4C23 2.34315 21.6569 1 20 1H4Z" fill="#000000"></path> </g></svg>
                <span>${comment_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
  });
}

getProjects();
