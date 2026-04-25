const WHATSAPP_NUMBER = '201005009908';

const products = [
  {
    id: 'brazil-sada',
    name: 'بن فراج برازيلي سادة',
    category: 'سادة',
    blendLabel: 'سادة',
    weight: '250 جم',
    price: 60,
    image: 'images/package-brazil-sada.svg'
  },
  {
    id: 'brazil-mhwg',
    name: 'بن فراج برازيلي محوج',
    category: 'محوج',
    blendLabel: 'محوج',
    weight: '250 جم',
    price: 60,
    image: 'images/package-brazil-mohawag.svg'
  },
  {
    id: 'extra-sada',
    name: 'بن فراج إكسترا سادة',
    category: 'سادة',
    blendLabel: 'سادة',
    weight: '250 جم',
    price: 55,
    offer: true,
    image: 'images/package-extra-sada.svg'
  },
  {
    id: 'turki-mhwg',
    name: 'بن فراج تركي محوج',
    category: 'تركي',
    blendLabel: 'محوج',
    weight: '250 جم',
    price: 50,
    image: 'images/package-turki-mohawag.svg'
  },
  {
    id: 'yemeni-sada',
    name: 'بن فراج يمني سادة',
    category: 'سادة',
    blendLabel: 'سادة',
    weight: '250 جم',
    price: 80,
    image: 'images/package-yemeni-sada.svg'
  },
  {
    id: 'espresso',
    name: 'بن فراج إسبريسو',
    category: 'إسبريسو',
    blendLabel: 'سادة',
    weight: '1000 جم',
    price: 300,
    image: 'images/package-espresso.svg'
  }
];

const reviews = [
  {
    name: 'سارة أحمد',
    text: 'البن التركي ممتاز وريحتُه قوية جدًا.. تجربة راقية فعلًا.',
    rating: '★★★★★'
  },
  {
    name: 'أحمد جمال',
    text: 'طلبت برازيلي محوج ووصل بسرعة والطعم ثابت كل مرة.',
    rating: '❤️❤️❤️❤️❤️'
  },
  {
    name: 'مريم خالد',
    text: 'الخدمة ممتازة والمنيو متنوع جدًا داخل الفرع.',
    rating: '★★★★★'
  }
];

const menuImages = ['images/menu-1.svg', 'images/menu-2.svg', 'images/menu-3.svg'];

const cart = new Map();
let activeFilter = 'الكل';
let menuIndex = 0;

const productGrid = document.getElementById('productGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const chips = document.querySelectorAll('.chip');
const cartCount = document.getElementById('cartCount');
const sendOrderBtn = document.getElementById('sendOrderBtn');
const reviewsGrid = document.getElementById('reviewsGrid');
const menuImage = document.getElementById('menuImage');
const menuPrev = document.getElementById('menuPrev');
const menuNext = document.getElementById('menuNext');
const zoomDialog = document.getElementById('zoomDialog');
const zoomedMenuImage = document.getElementById('zoomedMenuImage');
const closeZoom = document.getElementById('closeZoom');

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
          : product.category === activeFilter || product.blendLabel === activeFilter;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.blendLabel.toLowerCase().includes(searchTerm);

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
            <span class="badge blend">${product.blendLabel}</span>
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

function renderReviews() {
  reviewsGrid.innerHTML = reviews
    .map(
      (review) => `
      <article class="review-card reveal visible">
        <h3>${review.name}</h3>
        <p>${review.text}</p>
        <span class="rating">${review.rating}</span>
      </article>
    `
    )
    .join('');
}

function renderMenuImage() {
  menuImage.src = menuImages[menuIndex];
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

menuPrev.addEventListener('click', () => {
  menuIndex = (menuIndex - 1 + menuImages.length) % menuImages.length;
  renderMenuImage();
});

menuNext.addEventListener('click', () => {
  menuIndex = (menuIndex + 1) % menuImages.length;
  renderMenuImage();
});

menuImage.addEventListener('click', () => {
  zoomedMenuImage.src = menuImages[menuIndex];
  zoomDialog.showModal();
});

closeZoom.addEventListener('click', () => zoomDialog.close());

zoomDialog.addEventListener('click', (event) => {
  if (event.target === zoomDialog) {
    zoomDialog.close();
  }
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
renderReviews();
renderMenuImage();
updateCartUI();
