// --- Jastip Aaron - Core Application Logic ---

// --- State Management ---
const AppState = {
    cart: JSON.parse(localStorage.getItem('jastipCart')) || [],
    products: {
        // Validation/Lookup if needed, currently using DOM data
    }
};

// --- Utilities ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const saveCart = () => {
    localStorage.setItem('jastipCart', JSON.stringify(AppState.cart));
    updateCartUI();
    syncProductPageUI(); // Sync pages whenever cart changes
};

// --- Cart Actions ---
const addToCart = (product) => {
    // Check if item exists (same ID and same Color)
    const existingItem = AppState.cart.find(item => item.id === product.id && item.color === product.color);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Ensure quantity is set
        product.quantity = 1;
        AppState.cart.push(product);
    }

    saveCart();

    // Only open cart automatically if we are in the dripper section (URL contains 'dripper')
    // For other sections (Coffee, Snacks), stay on page without opening cart
    if (window.location.href.toLowerCase().includes('dripper')) {
        openCart();
    } else {
        // Optional: Show a small toast or visual feedback? 
        // For now, just updating the UI (count) is enough as per request.
        // User just said "shouldn't appear".
        updateCartUI(); // Redundant as saveCart calls it, but harmless.
    }
};

const updateItemQuantity = (index, change) => {
    const item = AppState.cart[index];
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(index);
    } else {
        saveCart();
    }
};

const removeFromCart = (index) => {
    AppState.cart.splice(index, 1);
    saveCart();
};

const clearCart = () => {
    AppState.cart = [];
    saveCart();
};

const getCartTotal = () => {
    return AppState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// --- UI Functions ---
const updateCartUI = () => {
    const cartCount = document.getElementById('cart-count');
    const mobileCartCount = document.getElementById('mobile-menu-cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');

    // Total Items Count
    const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.innerText = totalItems;
    if (mobileCartCount) mobileCartCount.innerText = `(${totalItems})`;

    if (cartItemsContainer && cartTotalEl) {
        cartItemsContainer.innerHTML = '';
        AppState.cart.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';

            // Image handling (fallback)
            const imgSrc = item.image || 'https://via.placeholder.com/60';

            itemEl.innerHTML = `
                <img src="${imgSrc}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title"><strong>${item.name}</strong></div>
                    <div class="cart-item-variant">${item.color ? 'Color: ' + item.color : ''}</div>
                    <div class="cart-item-price">${formatCurrency(item.price)}</div>
                    
                    <div class="quantity-control small">
                        <button onclick="updateItemQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateItemQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <!-- Optional: Keep X button or rely on decrement to 0? Keeping X for easier full removal -->
                <button onclick="removeFromCart(${index})" class="remove-btn">&times;</button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        cartTotalEl.innerText = formatCurrency(getCartTotal());
    }
};

const syncProductPageUI = () => {
    // This function looks for product cards or add buttons on the CURRENT page
    // and updates them to show the quantity control if the item is in the cart.

    // 1. Selector for "Add to Cart" buttons on Product Detail Pages
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        const productId = addToCartBtn.dataset.id;
        const selectedColorEl = document.querySelector('.color-swatch.selected');
        const selectedColor = selectedColorEl ? selectedColorEl.dataset.color : null;

        // Find if this specific variant is in cart
        const cartItem = AppState.cart.find(item => item.id === productId && item.color === selectedColor);

        const actionContainer = addToCartBtn.parentElement; // Assuming container
        let qtyControl = document.getElementById('pdp-qty-control');

        if (cartItem) {
            addToCartBtn.style.display = 'none';

            if (!qtyControl) {
                qtyControl = document.createElement('div');
                qtyControl.id = 'pdp-qty-control';
                qtyControl.className = 'quantity-control large';
                actionContainer.appendChild(qtyControl);
            }

            // Update Inner HTML of control
            // finding index for update function
            const index = AppState.cart.indexOf(cartItem);
            qtyControl.innerHTML = `
                <button onclick="updateItemQuantity(${index}, -1)">-</button>
                <span>${cartItem.quantity}</span>
                <button onclick="updateItemQuantity(${index}, 1)">+</button>
            `;
            qtyControl.style.display = 'flex';
        } else {
            addToCartBtn.style.display = 'block';
            if (qtyControl) qtyControl.style.display = 'none';
        }
    }

    // 2. Selector for Product Cards in Grids (coffee.html, dripper.html)
    // IMPORTANT: Product cards are often links (<a>). We need to handle this carefully.
    // The user wants the overlay on the bottom right or similar.
    // We'll look for .product-card and identify them by something unique.
    // Currently, list pages don't have unique IDs easily accessible in DOM without parsing.
    // BUT the cards on `dripper.html` wrap links like `dripper/solo.html`.
    // We can use the HREF or Title to identify.
    // However, `coffee.html` products are static divs with titles.

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        // Strategy: Match by Name (Title).
        const titleEl = card.querySelector('.product-title');
        if (!titleEl) return;
        const productName = titleEl.innerText.trim();

        const cartItems = AppState.cart.filter(item => item.name === productName);
        const totalQty = cartItems.reduce((sum, i) => sum + i.quantity, 0);

        let overlay = card.querySelector('.card-qty-overlay');
        const addToCartSmallBtn = card.querySelector('.add-to-cart-small');

        if (totalQty > 0) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'card-qty-overlay';
                // Prevent click propagation to the parent anchor tag if it exists
                overlay.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
                card.appendChild(overlay);
                card.style.position = 'relative'; // Ensure positioning context
            }

            const firstMatch = cartItems[0];
            const index = AppState.cart.indexOf(firstMatch);

            overlay.innerHTML = `
                <button onclick="updateAndStopProp(${index}, -1, event)">-</button>
                <span style="margin:0 8px;">${totalQty}</span>
                <button onclick="updateAndStopProp(${index}, 1, event)">+</button>
            `;
            overlay.style.display = 'flex';

            // Hide the original Add to Cart button to prevent overlap
            if (addToCartSmallBtn) addToCartSmallBtn.style.display = 'none';

        } else {
            if (overlay) overlay.style.display = 'none';
            // Restore the original button
            if (addToCartSmallBtn) addToCartSmallBtn.style.display = 'block';
        }
    });
};

// Helper to stop propagation for inline buttons
window.updateAndStopProp = (index, change, event, name, price, image, category) => {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (index === null) {
        // Adding a new item from a static card (e.g. coffee.html)
        const product = {
            id: name, // Use name as ID for simple products
            name: name,
            price: parseInt(price),
            image: image,
            color: category || 'Default', // Use category or default as variant
            quantity: 1
        };
        addToCart(product);
    } else {
        // Updating existing item
        updateItemQuantity(index, change);
    }
};

const openCart = () => {
    document.getElementById('cart-overlay').classList.add('open');
    document.body.classList.add('no-scroll');
};

const closeCart = () => {
    document.getElementById('cart-overlay').classList.remove('open');
    document.body.classList.remove('no-scroll');
};

// --- Initializer ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    syncProductPageUI(); // Initial sync

    // Cart Toggles
    const cartIcon = document.getElementById('cart-icon');
    const closeCartBtn = document.getElementById('close-cart');
    const overlay = document.getElementById('cart-overlay');

    if (cartIcon) cartIcon.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeCart();
    });

    // Color Selection Logic
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function () {
            colorSwatches.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');

            // Re-sync UI because color choice changes which 'cart item' matches for the PDP button
            syncProductPageUI();
        });
    });

    // Add to Cart Logic (Product Page)
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const selectedColorEl = document.querySelector('.color-swatch.selected');
            const color = selectedColorEl ? selectedColorEl.dataset.color : null;

            // Validate if color is required (if swatches exist)
            if (colorSwatches.length > 0 && !color) {
                alert('Please select a color.');
                return;
            }

            const product = {
                id: addToCartBtn.dataset.id,
                name: addToCartBtn.dataset.name,
                price: parseInt(addToCartBtn.dataset.price),
                image: addToCartBtn.dataset.image,
                color: color
            };

            addToCart(product);
        });
    }

    // Checkout / Send Order Button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (AppState.cart.length === 0) {
                alert('Your cart is empty.');
                return;
            }
            window.location.href = 'payment.html';
        });
    }

    // Invoice / Payment Page Logic
    const summaryEl = document.getElementById('payment-summary');
    if (summaryEl) {
        if (AppState.cart.length === 0) {
            alert('No items in cart.');
            window.location.href = 'FrontPage.html';
        } else {
            const itemsHtml = AppState.cart.map(i => `
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                    <span>${i.quantity}x ${i.name} ${i.color ? '(' + i.color + ')' : ''}</span>
                    <span>${formatCurrency(i.price * i.quantity)}</span>
                </div>
             `).join('');

            summaryEl.innerHTML = itemsHtml +
                `<hr><div style="font-weight:bold; margin-top:10px; text-align:right;">Total: ${formatCurrency(getCartTotal())}</div>`;
        }
    }

    // --- Hamburger Menu Logic ---
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const menuOverlay = document.getElementById('menu-overlay');
    const closeMenuBtn = document.getElementById('close-menu');

    const openMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.add('open');
            document.body.classList.add('no-scroll');
        }
    };

    const closeMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.remove('open');
            document.body.classList.remove('no-scroll');
        }
    };

    if (hamburgerIcon) hamburgerIcon.addEventListener('click', openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) closeMenu();
    });

    // --- Dynamic Mobile Menu Logic ---
    const updateMobileMenuContent = () => {
        const path = window.location.pathname;
        const menuLinks = document.querySelector('.menu-links');
        const packagingLink = document.getElementById('menu-packaging');

        if (!menuLinks) return;

        // Hide "Packaging" by default on pages where it's irrelevant
        // Irrelevant on: FrontPage.html, dripper.html and its subpages
        // Relevant on: coffee.html (Packaging), snacks.html (Categories)

        if (packagingLink) {
            const isCoffee = path.includes('coffee.html');
            const isSnacks = path.includes('snacks.html');

            if (!isCoffee && !isSnacks) {
                packagingLink.style.display = 'none';
            } else {
                packagingLink.style.display = 'block'; // Ensure visible if relevant
            }
        }

        // Helper to create filter item
        const createFilterItem = (text, filterVal, filterGroup, isSnack = false) => {
            const item = document.createElement('span');
            item.className = 'mobile-filter-item';
            item.textContent = text;
            item.dataset.filter = filterVal;

            item.addEventListener('click', (e) => {
                // Determine which filter function to call based on page
                // Note: filterProducts function needs to be globally accessible or we simulate click on sidebar
                // Simulating click on sidebar is safer if logic is scoped.

                // Close menu first
                closeMenu();

                // Find corresponding sidebar item
                const sidebarId = isSnack ? 'snack-filter' : 'packaging-filter';
                const sidebarList = document.getElementById(sidebarId);
                if (sidebarList) {
                    const sidebarItem = sidebarList.querySelector(`[data-filter="${filterVal}"]`);
                    if (sidebarItem) {
                        sidebarItem.click(); // Trigger existing logic
                    }
                }
            });
            filterGroup.appendChild(item);
        };

        // Coffee Page Logic
        if (path.includes('coffee.html')) {
            if (packagingLink) {
                // Prevent default jump
                packagingLink.href = 'javascript:void(0);';

                // Create Container
                const container = document.createElement('div');
                container.className = 'mobile-filter-group';

                // Add items "All", "Aluminium (Bottle)", "Drip Bags", "Pods"
                createFilterItem('All', 'all', container);
                createFilterItem('Aluminium (Bottle)', 'aluminium', container);
                createFilterItem('Drip Bags', 'dripbag', container);
                createFilterItem('Pods', 'pods', container);

                // Insert after Packaging Link
                packagingLink.parentNode.insertBefore(container, packagingLink.nextSibling);

                // Optional: Make "Packaging" itself toggle the list? For now just show it.
            }
        }

        // Snacks Page Logic
        if (path.includes('snacks.html')) {
            // Replace "Packaging" with "Categories" or append? User said "instead of packaging is categories"
            if (packagingLink) {
                packagingLink.textContent = 'Categories';
                packagingLink.href = 'javascript:void(0);';
                packagingLink.id = 'menu-categories'; // Rename

                const container = document.createElement('div');
                container.className = 'mobile-filter-group';

                // Add items: All, Lay's, Doritos, Cheetos & Pringles
                // Note: These must match data-filter in HTML
                createFilterItem('All', 'all', container, true);
                createFilterItem("Lay's", 'lays', container, true);
                createFilterItem('Doritos', 'doritos', container, true);
                createFilterItem('Cheetos & Pringles', 'cheetos-pringles', container, true);
                // Add others if needed: Cadbury, Bourborn, etc. based on snacks.html
                // For brevity, adding top ones.

                // Add specific brands as requested/seen in snacks.html
                // "Specialty & Premium" -> 'specialty-premium'
                // "Taiwan Classic" -> 'taiwan-classic'
                createFilterItem('Specialty & Premium', 'specialty-premium', container, true);
                createFilterItem('Taiwan Classic', 'taiwan-classic', container, true);


                packagingLink.parentNode.insertBefore(container, packagingLink.nextSibling);
            }
        }
    };

    updateMobileMenuContent();

    // --- Shutter Transition Logic ---
    const curtain = document.getElementById('transition-curtain');

    // 1. Enter Animation (Slide Up)
    if (curtain) {
        // Force browser repaint to ensure transition plays?
        // Actually, simple timeout ensures it starts "closed" (block) then transitions to open
        requestAnimationFrame(() => {
            curtain.classList.remove('curtain-closed'); // Safety removal
            curtain.classList.add('curtain-open');
        });
    }

    // 2. Exit Animation (Slide Down on Link Click)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        const target = link.getAttribute('target');

        // Check if internal link and valid
        if (href &&
            !href.startsWith('#') &&
            !href.startsWith('javascript:') &&
            !href.startsWith('mailto:') &&
            target !== '_blank') {

            e.preventDefault();

            if (curtain) {
                curtain.classList.remove('curtain-open');
                curtain.classList.add('curtain-closed');

                // Wait for transition (600ms matching CSS)
                setTimeout(() => {
                    window.location.href = href;
                }, 600);
            } else {
                window.location.href = href;
            }
        }
    });

    // Handle "Packaging" link specific behavior if needed (Optional)
    // const packagingLink = document.getElementById('menu-packaging');
    // REMOVED: Managed by updateMobileMenuContent above
    // --- Dynamic Mobile Menu Logic ---
    // ... (existing helper) ...
    // Note: Re-insert full function in final output if using replace_file_content, 
    // but since I'm appending logic, I need to be careful.
    // Actually, I can just append the new logic before the closing brace if I use replace_file_content properly.
    // BUT replace_file_content replaces a block.
    // I will just add the smart header logic here.

    // --- Smart Header Logic ---
    // "Apply to all html files except FrontPage.html"
    if (!window.location.pathname.includes('FrontPage.html')) {
        let lastScrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');

        window.addEventListener('scroll', () => {
            if (!navbar) return;
            const currentScrollY = window.scrollY;

            // Threshold to avoid jitter
            if (Math.abs(currentScrollY - lastScrollY) < 10) return;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling DOWN -> Hide
                navbar.classList.add('navbar-hidden');
            } else {
                // Scrolling UP -> Show
                navbar.classList.remove('navbar-hidden');
            }
            lastScrollY = currentScrollY;
        });
    }

    // --- Global Back Button Injection ---
    // Injects a "Back" button on every page except FrontPage
    const isFrontPage = window.location.pathname.toLowerCase().includes('frontpage.html') ||
        window.location.pathname.toLowerCase().includes('index.html') ||
        (window.location.pathname.endsWith('/') && window.location.pathname.length < 2) ||
        window.location.pathname.toLowerCase().endsWith('/jastipaaron/'); // Root

    // Also exclude if specifically requested not to show? No, user said "every HTML".
    // But logically, FrontPage is start.
    if (!isFrontPage) {
        const backBtn = document.createElement('div');
        backBtn.className = 'global-back-btn';
        backBtn.innerHTML = '&#8592; Back'; // Left Arrow
        backBtn.addEventListener('click', () => {
            // "when a user pressed back on mobile phone" -> standard back
            window.history.back();
        });
        document.body.appendChild(backBtn);
    }

    // --- Order Order/Timer Display Logic ---
    const initTimer = () => {
        const path = window.location.pathname.toLowerCase();

        // Identify Page Types
        const isFrontPage = path.includes('frontpage') || path.includes('index.html') || (path.endsWith('/') && path.length < 5) || path.endsWith('/jastipaaron/');
        const isCoffee = path.includes('coffee') || path.includes('beans');
        const isDripper = path.includes('dripper');
        const isSnacks = path.includes('snacks');

        // Deadlines
        const coffeeDeadline = new Date('2026-01-14T23:59:00+07:00');
        const snacksDeadline = new Date('2026-01-09T23:59:00+07:00');

        let targetDate = coffeeDeadline; // Default
        if (isSnacks) targetDate = snacksDeadline;

        // Helper to calculate time string
        const calculateTimeStr = (target) => {
            const now = new Date();
            const diff = target - now;
            if (diff <= 0) return 'CLOSED';
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        };

        // References
        let badgeEl = null;
        let menuCountdownEl = document.getElementById('menu-countdown');
        let menuContainer = null;

        // 1. Setup Header Badge (Coffee & Dripper & Snacks)
        if (isCoffee || isDripper || isSnacks) {
            const brand = document.querySelector('.navbar .brand');
            if (brand) {
                const badge = document.createElement('div');
                badge.className = 'header-badge';
                badge.style.cssText = `
                    background-color: #ff4444; 
                    color: white; 
                    padding: 4px 10px; 
                    border-radius: 4px; 
                    font-weight: bold; 
                    font-size: 0.8rem; 
                    margin-left: 10px; 
                    display: inline-flex; 
                    align-items: center; 
                    gap: 8px;
                    text-transform: uppercase;
                    box-shadow: 0 4px 6px rgba(255, 68, 68, 0.2);
                    white-space: nowrap;
                `;
                // Initialize immediately
                badge.innerHTML = `⚠️ ${calculateTimeStr(targetDate)}`;

                brand.style.display = 'flex';
                brand.style.alignItems = 'center';
                brand.appendChild(badge);
                badgeEl = badge;
            }
        }

        // 2. Setup Hamburger Menu Item (All Pages)
        const menuLinks = document.querySelector('.menu-links');
        if (menuLinks && !menuCountdownEl) {
            const cartLink = menuLinks.querySelector('.mobile-cart-link');
            menuContainer = document.createElement('div');
            menuContainer.style.cssText = 'color: #ff4444; font-weight: bold; padding: 10px 0; border-bottom: 1px solid #333; margin-bottom: 10px;';
            menuContainer.innerHTML = `⚠️ <span id="menu-countdown">${calculateTimeStr(targetDate)}</span>`;

            if (cartLink && cartLink.nextSibling) {
                menuLinks.insertBefore(menuContainer, cartLink.nextSibling);
            } else if (cartLink) {
                menuLinks.appendChild(menuContainer);
            } else {
                menuLinks.prepend(menuContainer);
            }
            menuCountdownEl = menuContainer.querySelector('#menu-countdown');
        } else if (menuCountdownEl) {
            // Element already exists (e.g. FrontPage markup), reuse it
        }

        // 3. Update Function
        const update = () => {
            const timeStr = calculateTimeStr(targetDate);

            // Update Badge
            if (badgeEl) {
                badgeEl.innerHTML = `⚠️ ${timeStr}`;
            }

            // Update Menu
            if (menuCountdownEl && !isFrontPage) {
                menuCountdownEl.textContent = timeStr;
            }
        };

        // 4. Start
        update();
        setInterval(update, 1000);
    };

    initTimer();

});
