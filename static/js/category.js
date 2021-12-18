const items = document.querySelectorAll('main .item');
const body = document.querySelector('body');

items.forEach(item => {
  item.addEventListener('click', () => {
    const category = item.querySelector('span').getAttribute('value');

    console.log(category);

    axios.post(`search/category/${category}`).then(res => {
      console.log(res);
      body.innerHTML += res.data.posts[0].content;
    });
  });
});
