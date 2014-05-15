var toggleEmojiBookmarklet = function () {
  //var SERVER_URL = 'http://localhost:8000';
  var SERVER_URL = 'http://johannhof.github.io/emoji-helper/bookmarklet/';

  var container = document.createElement('div');
  var frame = document.createElement('iframe');
  frame.src = SERVER_URL;

  frame.style.height = '350px';
  frame.style.width = '510px';
  frame.style.border = '1px solid lightgray';

  container.style.height = '350px';
  container.style.width = '510px';
  container.style.boxShadow = '2px 2px 10px black';
  container.style.position = 'fixed';
  container.style.left = 'calc(50% - 255px)';
  container.style.top = '10%';


  var closeButton = document.createElement('button');
  closeButton.style.position = 'absolute';
  closeButton.style.height = '30px';
  closeButton.style.width = '30px';
  closeButton.style.right = '-15px';
  closeButton.style.top = '-15px';
  closeButton.style.border = '5px solid white';
  closeButton.style.borderRadius = '20px';
  closeButton.style.backgroundColor = 'white';
  closeButton.style.boxShadow = '0px 0px 1px black';
  closeButton.style.backgroundImage = 'url(' + SERVER_URL + '/img/emoji/heavy_multiplication_x.png)';
  closeButton.style.backgroundRepeat = 'no-repeat';
  closeButton.style.backgroundPosition = 'center';
  closeButton.style.backgroundSize = 'contain';
  closeButton.style.cursor = 'pointer';

  closeButton.onclick = function () {
    container.parentNode.removeChild(container);
  };


  container.appendChild(closeButton);
  container.appendChild(frame);
  document.body.appendChild(container);
};

toggleEmojiBookmarklet();
