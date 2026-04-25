const WHATSAPP_NUMBER = '20100509908';

const products = [
  {
    id: 'brazil-sada',
    name: 'بن فراج برازيلي سادة',
    category: 'سادة',
    weight: '250 جم',
    price: 60,
    image:
      'https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'brazil-mhwg',
    name: 'بن فراج برازيلي محوج',
    category: 'محوج',
    weight: '250 جم',
    price: 60,
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'extra-sada',
    name: 'بن فراج إكسترا سادة',
    category: 'سادة',
    weight: '250 جم',
    price: 55,
    offer: true,
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'extra-mhwg',
    name: 'بن فراج إكسترا محوج',
    category: 'محوج',
    weight: '250 جم',
    price: 60,
    image:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'turki-sada',
    name: 'بن فراج تركي سادة',
    category: 'تركي',
    weight: '250 جم',
    price: 50,
    offer: true,
    image:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'turki-mhwg',
    name: 'بن فراج تركي محوج',
    category: 'تركي',
    weight: '250 جم',
    price: 50,
    image:
      'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'yemeni-sada',
    name: 'بن فراج يمني سادة',
    category: 'سادة',
    weight: '250 جم',
    price: 80,
    image:
      'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'yemeni-mhwg',
    name: 'بن فراج يمني محوج',
    category: 'محوج',
    weight: '250 جم',
    price: 85,
    image:
      'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'espresso',
    name: 'بن فراج إسبريسو',
    category: 'إسبريسو',
    weight: '1000 جم',
    price: 300,
    image:
      'https://images.unsplash.com/photo-1461988625982-7e46a099bf4f?auto=format&fit=crop&w=900&q=80'
  }
];

const cart = new Map();
let activeFilter = 'الكل';

const productGrid = document.getElementById('productGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const chips = document.querySelectorAll('.chip');
const cartCount = document.getElementById('cartCount');
const sendOrderBtn = document.getElementById('sendOrderBtn');

function formatPrice(value) {
  return `${value} ج.م`;
}

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesFilter =
      activeFilter === 'الكل'
        ? true
        : activeFilter === 'عروض'
          ? Boolean(product.offer)
          : product.category === activeFilter;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  productGrid.innerHTML = filtered
    .map(
      (product) => `
      <article class="product-card reveal visible">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="product-content">
          <h3 class="product-title">${product.name}</h3>
          <div class="product-meta">
            <span class="badge">${product.category}</span>
            <span class="badge">${product.weight}</span>
            ${product.offer ? '<span class="badge">عرض</span>' : ''}
          </div>
          <p class="price">${formatPrice(product.price)}</p>
          <button class="btn btn-primary btn-block" type="button" data-add="${product.id}">أضف للطلب</button>
        </div>
      </article>
    `
    )
    .join('');

  emptyState.hidden = filtered.length > 0;
}

function updateCartUI() {
  const totalItems = Array.from(cart.values()).reduce((sum, qty) => sum + qty, 0);
  cartCount.textContent = String(totalItems);
  sendOrderBtn.disabled = totalItems === 0;
}

function addToCart(productId) {
  const current = cart.get(productId) || 0;
  cart.set(productId, current + 1);
  updateCartUI();
}

function buildWhatsAppMessage() {
  const selected = products.filter((p) => cart.has(p.id));
  const lines = ['السلام عليكم، حابب أطلب من بن فراج:', ''];
  let total = 0;

  selected.forEach((product, index) => {
    const qty = cart.get(product.id);
    const lineTotal = product.price * qty;
    total += lineTotal;
    lines.push(
      `${index + 1}) ${product.name} - ${product.weight} - ${formatPrice(product.price)} × ${qty} = ${formatPrice(lineTotal)}`
    );
  });

  lines.push('', `الإجمالي: ${formatPrice(total)}`);
  return lines.join('\n');
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter || 'الكل';
    renderProducts();
  });
});

searchInput.addEventListener('input', renderProducts);


const menuTabs = document.querySelectorAll('.menu-tab');
menuTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    menuTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

productGrid.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const productId = target.dataset.add;
  if (!productId) {
    return;
  }

  addToCart(productId);
});

sendOrderBtn.addEventListener('click', () => {
  const message = buildWhatsAppMessage();
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
});

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

renderProducts();
updateCartUI();
