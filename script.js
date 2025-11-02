document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.1 });
  animatedElements.forEach((el, i) => {
    el.style.setProperty('--animation-order', i % 4);
    observer.observe(el);
  });

  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const el = document.querySelector(anchor.getAttribute('href'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const nav = document.querySelector('nav');
  const setNavStyle = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  setNavStyle();
  window.addEventListener('scroll', setNavStyle, { passive: true });

  const showToast = msg => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 2000);
  };

  function recalcBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    const count = JSON.parse(localStorage.getItem('cart') || '[]').length;
    if (cartBadge) cartBadge.textContent = count > 0 ? count : '';
  }

  const menuContainer = document.querySelector('.menu-container');
  const cartList = document.querySelector('.cart-list');
  const cartCount = document.querySelector('.cart-count');
  const cartTotal = document.querySelector('.cart-total');
  const cartEmpty = document.querySelector('.cart-empty');
  const cartClear = document.querySelector('.cart-clear');
  const cartToggle = document.getElementById('cart-toggle');
  const cartPanel = document.getElementById('cart-panel');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cart = {};

  cartToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = cartPanel.classList.contains('open');
    cartPanel.classList.toggle('open');
    cartToggle.setAttribute('aria-expanded', !isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!cartPanel.contains(e.target) && !cartToggle.contains(e.target)) {
      cartPanel.classList.remove('open');
      cartToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cartPanel.classList.remove('open');
      cartToggle.setAttribute('aria-expanded', 'false');
    }
  });

  fetch('menu.json')
  .then(response => response.json())
  .then(data => {
    displayMenu(data); 

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter.toLowerCase();
        console.log("Filter clicked:", filter);

        const filteredItems =
          filter === 'all'
            ? data
            : data.filter(item => item.category.toLowerCase() === filter);

        console.log("Filtered items count:", filteredItems.length);

        displayMenu(filteredItems);

        if (filteredItems.length === 0) {
          document.querySelector('.menu-container').innerHTML =
            '<p class="no-results">No items found in this category.</p>';
        }
      });
    });
  })
  .catch(err => console.error('Error loading menu.json:', err));


  function displayMenu(items) {
    menuContainer.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('menu-item');
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="menu-item-img">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="menu-item-footer">
          <span class="price">₹${item.price.toFixed(2)}</span>
          <div class="cart-controls">
            <button class="add-to-cart-btn">+</button>
          </div>
        </div>
      `;
      menuContainer.appendChild(div);
      const cartControls = div.querySelector('.cart-controls');
      const addBtn = div.querySelector('.add-to-cart-btn');
      addBtn.addEventListener('click', () => {
        addToCart(item);
        updateCartControls(cartControls, item);
        showToast(`${item.name} added to cart ✔`);
      });
    });
  }
function updateCartControls(container, item) {
    const current = cart[item.name] ? cart[item.name].quantity : 0;
    if (current <= 0) {
      delete cart[item.name];
      container.innerHTML = `<button class="add-to-cart-btn">+</button>`;
      const addBtn = container.querySelector('.add-to-cart-btn');
      addBtn.addEventListener('click', () => {
        addToCart(item);
        updateCartControls(container, item);
      });
      updateCartDisplay();
      return;
    }

    container.innerHTML = `
      <div class="qty-controls">
        <button class="decrease">-</button>
        <span class="qty">${current}</span>
        <button class="increase">+</button>
      </div>
    `;

    container.querySelector('.decrease').addEventListener('click', () => {
      cart[item.name].quantity--;
      if (cart[item.name].quantity <= 0) delete cart[item.name];
      updateCartControls(container, item);
      updateCartDisplay();
    });

    container.querySelector('.increase').addEventListener('click', () => {
      cart[item.name].quantity++;
      updateCartControls(container, item);
      updateCartDisplay();
    });
  }
  function addToCart(item) {
    if (!cart[item.name]) cart[item.name] = { ...item, quantity: 1 };
    else cart[item.name].quantity++;
    updateCartDisplay();
  }

  function updateCartDisplay() {
    cartList.innerHTML = '';
    const items = Object.values(cart);
    if (items.length === 0) {
      cartEmpty.style.display = 'block';
      cartTotal.textContent = 'Total: ₹0.00';
      cartCount.textContent = '0';
      return;
    }

    cartEmpty.style.display = 'none';
    let total = 0, count = 0;

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-thumb" />
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-qty">× ${item.quantity}</span>
        <span class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
      `;
      cartList.appendChild(li);
      total += item.price * item.quantity;
      count += item.quantity;
    });

    cartCount.textContent = count;
    cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
  }

  cartClear.addEventListener('click', () => {
    for (const key in cart) delete cart[key];
    document.querySelectorAll('.cart-controls').forEach(ctrl => {
      ctrl.innerHTML = `<button class="add-to-cart-btn">+</button>`;
    });
    updateCartDisplay();
  });

  recalcBadge();
});
