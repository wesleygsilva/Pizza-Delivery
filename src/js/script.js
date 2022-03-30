let modalQtd = 1;
let modalKey = 0;
let cart = [];

const c  = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item-name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item-price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item-desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item-img img').src = item.img;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQtd = 1;
        modalKey = key;

        c('.pizzaInfo .pizzaInfo-desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo-price .pizzaInfo-actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo-size.selected').classList.remove('selected');
        cs('.pizzaInfo-size').forEach((size, sizeIndex)=>{
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })
        c('.pizzaInfo-qt').innerHTML = modalQtd;

        c('.pizzaWindowArea').style.opacity = '0';
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = '1';
        }, 100);
    });

    //preencher as informações do pizza item
    c('.pizza-area').append(pizzaItem);
});

//Eventos do modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = '0';
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);       
}

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
})

cs('.pizzaInfo-cancelButton, .pizzaInfo-cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});


c('.pizzaInfo-qtmais').addEventListener('click', () => {
    modalQtd++
    c('.pizzaInfo-qt').innerHTML = modalQtd ; 
});

c('.pizzaInfo-qtmenos').addEventListener('click', () => { 
    if (modalQtd > 1) {
        modalQtd--;
        c('.pizzaInfo-qt').innerHTML = modalQtd ;
    }
});

cs('.pizzaInfo-size').forEach((size)=>{
    size.addEventListener('click', () => {
        c('.pizzaInfo-size.selected').classList.remove('selected');       
        size.classList.add('selected');      
    })
});

c('.pizzaInfo-addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo-size.selected').getAttribute('data-key'));

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

c('.menu-openner').addEventListener('click', (e) => {
    c('aside').style.left = 0;
    updateCart();
});

function  updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subTotal = 0;
        let desconto = 0;
        let total    = 0

        for (let i in cart) {

            let pizzaItem = pizzaJson.find((item)=>{
                return item.id == cart[i].id;
            });

            subTotal += pizzaItem.price * cart[i].qtd;

            let cartItem = c('.models .cart-item').cloneNode(true);

            let pizzaSizeName;

            switch (cart[i].size) {
                case 0: 
                    pizzaSizeName = 'P';
                    break;
                case 1: 
                    pizzaSizeName = 'M';
                    break;
                case 2: 
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} - ${pizzaSizeName}` ;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart-item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart-item-qt').innerHTML = cart[i].qtd;
            
            cartItem.querySelector('.cart-item-qtmais').addEventListener('click', () => {
                cart[i].qtd++ ; 
                updateCart();
            });

            cartItem.querySelector('.cart-item-qtmenos').addEventListener('click', () => {
                if (cart[i].qtd > 1) {
                    cart[i].qtd-- ; 
                } else {
                    cart.splice(i, 1);
                }

                updateCart();
            });

            c('.cart').append(cartItem);

        } 

        desconto = subTotal * 0.1;

        total = subTotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}
