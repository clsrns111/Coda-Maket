const items = document.querySelectorAll('main .item');

items.forEach(item => {
  item.addEventListener('click', async () => {
    const category = item.querySelector('span').getAttribute('value');

    window.location = `posts/search?category=${category}`;
  });
});
