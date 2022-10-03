const { getData, setData, removeData } = require('./firebase');


async function login(login, password, users, ws) {
    if(Object.keys(users).includes(login)) return 'user_logined';
    let response = '';
    const data = await getData(`Users/${login}`);
    if(data) {
        if(data.password === password) {
            users[login] = ws;
            console.log(`${login} is connected.\n`);
            response = 'true';
        }
        else {
            response = 'wrong_password'
        }
    } 
    else {
      response = 'missing_login';
    }
    return response;
}
  
async function registration(name, surname, login, password) {
    let response = '';
    if(await getData(`Users/${login}`)) {
      response = 'login_exists';
    }
    else {
      let updates = {};
      updates[`Users/${login}`] = { 
        name: name[0].toUpperCase() + name.slice(1),
        surname: surname[0].toUpperCase() + surname.slice(1), 
        password 
    };
      await setData(updates);
      response = 'true';
    }
    return response;
}

async function getCarSeats() {
    let response = '';
    const data = await getData(`CarSeats`);
    for(let id in data) {
        const { name, price } = data[id];
        response += `${id}: ${name} - ${price}грн\n`;
    }
    return response.trim();
}

async function searchCarSeats(search) {
    let response = '';
    const data = await getData(`CarSeats`);
    for(let id in data) {
        const { name, price } = data[id];
        if(/^(\d){3}$/g.test(search)) {
            if(id.toString() === search) response += `${id}: ${name} - ${price}грн\n`;
        }
        else {
            if(name.toLowerCase().includes(search.toLowerCase())) response += `${id}: ${name} - ${price}грн\n`;
        }
    }
    return response.trim();
}

async function getCarSeatsInfo(login, id) {
    let response = '';
    const data = await getData(`CarSeats/${id}`);
    const { аge, fixation, security, construction, growth, image } = data;
    response += `Артикул: ${id}\n`;
    response += `Вікова група: ${аge}\n`;
    response += `Фіксація дитини: ${fixation}\n`;
    response += `Стандарт безпеки: ${security}\n`;
    response += `Особливості конструкції: ${construction}\n`;
    response += `Функція росту крісла: ${growth}\n\n`;
    response += `${image}\n\n`;
    const user = await getData(`Users/${login}/Selected`);
    const btn = Object.keys(user).includes(id);
    response += `${btn}`;
    return response;
}

async function getSelected(login) {
    let response = '';
    const data = await getData(`Users/${login}/Selected`) || {};
    for(let id in data) response += `${id}: ${data[id]}\n`;
    return response.trim();
}

async function addSelected(login, id, name) {
    let updates = {};
    updates[`Users/${login}/Selected/${id}`] = name;
    await setData(updates);
    return 'true';
}

async function removeSelected(login, id) {
    await removeData(`Users/${login}/Selected/${id}`);
    return 'true';
}

async function addReview(id, name, review) {
    let updates = {};
    const key = new Date().getTime();
    const date = formatDate(new Date());
    updates[`CarSeats/${id}/Reviews/${key}`] = { 
        date, 
        name: name[0].toUpperCase() + name.slice(1), 
        review 
    };
    await setData(updates);
    return 'true';
}

async function getReviews(id) {
    let response = '';
    const data = await getData(`CarSeats/${id}/Reviews`) || {};
    Object.values(data).reverse().forEach(item => {
        const { date, name, review } = item;
        response += `${date} - ${name}\n${review}\n\n`;
    });
    return response.trim();
}

async function getUserInfo(login) {
    const user = await getData(`Users/${login}`);
    const { name, surname } = user;
    return `${name}\n${surname}`;
}

async function createOrder(login, name, price, phone) {
    const number = Math.round(1000 - 0.5 + Math.random() * (9999 - 1000 + 1));
    const date = formatDate(new Date());
    let updates = {};
    updates[`Users/${login}/Orders/${number}`] = { name, price, phone, date };
    await setData(updates);
    return number;
}

async function getOrders(login) {
    let response = '';
    const orders = await getData(`Users/${login}/Orders`);
    Object.keys(orders).forEach(number => response += `Замовлення №${number}\n`);
    return response.trim();
}

async function orderInfo(login, number) {
    let response = '';
    const order = await getData(`Users/${login}/Orders/${number}`);
    const { name, price, phone, date } = order;
    response += `${name}\n`;
    response += `Ціна: ${price}\n`;
    response += `Номер телефону: ${phone}\n`;
    response += `Дата: ${date}`;
    return response;
}

async function removeOrder(login, number) {
    removeData(`Users/${login}/Orders/${number}`);
    return 'true';
}

function formatDate(date) {
    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    let yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;
    return dd + '.' + mm + '.' + yy;
}


module.exports = {
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
};
