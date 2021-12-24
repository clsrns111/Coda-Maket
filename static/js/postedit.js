function changeSoldOut(value) {
  document.querySelector('.sold_btn').value = value;

  if (value === 'false') {
    document.querySelector('.sold_btn').style.color = 'green';
  } else {
    document.querySelector('.sold_btn').style.color = 'red';
  }
}

function changeCategory(value) {
  document.querySelector('.category_btn').value = value;
}

function selec_change() {
  let data = document.querySelector('.sold_btn').value;
  if (data === 'false') {
    document.querySelector('.sold_btn').style.color = 'green';
  } else {
    document.querySelector('.sold_btn').style.color = 'red';
  }
}

let file_count = document.querySelectorAll('.img-box > .img ').length;

function uploadCheck(value, port) {
  console.log(value, port);
  let data = document.querySelector('.img_count_text');
  let input = document.querySelector('.file_input');
  let fileName = document.querySelector('.file_input').files;
  let files = document.querySelector('.file_input').files.length;
  let postImg = document.querySelector('.post_img_line');
  let file_count = document.querySelectorAll('.img-box > .img ').length;

  let img_datas = value.split(',');

  if (file_count < 5) {
    for (let i = 0; i < value.split(',').length; i++) {
      // if (file_count >= 5)
      //   return alert('이미지는 최대 5개까지 첨부할 수 있어요');
      let imgBox = document.createElement('div');
      imgBox.classList.add('img-box');
      let div = document.createElement('div');
      let img = document.createElement('img');
      let button = document.createElement('button');
      div.classList.add('img');
      img.src = `http://localhost:${port}/${img_datas[i]}`;
      // img.src = URL.createObjectURL(input.files[i]);

      button.type = 'button';

      button.classList.add('img-cheking');
      button.appendChild(img);
      div.appendChild(button);
      imgBox.appendChild(div);
      postImg.appendChild(imgBox);
    }

    let file_counting = document.querySelectorAll('.img-box > .img').length;
    data.innerText = `${file_counting}/5`;

    const images = document.querySelectorAll('.img-box');

    images.forEach(image =>
      image.addEventListener('click', e => {
        image.remove();
        let file_counting = document.querySelectorAll('.img-box > .img').length;
        data.innerText = `${file_counting}/5`;
      }),
    );
  } else {
    alert('이미지는 최대 5개까지 첨부할 수 있어요');
  }

  // imgBox.onclick = () => {
  //   imgBox.parentNode.removeChild(imgBox);
  // };
}
