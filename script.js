const WHATSAPP_NUMBER = '201005009908';

const products = [
  {
    id: 'brazil-sada',
    name: 'بن فراج برازيلي سادة',
    category: 'سادة',
    blendLabel: 'خفيف',
    weight: '250 جم',
    price: 60,
    image: 'product-sada.jpeg'
  },
  {
    id: 'brazil-mhwg',
    name: 'بن فراج برازيلي محوج',
    category: 'محوج',
    blendLabel: 'متوازن',
    weight: '250 جم',
    price: 60,
    image: 'product-mahmoog.jpeg'
  },
  {
    id: 'extra-sada',
    name: 'بن فراج إكسترا سادة',
    category: 'سادة',
    blendLabel: 'ناعم',
    weight: '250 جم',
    price: 55,
    offer: true,
    image: 'product-sada.jpeg'
  },
  {
    id: 'turki-mhwg',
    name: 'بن فراج تركي محوج',
    category: 'تركي',
    blendLabel: 'قوي',
    weight: '250 جم',
    price: 50,
    image: 'product-mahmoog.jpeg'
  },
  {
    id: 'yemeni-sada',
    name: 'بن فراج يمني سادة',
    category: 'سادة',
    blendLabel: 'فاخر',
    weight: '250 جم',
    price: 80,
    image: 'product-sada.jpeg'
  },
  {
    id: 'espresso',
    name: 'بن فراج إسبريسو',
    category: 'إسبريسو',
    blendLabel: 'مركز',
    weight: '1000 جم',
    price: 300,
    image: 'product-sada.jpeg'
  }
];

const reviews = [
  { name: 'عميل من الزمالك', text: 'رائحة التحميص ممتازة والطعم ثابت كل مرة.', rating: '★★★★★' },
  { name: 'عميلة من مدينة نصر', text: 'الإسبريسو غني جدًا ومناسب للمكنة المنزلية.', rating: '★★★★★' },
  { name: 'عميل من المعادي', text: 'طلبت محوج والطعم كان متوازن بجد.', rating: '★★★★★' },
  { name: 'عميلة من أكتوبر', text: 'التغليف شيك والتوصيل أسرع من المتوقع.', rating: '★★★★☆' },
  { name: 'عميل من شبرا', text: 'السادة نضيف جدًا ومناسب للقهوة العربي.', rating: '★★★★★' },
  { name: 'عميلة من الهرم', text: 'خدمة محترمة ومتابعة جيدة بعد الطلب.', rating: '★★★★★' },
  { name: 'عميل من فيصل', text: 'طعم الإكسترا ممتاز وسعره مناسب جدًا.', rating: '★★★★☆' },
  { name: 'عميلة من التجمع', text: 'أجمل شيء ثبات الجودة بين الطلبات.', rating: '★★★★★' },
  { name: 'عميل من طنطا', text: 'وصلني البن طازة والفارق واضح في النكهة.', rating: '★★★★★' },
  { name: 'عميلة من الإسكندرية', text: 'منتج نظيف ومناسب للضيافة اليومية.', rating: '★★★★★' },
  { name: 'عميل من المنصورة', text: 'المحوج قوي من غير مرارة زيادة.', rating: '★★★★☆' },
  { name: 'عميلة من السويس', text: 'تجربة شراء سهلة ومريحة جدًا على واتساب.', rating: '★★★★★' }
];

const menuImages = ['menu-1.jpeg', 'menu-2.jpeg', 'menu-3.jpeg'];

const cart = new Map();
const selectedQty = new Map(products.map((product) => [product.id, 1]));
let activeFilter = 'الكل';
let menuIndex = 0;

const productGrid = document.getElementById('productGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const chips = document.querySelectorAll('.chip');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const orderEmpty = document.getElementById('orderEmpty');
const orderBarContent = document.getElementById('orderBarContent');
const reviewsGrid = document.getElementById('reviewsGrid');
const menuImage = document.getElementById('menuImage');
const menuPrev = document.getElementById('menuPrev');
const menuNext = document.getElementById('menuNext');
const zoomDialog = document.getElementById('zoomDialog');
const zoomedMenuImage = document.getElementById('zoomedMenuImage');
const closeZoom = document.getElementById('closeZoom');
const orderDialog = document.getElementById('orderDialog');
const closeOrderDialog = document.getElementById('closeOrderDialog');
const orderSummaryList = document.getElementById('orderSummaryList');
const orderModalTotal = document.getElementById('orderModalTotal');
const customerName = document.getElementById('customerName');
const customerPhone = document.getElementById('customerPhone');
const orderNotes = document.getElementById('orderNotes');
const sendOrderBtn = document.getElementById('sendOrderBtn');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');

function formatPrice(value) {
  return `${value} ج.م`;
}

function getCartTotals() {
  const totals = { items: 0, amount: 0 };

  for (const [id, qty] of cart.entries()) {
    const product = products.find((item) => item.id === id);
    if (!product) {
      continue;
    }

    totals.items += qty;
    totals.amount += qty * product.price;
  }

  return totals;
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
    .map((product) => {
      const qty = selectedQty.get(product.id) || 1;

      return `
      <article class="product-card reveal visible">
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="product-content">
          <h3 class="product-title">${product.name}</h3>
          <div class="product-meta">
            <span class="badge">${product.category}</span>
            <span class="badge blend">${product.blendLabel}</span>
            <span class="badge">${product.weight}</span>
            ${product.offer ? '<span class="badge">عرض</span>' : ''}
          </div>
          <p class="price">${formatPrice(product.price)}</p>
          <div class="product-footer">
            <div class="qty-control" aria-label="اختيار الكمية">
              <button class="qty-btn" type="button" data-action="decrease" data-product-id="${product.id}" aria-label="تقليل الكمية">-</button>
              <span class="qty-value" data-qty-value="${product.id}">${qty}</span>
              <button class="qty-btn" type="button" data-action="increase" data-product-id="${product.id}" aria-label="زيادة الكمية">+</button>
            </div>
            <button class="btn btn-primary btn-add" type="button" data-add="${product.id}">أضف للسلة</button>
          </div>
        </div>
      </article>
    `;
    })
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
  const totals = getCartTotals();
  cartCount.textContent = String(totals.items);
  cartTotal.textContent = formatPrice(totals.amount);

  const hasItems = totals.items > 0;
  orderEmpty.hidden = hasItems;
  orderBarContent.hidden = !hasItems;
  checkoutBtn.disabled = !hasItems;
}

function addToCart(productId) {
  const qty = selectedQty.get(productId) || 1;
  const current = cart.get(productId) || 0;
  cart.set(productId, current + qty);
  updateCartUI();
}

function updateSelectedQty(productId, delta) {
  const current = selectedQty.get(productId) || 1;
  const next = Math.max(1, current + delta);
  selectedQty.set(productId, next);

  const qtyValue = productGrid.querySelector(`[data-qty-value="${productId}"]`);
  if (qtyValue) {
    qtyValue.textContent = String(next);
  }
}

function buildWhatsAppMessage() {
  const selectedProducts = products.filter((product) => cart.has(product.id));
  const lines = ['السلام عليكم، هذا طلبي من بن فراج:', ''];
  let total = 0;

  selectedProducts.forEach((product, index) => {
    const qty = cart.get(product.id) || 0;
    const subTotal = product.price * qty;
    total += subTotal;

    lines.push(`${index + 1}) ${product.name}`);
    lines.push(`الكمية: ${qty} | السعر: ${formatPrice(product.price)} | الإجمالي الفرعي: ${formatPrice(subTotal)}`);
    lines.push('');
  });

  lines.push(`الإجمالي النهائي: ${formatPrice(total)}`);
  lines.push(`الاسم: ${customerName.value.trim() || 'غير مذكور'}`);
  lines.push(`رقم الهاتف: ${customerPhone.value.trim() || 'غير مذكور'}`);
  lines.push(`الملاحظات: ${orderNotes.value.trim() || 'لا يوجد'}`);

  return lines.join('\n');
}

function renderOrderDialog() {
  const selectedProducts = products.filter((product) => cart.has(product.id));

  orderSummaryList.innerHTML = selectedProducts
    .map((product) => {
      const qty = cart.get(product.id) || 0;
      const subTotal = product.price * qty;

      return `
      <article class="order-item">
        <div>
          <p><strong>${product.name}</strong></p>
          <p>الكمية: ${qty} × ${formatPrice(product.price)}</p>
        </div>
        <p>${formatPrice(subTotal)}</p>
      </article>
    `;
    })
    .join('');

  orderModalTotal.textContent = formatPrice(getCartTotals().amount);
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((item) => item.classList.remove('active'));
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

  const productId = target.dataset.productId;
  const action = target.dataset.action;
  if (productId && action === 'increase') {
    updateSelectedQty(productId, 1);
    return;
  }

  if (productId && action === 'decrease') {
    updateSelectedQty(productId, -1);
    return;
  }

  const addProductId = target.dataset.add;
  if (!addProductId) {
    return;
  }

  addToCart(addProductId);
});

checkoutBtn.addEventListener('click', () => {
  renderOrderDialog();
  orderDialog.showModal();
});

closeOrderDialog.addEventListener('click', () => orderDialog.close());
continueShoppingBtn.addEventListener('click', () => orderDialog.close());

sendOrderBtn.addEventListener('click', () => {
  const message = buildWhatsAppMessage();
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
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

orderDialog.addEventListener('click', (event) => {
  if (event.target === orderDialog) {
    orderDialog.close();
  }
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
