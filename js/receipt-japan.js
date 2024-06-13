const originalTitle = document.getElementById('title').textContent;
const originalLeftSrc = document.getElementById('left').src;

document.getElementById('setting').addEventListener('click', function() {
    var menu = document.getElementById('setting-menu');
    if (menu.style.display === 'none') {
      menu.style.display = 'block';
    } else {
      menu.style.display = 'none';
      document.getElementById('title').textContent = originalTitle;
      document.getElementById('left').src = originalLeftSrc;
    }
});

document.getElementById('delete-receipt').addEventListener('click', function() {
    document.getElementById('title').textContent = '영수증 삭제';
    document.getElementById('left').src = '../img/x-black.png';
    document.getElementById('setting-menu').style.display = 'none';
});

document.getElementById('left').addEventListener('click', function(event) {
    if (document.getElementById('left').src.includes('x-black.png')) {
      event.preventDefault();
      document.getElementById('title').textContent = originalTitle;
      document.getElementById('left').src = originalLeftSrc;
    } else if (document.getElementById('left').src.includes('left.png')) {
      window.location.href = '../index.html';
    }
});

const menuItems = document.querySelectorAll('#setting-menu p');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
      document.getElementById('setting-menu').style.display = 'none';
    });
});