const imgElement = document.querySelector('#image');

const flipElement = document.querySelector('.flip-card');
const loaderElement  = document.querySelector('#loader');

const nameElement = document.querySelector('#name');
const idElement = document.querySelector('#item-id');
const linkElement = document.querySelector('#link');
const nextNftElement = document.querySelector('#next-nft');
let dataArray;

async function init() {
  let data = await (await fetch('https://api.opensea.io/api/v1/assets?format=json')).json();
  let dataArray = data.assets;
  renderItem(dataArray);

  loaderElement.classList.toggle('active');
  autoChange(dataArray);

  nextNftElement.addEventListener('click', async event => {
    renderItem(dataArray);
  });
}

async function renderItem(dataArray) {
  await resultToggler('hide');
  let randomItem = dataArray[Math.floor(Math.random() * dataArray.length)];

  if (!randomItem.image_url) {
    renderItem(dataArray);
  } else {
    imgElement.src = randomItem.image_url;
    imgElement.alt = randomItem.name;
    nameElement.textContent = randomItem.creator.user.username ? `${randomItem.creator.user.username} | ${randomItem.name}` : randomItem.name;
    idElement.textContent = '#' + randomItem.id;
    linkElement.href = randomItem.permalink;
    await resultToggler('show');
  }
}

function autoChange(dataArray) {
  setTimeout(() => {
    loaderElement.classList.toggle('active');
    renderItem(dataArray);
    autoChange(dataArray);
  }, 5000);
}


async function resultToggler(action) {
  if (action == 'show') {
    await customTimeout(300);
    flipElement.classList.remove('animate');
  } else if (action == 'hide') {
    flipElement.classList.add('animate');
    await customTimeout(300);
  }
}

function customTimeout(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

init();