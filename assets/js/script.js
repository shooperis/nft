const formElement = document.querySelector('#form');
const buttonSubmit = formElement.querySelector('button[type="submit"]')
const buttonGetMyIp = formElement.querySelector('button#get-my-ip-button');
const loadingElement = formElement.querySelector('#loading');
const mapElement = document.querySelector('#map');
const outputElement = formElement.querySelector('#output-wrapper');

function init() {
  buttonGetMyIp.addEventListener('click', async event => {
    event.preventDefault();
    buttonsDisabler('disable');
    await getMyIp(true);
    buttonsDisabler('enable');
  });

  formElement.querySelector('input').addEventListener('input', function(e) {
    if (!this.oldValue) {
      this.oldValue = 1;
    }

    if (/^\d*\.?\d*$/.test(this.value)) {
      this.oldValue = this.value;
    } else {
      this.classList.add('input-error');
      setTimeout(() => {
        this.classList.remove('input-error');
      }, '300')
      
      this.value = this.oldValue;
    }
  });

  formElement.addEventListener('submit', async event => {
    event.preventDefault();
    let thisForm = event.target;
    let ip = thisForm.ip.value;
    buttonsDisabler('disable');
    await resultToggler('hide');

    if (ip) {
      let ipInfo = await (await fetch(`https://ipinfo.io/${ip}/geo`)).json();
      // let ipInfo = {
      //   "ip": "88.119.144.43",
      //   "hostname": "serv.inmycase.lt",
      //   "city": "Vilnius",
      //   "region": "Vilnius",
      //   "country": "LT",
      //   "loc": "54.6892,25.2798",
      //   "org": "AS8764 Telia Lietuva, AB",
      //   "postal": "01001",
      //   "timezone": "Europe/Vilnius",
      //   "readme": "https://ipinfo.io/missingauth"
      //   };

      if (ipInfo.ip) {
        let outputHTML = `<div class="output">
                            <div class="box">
                              <div class="label">IP</div>
                              <div class="value">${ipInfo.ip}</div>
                            </div>
                            <div class="box">
                              <div class="label">Hostname</div>
                              <div class="value">${ipInfo.hostname}</div>
                            </div>
                            <div class="box">
                              <div class="label">Country</div>
                              <div class="value">${ipInfo.country}</div>
                            </div>
                            <div class="box">
                              <div class="label">City</div>
                              <div class="value">${ipInfo.city}</div>
                            </div>
                            <div class="box">
                              <div class="label">Postal code</div>
                              <div class="value">${ipInfo.postal}</div>
                            </div>
                            <div class="box">
                              <div class="label">Location</div>
                              <div class="value">${ipInfo.loc}</div>
                            </div>
                            <div class="box">
                              <div class="label">Timezone</div>
                              <div class="value">${ipInfo.timezone}</div>
                            </div>
                            <div class="box">
                              <div class="label">ISP</div>
                              <div class="value">${ipInfo.org}</div>
                            </div>
                          </div>
        `;
        outputElement.innerHTML = outputHTML;
        mapElement.src = `https://www.google.com/maps/embed/v1/place?q=${ipInfo.loc}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
      } else {
        showError('custom', ipInfo.error.message);
      }
    } else {
      showError('empty-input');
    }

    await resultToggler('show');
    buttonsDisabler('enable');
  });
}

async function getMyIp(bruteforce) {
  let yourIpIs = await (await fetch('https://api.ipify.org/?format=json')).json();
  if (bruteforce) {
    formElement.ip.value = yourIpIs.ip;
  } else {
    if (!formElement.ip.value) {
      formElement.ip.value = yourIpIs.ip;
    }
  }
}

function buttonsDisabler(action) {
  if (action == 'disable') {
    loadingElement.classList.remove('hidden');
  } else if (action == 'enable') {
    loadingElement.classList.add('hidden');
  }

  formElement.querySelectorAll('button').forEach(button => {
    if (action == 'disable') {
      button.setAttribute('disabled', true);
    } else if (action == 'enable') {
      button.removeAttribute('disabled');
    }
  });
}

function showError(error, customMsg) {
  let errorElement = document.createElement('div');
  errorElement.classList.add('output-error');
  if (error == 'empty-input') {
    errorElement.textContent = 'Please enter IP address';
  } else if (error == 'api-error') {
    errorElement.textContent = 'Can not get info from API';
  } else {
    if (customMsg) {
      errorElement.textContent = customMsg;
    } else {
      errorElement.textContent = 'Something went wrong';
    }
  }
  
  outputElement.append(errorElement);
}

async function resultToggler(action) {
  if (action == 'show') {
    await customTimeout(300);
    outputElement.classList.remove('hidden');
  } else if (action == 'hide') {
    outputElement.classList.add('hidden');
    await customTimeout(300);
    outputElement.innerHTML = '';
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