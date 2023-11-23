

const toggleTechTab = () => {
  $('.tech-wrap .input-wrap .tech-list').on('click',()=>{
    if($('.tech-wrap').hasClass('active')){
      $('.tech-wrap').removeClass('active')
    }else{
      $('.tech-wrap').addClass('active')
    }
  })
}

const closeTechTab = () => {
  $('.tech-wrap .tech-tab').on('click',()=>{
    if($('.tech-wrap').hasClass('active')){
      $('.tech-wrap').removeClass('active')
    }else{
      $('.tech-wrap').addClass('active')
    }
  })
}

const clickTechTabBtn = () => {
  $('.tech-wrap .tech-tab .tab-content').on('click','.tech-btn',(event) => {
    const selectTech = event.currentTarget.innerText;
    const techList = $('.tech-wrap .tech-list');
    event.currentTarget.remove();
    event.stopPropagation();

    if(techList.find('.select-tech').length === 1) techList.empty();

    if($('.tech-wrap .tech-tab .tab-content').find('.tech-btn').length === 0){
      $('.tech-wrap').removeClass('active')
    }
    
    techList.append(`
      <div class="tech-item">
        ${selectTech}
      </div>
    `)
  })
}

const clickTechListBtn = () =>{
  $('.tech-wrap .tech-list').on('click','.tech-item',(event)=>{
    const removeTech = event.currentTarget.innerText;
    const techList = $('.tech-wrap .tech-list');
    event.currentTarget.remove();
    event.stopPropagation();

    if(techList.find('.tech-item').length === 0) {
      $('.tech-wrap .tech-list').append(`<div class="select-tech">기술 선택</div>`)
    };

    $('.tech-wrap').addClass('active')

    $('.tech-wrap .tech-tab .tab-content').append(`
      <button class="tech-btn">
        ${removeTech}
      </button>
    `)
  })
}

const initProjectRegister = () => {
  const techCategory = ['React','Node.js','Next.js','Express'];

  // 태크 탭에 버튼 추가
  $('.tech-wrap .tech-tab .tab-content').append(`
    ${techCategory.map((tech)=>{
      return (
        `
          <button class="tech-btn">
            ${tech}
          </button>
        `
      )
    }).join("")}
  `)

  toggleTechTab();
  clickTechTabBtn();
  clickTechListBtn();
  closeTechTab();

  $('.submit-btn').on('click',async ()=>{
    const formData = new FormData();
    formData.enctype = "multipart/form-data"
    const fileInput = document.querySelector('.input-wrap .additional')
    const techList = $('.tech-wrap .tech-list').find('.tech-item');

    const data = {
      projectTitle: $('input.project-title').val(),
      teamName: $('input.team-name').val(),
      overView: $('input.over-view').val(),
      techStack: [],
      githubAddress: $('input.github-address').val(),
      coreFunction: $('input.core-function').val(),
      demoSite: $('input.demo-site').val(),
      description: $('textarea.description').val(),
    }

    for(let i = 0; i < fileInput.files.length; i++){
      formData.append('additional', fileInput.files[i]);
    }

    for(let i = 0; i < techList.length; i++){
      data.techStack.push(techList[i].innerText);
    }

    for(let property in data){
      formData.append(property, data[property]);
    }
    
    await fetch('http://localhost:3000/api/post', {
      method: 'POST',
      body: formData
    })
  })

  

  
  $('.cancel-btn').on('click',()=>{
    if(confirm('작성한 데이터가 사라집니다.')){
      window.location.href = "/";
    }else{
      return;
    }
  })
}

initProjectRegister();