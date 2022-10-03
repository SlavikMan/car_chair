const ws = require('ws');
const { 
  login, 
  registration, 
  getCarSeats,
  searchCarSeats,
  getCarSeatsInfo,
  getSelected,
  addSelected,
  removeSelected,
  getReviews,
  addReview,
  getUserInfo,
  createOrder,
  getOrders,
  orderInfo,
  removeOrder
} = require('./database.js');


const port = process.env.PORT || 3000;
const wss = new ws.Server({
  port,
}, () => console.log(`Server started on ${port}\n`));

let users = {};

wss.on('connection', (ws) => {
  ws.onmessage = async req => {
    let resp = '';
    const data = JSON.parse(req.data);

    if(data.func === 'login') {
      resp = await login(data.login, data.password, users, ws);
    }
    if(data.func === 'registration') {
      resp = await registration(data.name, data.surname, data.login, data.password);
    }
    if(data.func === 'getCarSeats') {
      resp = await getCarSeats();
    }
    if(data.func === 'searchCarSeats') {
      resp = await searchCarSeats(data.search);
    }
    if(data.func === 'getCarSeatsInfo') {
      resp = await getCarSeatsInfo(data.login, data.id);
    }
    if(data.func === 'getSelected') {
      resp = await getSelected(data.login);
    }
    if(data.func === 'addSelected') {
      resp = await addSelected(data.login, data.id, data.name);
    }
    if(data.func === 'removeSelected') {
      resp = await removeSelected(data.login, data.id);
    }
    if(data.func === 'getReviews') {
      resp = await getReviews(data.id);
    }
    if(data.func === 'addReview') {
      resp = await addReview(data.id, data.name, data.review);
    }
    if(data.func === 'getUserInfo') {
      resp = await getUserInfo(data.login);
    }
    if(data.func === 'createOrder') {
      resp = await createOrder(data.login, data.name, data.price, data.phone);
    }
    if(data.func === 'getOrders') {
      resp = await getOrders(data.login);
    }
    if(data.func === 'orderInfo') {
      resp = await orderInfo(data.login, data.number);
    }
    if(data.func === 'removeOrder') {
      resp = await removeOrder(data.login, data.number);
    }

    console.log(output(data)); 
    console.log(`Respond:\n${resp}\n`);
    ws.send(resp);
  };

  ws.onclose = () => {
    const login = getLogin(users, ws);
    if(login) {
      delete users[login];
      console.log(`${login} is disconnected.\n`);
    }
  }
});

function output(data) {
  console.log('New request:');
  for(let key in data) {
    if(!data[key]) delete data[key]
  }
  return data;
}

function getLogin(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
