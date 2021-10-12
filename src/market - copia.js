// Variables
var baseURL = 'http://localhost',
    web3, metamaskAccounts = [], myAccount, isConnected,
    lastURL, actURL, navText, navImg,
    dropdownButton, dropdownMenu, dropdownImg,
    divLogin, divAccount, logoHead;
    
// Variables de contrato y metamask
const Web3 = require('web3');
var pvuContract,
    toAddress = '0x3E72047E154cF7D1157A1bF9439AE14772f6Ef34',
    pvuAddressContract = '0x31471E0791fCdbE82fbF4C44943255e923F1b794',
    pvuAbi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getBurnedAmountTotal","outputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_receiver","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_receiver","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

// Funciones
function displayAlert(title, msg) {

  let divAlert = document.getElementById('snackbar'),
      alertTitle = document.getElementById('alertTitle'),
      alertMsg = document.getElementById('alertMsg'),
      imgCloseAlert = document.getElementById('imgCloseAlert');

  function closeAlert() {
    divAlert.classList.remove('show');
  }

  // Mostramos la alerta
  divAlert.classList.add('show');
  alertTitle.innerText = title;
  alertMsg.innerText = msg;

  // Eliminamos la alerta después de 5 segundos
  setTimeout( () => { closeAlert(); } , 5000)
  imgCloseAlert.onclick = closeAlert;
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

function loginEvents() {
    let connectButton = document.getElementById('metamask-button');

    const metamask_connect = async () => {
        if (window.ethereum) {
          web3 = new Web3(window.ethereum);
    
          const networkId = await web3.eth.net.getId();
          if (networkId != 56) {
            displayAlert('Error', 'Select BSC Network.');
            return
          }
    
          try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            metamaskAccounts = await web3.eth.getAccounts();
            myAccount = metamaskAccounts[0];
            let signRandom = (Math.random() * (90000000 - 40000000) + 90000000).toFixed();
            await web3.eth.personal.sign(web3.utils.utf8ToHex("PVU plantvsundead.com signing: " + signRandom), myAccount, signRandom)

            isConnected = (metamaskAccounts.length != 0);
            view_inventory();
          } catch (err) {
            displayAlert('Error', 'User rejected the request.');
          }
        } else {
          displayAlert('Error', 'MetaMask is required.');
        }
    };

    if (connectButton) connectButton.onclick = metamask_connect;
}

function checkNavBar(url) {

  function setNavOff() {
    if (navText) {
      for(let i=0; i <= navText.length-1; i++){
          navText[i].classList.remove('nuxt-link-exact-active');
          navText[i].classList.remove('nuxt-link-active');
      }
    }
  
    if (navImg[0]) navImg[0].src = 'img/dashboard-inactive.svg';
    if (navImg[1]) navImg[1].src = 'img/market-inactive.svg';
    if (navImg[2]) navImg[2].src = 'img/farm-inactive.svg';
    if (navImg[3]) navImg[3].src = 'img/offering-inactive.svg';
  }

  function setNavOn(obj) {
    obj.classList.add('nuxt-link-exact-active');
    obj.classList.add('nuxt-link-active');
  }

  // Apagamos toda la barra de navegación
  setNavOff();

  // A partir de acá, verificamos a qué le vamos a asginar los nuevos estilos.  
  switch (url) {
    case '/#/':
      setNavOn(navText[0]);
      if (navImg[0]) navImg[0].src = 'img/dashboard-active.svg';
      break;
    
    case '/#/marketplace/plant':
      setNavOn(navText[1]);
      if (navImg[1]) navImg[1].src = 'img/market-active.svg';
      break;

    case '/#/farm':
      setNavOn(navText[2]);
      if (navImg[2]) navImg[2].src = 'img/farm-active.svg';
      break;

    case '/#/offering/bundle':
      setNavOn(navText[3]);
      if (navImg[3]) navImg[3].src = 'img/offering-active.svg';
      break;
  }
}

async function loadView(src, newUrl) {
    let res = await fetch(baseURL + src),
    htmlCode = await res.text();
    const content = document.getElementById('content');
    content.innerHTML = htmlCode;
    history.pushState('', '', newUrl);
    checkNavBar(newUrl);
}

async function view_login () {
    // Cargamos la vista login
    await loadView('/login-ajax', '/#/login');
    loginEvents();
}

async function view_dashboard () {
  // Cargamos la vista dashboard
  await loadView('/dashboard-ajax', '/#/');
}

async function view_offering (typeView) {
  await loadView('/offering/' + typeView, '/#/offering/' + typeView);
}

async function view_maintenance () {
  // Cargamos la vista dashboard
  await loadView('/maintenance-ajax', '/' + document.location.hash);
}

async function view_marketplace (typeView) {
  await loadView('/marketplace/' + typeView, '/#/marketplace/' + typeView);
}

function setUserAddress() { 
   // Address
   let miniAddress = (myAccount.substring(0, 4) + '...' + myAccount.substring((myAccount.length - 5), myAccount.length)).toLowerCase(),
   textAddress = [
     document.getElementById('MyAddressMain'),
     document.getElementById('MyAddressInventory'),
     document.getElementById('MyAddressHead'),
     document.getElementById('MyAddressLarge'),
   ];

  if (textAddress[0]) textAddress[0].innerText = miniAddress;
  if (textAddress[1]) textAddress[1].innerText = '(' + miniAddress + ')';
  if (textAddress[2]) textAddress[2].innerText = '(' + miniAddress + ')';
  if (textAddress[3]) textAddress[3].innerText = (myAccount.substring(0, 6) + '...' + myAccount.substring((myAccount.length - 13), myAccount.length)).toLowerCase();
}

async function view_inventory() {
    // Cargamos la vista
    await loadView('/inventory-ajax', '/#/profile/inventory');

    // Eventos - mostramos cantidad de tokens
    pvuContract = new web3.eth.Contract(pvuAbi, pvuAddressContract, {from: myAccount});

    async function getPVUBalance() {
      let balance = await pvuContract.methods.balanceOf(myAccount).call();
      return balance;
    }

    // Balance PVU
    getPVUBalance().then(function (result) {
        let cantPVU = (result / 1000000000000000000).toFixed(2),
            pvuInput = document.getElementById('pvu__value');
        pvuInput.innerText = cantPVU;
    });

    // Balance BNB
    web3.eth.getBalance(myAccount)
      .then(function (result) {
          let cantBNB = (result / 1000000000000000000),
              bnbInput = document.getElementById('bnb__value');
          bnbInput.innerText = cantBNB.toFixed(9);
      });
    
    setUserAddress();
}

function displayMenu() {
  let menuEnabled = divDesplegado.classList.contains('active');

    if (!menuEnabled) {
      dropdownMenu.classList.add('active');
      dropdownImg.classList.add('rotate');
    } else {
      dropdownMenu.classList.remove('active');
      dropdownImg.classList.remove('rotate')
    }
}

function showHeaderInfo() {

  // Elementos del header
  divLogin = document.getElementById('divLogin');
  divAccount = document.getElementById('divAccount');
  logoHead = document.getElementById('logoHead');

  // Si no está conectado le mostramos el botón login.
  if (isConnected) {
    divAccount.style.display = 'block';
    divLogin.style.display = 'none';
    setUserAddress();

    // Elementos y eventos de la barra desplegable
    dropdownButton = document.getElementById('divDesplegable');
    dropdownMenu = document.getElementById('divDesplegado');
    dropdownImg = document.getElementById('imgRotation');
    dropdownButton.onclick = displayMenu;

  } else {
    divAccount.style.display = 'none';
    divLogin.style.display = 'block';

    // Botón login
    divLogin.onclick = function () {
      history.pushState('', '', '/#/login');
    }
  }

  // Damos funcionamiento al click del logo
  logoHead.onclick = view_dashboard;
}


window.onload = () => {

    function redirectPage(url) {
      switch (url) {
          case '#/login':
          isConnected ? view_dashboard() : view_login();
          break;

         case '#/profile/inventory':
          isConnected ? view_inventory() : view_login();
           break;

         case '#/':
            view_dashboard();
            break;
          
         case '#/offering/bundle':
            view_offering('bundle');
            break;

         case '#/offering/lands':
            view_offering('lands');
            break;

         case '#/offering/re-claim':
            view_offering('re-claim');
            break;
            
         case '#/offering/seeds':
            view_offering('seeds');
            break;

         case '#/farm':
            view_maintenance();
            break;

         case '#/marketplace/plant':
            view_marketplace('plant');
            break;

         case '#/marketplace/mother-tree':
            view_marketplace('mother-tree');
            break;

         case '#/marketplace/lands':
            view_marketplace('lands');
            break;
            
         default:
            view_dashboard();
            break;
       };

       showHeaderInfo();
    }
    
    function checkURL() {
        actURL = document.location.hash;
        if (actURL != lastURL) {
          redirectPage(actURL);
          lastURL = document.location.hash;
        }
    }

    function checkPathname(url) {
      switch (url) {
        case '/':
          if (!document.location.hash) { history.pushState('', '', '/#/') };
          break;

        case '/login':
          history.pushState('', '', '/#/login');
          break;
      }
    }

    // Listeners
    navText = [document.getElementById('navDashboard'),
            document.getElementById('navMarket'),
            document.getElementById('navFarm'),
            document.getElementById('navOffering'),
          ];

    navImg = [document.getElementById('imgDashboard'),
            document.getElementById('imgMarket'),
            document.getElementById('imgFarm'),
            document.getElementById('imgOffering'),
          ];

    checkConnection().then(function(result) {
      isConnected = result;
    });

    // Chequeos de URL
    setInterval(checkURL, 50);
    checkPathname(document.location.pathname);

    // Seteamos un evento para corroborar si el menu dropdown está activo
    document.addEventListener("click", function(e){
      var clic = e.target;
      let menuEnabled = divDesplegado.classList.contains('active');
      if (menuEnabled && (clic != dropdownButton) && (clic != document.getElementById('MyAddressMain')) && (clic != dropdownImg)) {
        dropdownMenu.classList.remove('active');
        dropdownImg.classList.remove('rotate')
      }
    }, false);

    // Seteamos un evento para corroborar que no se desconecte o cambie de cuenta dentro de la web
    window.ethereum.on('accountsChanged', function (accounts) {
      if (accounts.length == 0) {
        isConnected = false;
        view_login();
      } else {
        myAccount = accounts[0];
        lastURL = '/';
      }
    })
};

//View wallet address on bscscan
let open = document.getElementById("newTab");
open.onclick = newTab

function newTab() { 
  window.open( 
    "https://bscscan.com/address/" + myAccount, "_blank");
}

//Copy wallet address to clipboard
function copyWallet() {
let copyAddres = document.getElementById("walletAddress");
copyAdress.onclick = walletAddress

copyAddress.select();
copyAddress.setSelectionRange(0, 99999);

navigator.clipboard.writeText(copyAddress.value);
}