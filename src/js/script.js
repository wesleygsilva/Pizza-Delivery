let modalQtd = 1;
let modalKey = 0;
let cart = [];

const setPizzaCard = (pizzaItem, item, index) => {
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item-name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item-price').innerHTML = setPizzaPrice(index, 2);
    pizzaItem.querySelector('.pizza-item-desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item-img img').src = item.img;
};

const setPizzaSize = (key) => {
    document.querySelectorAll('.pizzaInfo-size').forEach((size, sizeIndex)=>{
        if (sizeIndex == 2) {
            size.classList.add('selected');
        }
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });
};

const returnKey = () => {
    return parseInt(document.querySelector('.pizzaInfo-size.selected').getAttribute('data-key'));
}

const setPizzaPrice = (index, key) => {
    return `R$ ${pizzaJson[index].prices[key]}`;
};

const setPizzaDataInfo = (key) => {
    document.querySelector('.pizzaInfo .pizzaInfo-desc').innerHTML = pizzaJson[key].description;
    document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    document.querySelector('.pizzaBig img').src = pizzaJson[key].img;
    document.querySelector('.pizzaInfo-price .pizzaInfo-actualPrice').innerHTML = setPizzaPrice(modalKey, 2);
    document.querySelector('.pizzaInfo-size.selected').classList.remove('selected');
    document.querySelector('.pizzaInfo-qt').innerHTML = modalQtd;

    setPizzaSize(key);
};

const transitionCard = () => {
    document.querySelector('.pizzaWindowArea').style.opacity = '0';
    document.querySelector('.pizzaWindowArea').style.display = 'flex';
    setTimeout(()=>{
        document.querySelector('.pizzaWindowArea').style.opacity = '1';
    }, 100);
};

const setPizzaData = (pizzaItem) => {
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQtd = 1;
        modalKey = key;

        setPizzaDataInfo(key);
        transitionCard();
    });
};

const getDate = (date) => {
    let strData = date;
    let splitData = strData.split("-");
    return new Date(splitData[0], splitData[1] - 1, splitData[2]);
};

const validateCupom = () => {
    let cupom = document.querySelector('[data-js="cupom"]').value;

    if (cupom != '') {
        document.querySelector('[data-js="cupom"]').setAttribute('readonly', 'false');
        document.querySelector('[data-js="apply-discount"]').setAttribute('readonly', 'false');

        let isValid = false;

        cupomJson.map((item) => {
            if (cupom.toUpperCase() == item.promocode.toUpperCase()) {
                let initialDate = getDate(item.initialDate)
                let finalDate = getDate(item.finalDate)
                
                if (initialDate > new Date()) {
                    return;
                } else if (finalDate < new Date()) {
                    return;     
                } else if (!item.isValid) {
                    return;  
                }else {
                    isValid = true; 
                    applyDiscount(item);

                }
            } 
        });

        if (!isValid) {
            alert('Cupom Inválido ou Expirado');   
        };   
    }
};

const applyDiscount = (item) => {
    let discontValue = document.querySelector('.discount span:last-child').innerHTML;
    discontValue = parseFloat(discontValue.substring(3, discontValue.length));

    if (discontValue == 0) {
        let total = document.querySelector('.total span:last-child').innerHTML;
        total = parseFloat(total.substring(3, total.length));

        let discount = 0;

        if (item.discounttype = 'percent') {
            discount = (total * (item.value / 100));
        } else { 
            discount =  item.value;
        }

        total = total - discount;

        document.querySelector('.discount span:last-child').innerHTML = `R$ ${discount.toFixed(2)}`;
        document.querySelector('.total span:last-child').innerHTML    = `R$ ${total.toFixed(2)}`;

        document.querySelector('[data-js="cupom"]').setAttribute('readonly', true);
        document.querySelector('[data-js="apply-discount"]').setAttribute('readonly', true);

    } else {
        alert('Cupom já aplicado')
    }
}

const clearCupom = () => {
    document.querySelector('[data-js="cupom"]').value = '';
    document.querySelector('[data-js="cupom"]').removeAttribute('readonly');
    document.querySelector('[data-js="apply-discount"]').removeAttribute('readonly');
}

document.querySelector('[data-js="apply-discount"]').addEventListener('click', () => {
    validateCupom();
});

const mapPizzaJson = () => {
    pizzaJson.sort(function (obj1, obj2) {
        return obj1.name < obj2.name ? -1 :
        (obj1.name > obj2.name ? 1 : 0);
        });

    pizzaJson.map((item, index) => {
        let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);

        setPizzaCard(pizzaItem, item, index);
        setPizzaData(pizzaItem);

        if (item.type == 'salty') {
            document.querySelector('.salty').append(pizzaItem);
        } else {
            document.querySelector('.sweet').append(pizzaItem);   
        }
    });
}

function closeModal() {
    document.querySelector('.pizzaWindowArea').style.opacity = '0';
    setTimeout(()=>{
        document.querySelector('.pizzaWindowArea').style.display = 'none';
    }, 500);       
}

document.querySelector('.menu-closer').addEventListener('click', () => {
    document.querySelector('aside').style.left = '100vw';
    document.querySelector('aside').classList.remove('show');
    clearCupom();
})

document.querySelectorAll('.pizzaInfo-cancelButton, .pizzaInfo-cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});


document.querySelector('.pizzaInfo-qtmais').addEventListener('click', () => {
    modalQtd++
    document.querySelector('.pizzaInfo-qt').innerHTML = modalQtd ; 
});

document.querySelector('.pizzaInfo-qtmenos').addEventListener('click', () => { 
    if (modalQtd > 1) {
        modalQtd--;
        document.querySelector('.pizzaInfo-qt').innerHTML = modalQtd ;
    }
});

document.querySelectorAll('.pizzaInfo-size').forEach((size)=>{
    size.addEventListener('click', () => {
        document.querySelector('.pizzaInfo-size.selected').classList.remove('selected');       
        size.classList.add('selected');  
        
        document.querySelector('.pizzaInfo-price .pizzaInfo-actualPrice').innerHTML = setPizzaPrice(modalKey, returnKey());
    });
});

document.querySelector('.pizzaInfo-addButton').addEventListener('click', ()=>{
    let size = parseInt(document.querySelector('.pizzaInfo-size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>{
        return item.identifier == identifier
    });

    if (key == -1) {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qtd: modalQtd
        })
    } else {
        cart[key].qtd += modalQtd;
    }

    updateCart();
    closeModal();
});

document.querySelector('.menu-openner').addEventListener('click', (e) => {
    document.querySelector('aside').style.left = 0;
    updateCart();
});

const showCart = () => {
    document.querySelector('aside').classList.add('show');
    document.querySelector('.cart').innerHTML = '';   
}; 

const hideCart = () => {
    document.querySelector('aside').classList.remove('show');
    document.querySelector('aside').style.left = '100vw';
};

const returnPizzaSize = (size) => {
    switch (size) {
        case 0: 
            return '(P)';
        case 1: 
            return '(M)';
        case 2: 
            return '(G)';
    }
};

const setCartItemValues = (index, pizzaItem) => {
    let cartItem = document.querySelector('.models .cart-item').cloneNode(true);

    cartItem.querySelector('img').src = pizzaItem.img;
    cartItem.querySelector('.cart-item-nome').innerHTML = `${pizzaItem.name} - ${returnPizzaSize(cart[index].size)}`;
    cartItem.querySelector('.cart-item-qt').innerHTML = cart[index].qtd;

    cartItem.querySelector('.cart-item-qtmais').addEventListener('click', () => {
        cart[index].qtd++ ; 
        updateCart();
    });

    cartItem.querySelector('.cart-item-qtmenos').addEventListener('click', () => {
        if (cart[index].qtd > 1) {
            cart[index].qtd-- ; 
        } else {
            cart.splice(index, 1);
        }

        updateCart();
    });

    document.querySelector('.cart').append(cartItem);
};

const updateTotal = (subTotal) => {
    let discount = 0;
    let total = subTotal - discount;

    document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
    document.querySelector('.discount span:last-child').innerHTML = `R$ ${discount.toFixed(2)}`;
    document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    discount = subTotal * 0.1;
    total = subTotal - discount;
}

function  updateCart() {
    document.querySelector('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        showCart();

        let subTotal = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>{
                return item.id == cart[i].id;
            });

            let key = parseInt(document.querySelector('.pizzaInfo-size.selected').getAttribute('data-key'));
            subTotal += pizzaItem.prices[key] * cart[i].qtd;

            setCartItemValues(i, pizzaItem); 
        } 

        updateTotal(subTotal);
    } else {
        hideCart();
    }
}

const init = () => {
    mapPizzaJson();
}

init();