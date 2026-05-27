(function () {
    const supabaseUrl = 'https://yzdtwtnrfgjekczgrlav.supabase.co';
    const supabaseKey = 'sb_publishable_utTEQ4LvwDqvyH7NBfsdyA_EM8pUcaJ';
    const supabase = window.supabase && typeof window.supabase.createClient === 'function'
        ? window.supabase.createClient(supabaseUrl, supabaseKey)
        : null;

    let authMode = 'login';

    function byId(id) {
        return document.getElementById(id);
    }

    function setAuthMode(mode) {
        const title = byId('auth-title');
        const subtitle = byId('auth-subtitle');
        const nombreField = byId('nombre-field');
        const loginBtn = byId('login-btn');
        const registerBtn = byId('register-btn');
        const switchCopy = byId('auth-switch-copy');
        const switchBtn = byId('auth-switch-btn');
        const feedback = byId('auth-feedback');
        const password = byId('password');
        const togglePassword = byId('toggle-password');

        authMode = mode === 'register' ? 'register' : 'login';

        if (title) {
            title.textContent = authMode === 'register' ? 'ACCESO KICKSHOP' : 'BIENVENIDO A KICKSHOP';
        }
        if (subtitle) {
            subtitle.textContent = authMode === 'register'
                ? 'Crea tu cuenta y entra al catálogo exclusivo de la tienda.'
                : 'Inicia sesión para guardar tu acceso y seguir comprando.';
        }
        if (nombreField) {
            nombreField.style.display = authMode === 'register' ? 'grid' : 'none';
        }
        if (loginBtn) {
            loginBtn.style.display = authMode === 'login' ? 'block' : 'none';
        }
        if (registerBtn) {
            registerBtn.style.display = authMode === 'register' ? 'block' : 'none';
        }
        if (switchCopy) {
            switchCopy.textContent = authMode === 'register' ? '¿Ya eres miembro?' : '¿No tienes cuenta?';
        }
        if (switchBtn) {
            switchBtn.textContent = authMode === 'register' ? 'Inicia sesión' : 'Crea una aquí';
        }
        if (password) {
            password.placeholder = authMode === 'register' ? 'Mínimo 6 caracteres' : 'Tu contraseña';
            password.type = togglePassword && togglePassword.checked ? 'text' : 'password';
        }
        if (togglePassword) {
            togglePassword.checked = false;
        }
        updatePasswordStrengthUI(password ? password.value : '');
        if (feedback) {
            feedback.className = '';
            feedback.textContent = '';
        }
    }

    window.togglePasswordVisibility = function () {
        const password = byId('password');
        const togglePassword = byId('toggle-password');

        if (!password || !togglePassword) return;
        password.type = togglePassword.checked ? 'text' : 'password';
    };

    function updateAuthStatus(email) {
        const status = byId('auth-status');
        if (!status) return;
        status.textContent = email ? 'Sesión activa: ' + email : 'No has iniciado sesión.';
    }

    function getInitialFromUser(user) {
        const metadataName = user && user.user_metadata && user.user_metadata.nombre
            ? user.user_metadata.nombre.trim()
            : '';
        const fallback = metadataName || (user && user.email ? user.email : 'K');
        return fallback.charAt(0).toUpperCase();
    }

    function getDisplayName(user) {
        const metadataName = user && user.user_metadata && user.user_metadata.nombre
            ? user.user_metadata.nombre.trim()
            : '';
        return metadataName || (user && user.email ? user.email : 'Invitado');
    }

    function updateProfileUI(user) {
        const loginBtn = byId('nav-login-btn');
        const registerBtn = byId('nav-register-btn');
        const profileArea = byId('profile-area');
        const profileBadge = byId('profile-badge');
        const profileName = byId('profile-name');
        const profileState = byId('profile-state');

        if (user) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (profileArea) profileArea.style.display = 'flex';
            if (profileBadge) profileBadge.textContent = getInitialFromUser(user);
            if (profileName) profileName.textContent = getDisplayName(user);
            if (profileState) profileState.textContent = user.email || 'Sesión iniciada';
            return;
        }

        if (loginBtn) loginBtn.style.display = '';
        if (registerBtn) registerBtn.style.display = '';
        if (profileArea) profileArea.style.display = 'none';
        if (profileBadge) profileBadge.textContent = 'K';
        if (profileName) profileName.textContent = 'KICKSHOP';
        if (profileState) profileState.textContent = 'Sesión iniciada';
    }

    function showAuthMessage(message, type = 'success') {
        const feedback = byId('auth-feedback');
        if (!feedback) return;
        feedback.textContent = message;
        feedback.className = 'show ' + type;
    }

    function setAuthBusy(isBusy) {
        const loginBtn = byId('login-btn');
        const registerBtn = byId('register-btn');
        if (loginBtn) loginBtn.disabled = isBusy;
        if (registerBtn) registerBtn.disabled = isBusy;
    }

    function getAuthFields() {
        return {
            nombre: byId('nombre') ? byId('nombre').value.trim() : '',
            email: byId('email') ? byId('email').value.trim() : '',
            password: byId('password') ? byId('password').value : ''
        };
    }

    function evaluatePasswordStrength(password) {
        const value = String(password || '');
        let score = 0;

        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
        if (/\d/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        if (!value.length) {
            return { level: 'none', label: 'Sin evaluar', isSecure: false };
        }
        if (score <= 1) {
            return { level: 'weak', label: 'Débil', isSecure: false };
        }
        if (score <= 3) {
            return { level: 'medium', label: 'Media', isSecure: false };
        }
        return { level: 'strong', label: 'Segura', isSecure: true };
    }

    function updatePasswordStrengthUI(password) {
        const wrapper = byId('password-strength');
        const text = byId('password-strength-text');
        const hint = byId('password-hint');
        const strength = evaluatePasswordStrength(password);

        if (!wrapper || !text || !hint) {
            return strength;
        }

        wrapper.className = 'password-strength';
        hint.className = 'password-hint';
        text.textContent = 'Sin evaluar';

        if (authMode !== 'register') {
            return strength;
        }

        wrapper.classList.add('show');
        hint.classList.add('show');
        text.textContent = strength.label;

        if (strength.level !== 'none') {
            wrapper.classList.add(strength.level);
        }

        return strength;
    }

    function validateCredentials(fields, requiresName) {
        if (requiresName && !fields.nombre) {
            return 'Escribe tu nombre para completar el registro.';
        }
        if (!fields.email || !fields.password) {
            return 'Completa el correo y la contraseña.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
            return 'Ingresa un correo electrónico válido.';
        }
        if (fields.password.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres.';
        }
        if (requiresName) {
            const strength = evaluatePasswordStrength(fields.password);
            if (strength.level === 'weak' || strength.level === 'none') {
                return 'La contraseña es muy débil. Debe ser al menos media para poder registrarte.';
            }
        }
        return '';
    }

    function getRedirectUrl() {
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            return window.location.origin + window.location.pathname;
        }
        return null;
    }

    async function checkUser() {
        if (!supabase || !supabase.auth) {
            updateAuthStatus('');
            updateProfileUI(null);
            return;
        }

        try {
            const response = await supabase.auth.getSession();
            const session = response && response.data ? response.data.session : null;
            const user = session && session.user ? session.user : null;
            updateAuthStatus(user ? user.email : '');
            updateProfileUI(user);
        } catch (_error) {
            updateAuthStatus('');
            updateProfileUI(null);
        }
    }

    window.openAuthModal = function (mode) {
        const overlay = byId('auth-overlay');
        setAuthMode(mode || 'login');
        if (overlay) {
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeAuthModal = function (event) {
        const overlay = byId('auth-overlay');
        if (event && event.target && event.target.id !== 'auth-overlay') {
            return;
        }
        if (overlay) {
            overlay.classList.remove('show');
        }
        document.body.style.overflow = '';
    };

    window.switchAuthMode = function () {
        setAuthMode(authMode === 'login' ? 'register' : 'login');
    };

    window.scrollToAuth = function () {
        window.openAuthModal('login');
    };

    window.login = async function () {
        const fields = getAuthFields();
        const validationError = validateCredentials(fields, false);

        if (validationError) {
            showAuthMessage(validationError, 'error');
            return;
        }

        if (!supabase || !supabase.auth) {
            showAuthMessage('No se pudo conectar con Supabase.', 'error');
            return;
        }

        setAuthBusy(true);
        showAuthMessage('Validando acceso...', 'success');

        try {
            const response = await supabase.auth.signInWithPassword({
                email: fields.email,
                password: fields.password
            });

            setAuthBusy(false);

            if (response.error) {
                showAuthMessage('Error al iniciar sesión: ' + response.error.message, 'error');
                return;
            }

            showAuthMessage('Sesión iniciada correctamente.', 'success');
            await checkUser();
            setTimeout(() => {
                window.closeAuthModal();
            }, 500);
        } catch (error) {
            setAuthBusy(false);
            showAuthMessage('Error al iniciar sesión: ' + error.message, 'error');
        }
    };

    window.register = async function () {
        const fields = getAuthFields();
        const validationError = validateCredentials(fields, true);

        if (validationError) {
            showAuthMessage(validationError, 'error');
            return;
        }

        if (!supabase || !supabase.auth) {
            showAuthMessage('No se pudo conectar con Supabase.', 'error');
            return;
        }

        setAuthBusy(true);
        showAuthMessage('Creando tu cuenta...', 'success');

        try {
            const options = { data: { nombre: fields.nombre } };
            const redirectUrl = getRedirectUrl();
            if (redirectUrl) {
                options.emailRedirectTo = redirectUrl;
            }

            const response = await supabase.auth.signUp({
                email: fields.email,
                password: fields.password,
                options
            });

            setAuthBusy(false);

            if (response.error) {
                showAuthMessage('Error al registrarte: ' + response.error.message, 'error');
                return;
            }

            if (response.data && response.data.session) {
                showAuthMessage('Cuenta creada. Ya puedes usar tu cuenta.', 'success');
                setTimeout(() => {
                    window.closeAuthModal();
                }, 500);
            } else {
                showAuthMessage('Cuenta creada. Revisa tu correo para confirmarla.', 'success');
            }

            await checkUser();
        } catch (error) {
            setAuthBusy(false);
            showAuthMessage('Error al registrarte: ' + error.message, 'error');
        }
    };

    window.logout = async function () {
        if (!supabase || !supabase.auth) {
            updateAuthStatus('');
            updateProfileUI(null);
            return;
        }

        try {
            const response = await supabase.auth.signOut();
            if (response.error) {
                showAuthMessage('Error al cerrar sesión: ' + response.error.message, 'error');
                return;
            }
            updateAuthStatus('');
            updateProfileUI(null);
        } catch (error) {
            showAuthMessage('Error al cerrar sesión: ' + error.message, 'error');
        }
    };


    /* ===== MODAL TALLA ===== */
    let _sizePendiente = null;

    window.abrirSizeModal = function(btn, id, nombre, precio, sizesStr) {
        _sizePendiente = { btn, id, nombre, precio };
        const titleEl = document.getElementById('size-modal-title');
        const priceEl = document.getElementById('size-modal-price');
        const grid    = document.getElementById('size-btn-grid');
        const confirmBtn = document.getElementById('size-confirm-btn');

        if (!titleEl || !grid || !confirmBtn) return;

        titleEl.textContent = nombre.toUpperCase();
        if (priceEl) priceEl.textContent = 'RD$' + precio.toLocaleString('es-DO');

        grid.innerHTML = '';
        sizesStr.split(',').forEach(function(s) {
            const b = document.createElement('button');
            b.className = 'size-btn';
            b.textContent = s.trim();
            b.onclick = function() {
                grid.querySelectorAll('.size-btn').forEach(function(x){ x.classList.remove('selected'); });
                b.classList.add('selected');
                _sizePendiente.talla = s.trim();
                confirmBtn.classList.add('activo');
            };
            grid.appendChild(b);
        });

        confirmBtn.classList.remove('activo');
        document.getElementById('size-modal').classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    window.cerrarSizeModal = function() {
        const modal = document.getElementById('size-modal');
        if (modal) modal.classList.remove('show');
        document.body.style.overflow = '';
        _sizePendiente = null;
    };

    window.confirmarTalla = function() {
        if (!_sizePendiente || !_sizePendiente.talla) return;
        const { btn, id, nombre, precio, talla } = _sizePendiente;
        window.cerrarSizeModal();
        agregarAlCarrito(btn, id + '-' + talla, nombre + ' (Talla ' + talla + ')', precio);
    };

    /* ===== CARRITO ===== */
    let carrito = [];

    function agregarAlCarrito(btn, id, nombre, precio) {
        const existente = carrito.find(p => p.id === id);
        if (existente) {
            existente.cantidad++;
        } else {
            carrito.push({ id, nombre, precio, cantidad: 1 });
        }

        btn.textContent = '✓ Agregado';
        btn.classList.add('added');
        setTimeout(() => {
            btn.textContent = 'Comprar ahora';
            btn.classList.remove('added');
        }, 1200);

        actualizarContador();
        renderCarrito();
    }

    function cambiarCantidad(id, delta) {
        const item = carrito.find(p => p.id === id);
        if (!item) return;
        item.cantidad += delta;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(p => p.id !== id);
        }
        actualizarContador();
        renderCarrito();
    }

    function eliminarItem(id) {
        carrito = carrito.filter(p => p.id !== id);
        actualizarContador();
        renderCarrito();
    }

    function actualizarContador() {
        const total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
        const badge = document.getElementById('cart-count');
        if (!badge) return;
        badge.textContent = total;
        badge.classList.remove('bump');
        void badge.offsetWidth;
        badge.classList.add('bump');
        setTimeout(() => badge.classList.remove('bump'), 200);
    }

    function formatPrice(n) {
        return 'RD$' + n.toLocaleString('es-DO');
    }

    function renderCarrito() {
        const container = document.getElementById('cart-items');
        const emptyMsg = document.getElementById('cart-empty-msg');
        const summary = document.getElementById('cart-summary');
        const totalEl = document.getElementById('cart-total-price');
        const countEl = document.getElementById('summary-count');
        const subtotalEl = document.getElementById('summary-subtotal');
        const checkoutBtn = document.getElementById('btn-checkout');

        if (!container || !emptyMsg || !summary || !totalEl || !countEl || !subtotalEl || !checkoutBtn) {
            return;
        }

        Array.from(container.children).forEach(child => {
            if (!child.id) container.removeChild(child);
        });

        if (carrito.length === 0) {
            emptyMsg.style.display = 'block';
            summary.style.display = 'none';
            totalEl.textContent = 'RD$0';
            countEl.textContent = '0 artículos';
            subtotalEl.textContent = 'RD$0';
            checkoutBtn.disabled = true;
            return;
        }

        emptyMsg.style.display = 'none';
        summary.style.display = 'block';
        checkoutBtn.disabled = false;

        let grandTotal = 0;
        let totalArticulos = 0;

        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            grandTotal += subtotal;
            totalArticulos += item.cantidad;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.nombre}</h4>
                    <div class="item-price">${formatPrice(item.precio)}</div>
                    <div class="item-subtotal">Subtotal: ${formatPrice(subtotal)}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="cambiarCantidad('${item.id}', -1)">−</button>
                        <span class="qty-num">${item.cantidad}</span>
                        <button class="qty-btn" onclick="cambiarCantidad('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="eliminarItem('${item.id}')" title="Eliminar">🗑</button>
            `;
            container.appendChild(div);
        });

        countEl.textContent = totalArticulos + (totalArticulos === 1 ? ' artículo' : ' artículos');
        subtotalEl.textContent = formatPrice(grandTotal);
        totalEl.textContent = formatPrice(grandTotal);
    }

    function abrirCarrito() {
        document.getElementById('cart-drawer').classList.add('open');
        document.getElementById('cart-overlay').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function cerrarCarrito() {
        document.getElementById('cart-drawer').classList.remove('open');
        document.getElementById('cart-overlay').classList.remove('show');
        document.body.style.overflow = '';
    }

    function finalizarCompra() {
        if (carrito.length === 0) return;
        const grandTotal = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
        const paymentTotal = document.getElementById('payment-total-display');
        if (paymentTotal) {
            paymentTotal.textContent = formatPrice(grandTotal);
        }

        document.querySelectorAll('.pay-method-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.payment-form').forEach(form => form.classList.remove('show'));

        cerrarCarrito();
        cerrarExito();
        const paymentModal = document.getElementById('payment-modal');
        if (paymentModal) {
            paymentModal.classList.add('show');
        }
    }

    function cerrarPago() {
        const paymentModal = document.getElementById('payment-modal');
        if (paymentModal) {
            paymentModal.classList.remove('show');
        }
    }

    function selectPayMethod(evt, method) {
        const methodMap = { paypal: 'paypal', card: 'card' };
        const mappedMethod = methodMap[method];
        if (!mappedMethod) return;

        document.querySelectorAll('.pay-method-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.payment-form').forEach(form => form.classList.remove('show'));

        if (evt && evt.currentTarget) {
            evt.currentTarget.classList.add('selected');
        }

        const form = document.getElementById('form-' + mappedMethod);
        if (form) {
            form.classList.add('show');
        }
    }

    function formatCardNumber(input) {
        if (!input) return;
        let val = input.value.replace(/\D/g, '').substring(0, 16);
        input.value = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    function formatExpiry(input) {
        if (!input) return;
        let val = input.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 3) {
            val = val.slice(0, 2) + '/' + val.slice(2);
        }
        input.value = val;
    }

    function onlyDigits(value) {
        return String(value || '').replace(/\D/g, '');
    }

    function generarCodigoPedido() {
        const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const n = Math.floor(100000 + Math.random() * 900000);
        const l1 = letters[Math.floor(Math.random() * letters.length)];
        const l2 = letters[Math.floor(Math.random() * letters.length)];
        return 'KS-' + n + '-' + l1 + l2;
    }

    function confirmarPago(metodo) {
        if (carrito.length === 0) {
            cerrarPago();
            return;
        }

        const method = String(metodo || '').toLowerCase();
        let metodoLabel = '';

        if (method === 'paypal') {
            const paypalEmailEl = byId('paypal-email-input');
            const paypalCodeEl = byId('paypal-code-input');
            const paypalEmail = paypalEmailEl ? paypalEmailEl.value.trim() : '';
            const paypalCode = onlyDigits(paypalCodeEl ? paypalCodeEl.value : '');

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) {
                alert('Escribe un correo válido de PayPal.');
                return;
            }
            if (paypalCode.length < 8) {
                alert('Escribe un código numérico de al menos 8 dígitos (ej: 12345678).');
                return;
            }

            metodoLabel = 'PayPal';
        } else if (method === 'card') {
            const cardNameEl = byId('card-name');
            const cardNumberEl = byId('card-number');
            const cardExpEl = byId('card-exp');
            const cardCvvEl = byId('card-cvv');

            const cardName = cardNameEl ? cardNameEl.value.trim() : '';
            const cardNumber = onlyDigits(cardNumberEl ? cardNumberEl.value : '');
            const cardExp = cardExpEl ? cardExpEl.value.trim() : '';
            const cardCvv = onlyDigits(cardCvvEl ? cardCvvEl.value : '');

            if (!cardName) {
                alert('Escribe el nombre de la tarjeta.');
                return;
            }
            if (cardNumber.length < 8) {
                alert('El número de tarjeta debe tener al menos 8 dígitos (ej: 12345678).');
                return;
            }
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExp)) {
                alert('Escribe una fecha válida en formato MM/AA.');
                return;
            }
            if (cardCvv.length < 3 || cardCvv.length > 4) {
                alert('El CVV debe tener 3 o 4 dígitos.');
                return;
            }

            metodoLabel = 'Tarjeta de crédito/débito';
        } else {
            alert('Selecciona PayPal o Tarjeta para finalizar tu compra.');
            return;
        }

        const codigoPedido = generarCodigoPedido();
        cerrarPago();

        carrito = [];
        actualizarContador();
        renderCarrito();

        const ms = document.getElementById('modal-success');
        if (!ms) return;
        const p = ms.querySelector('p');
        if (p) {
            p.innerHTML = '¡Compra exitosa con <strong style="color:#fff;">' + metodoLabel + '</strong>!<br>' +
                'Código de pedido: <strong style="color:#fff;">' + codigoPedido + '</strong><br>' +
                'Gracias por preferir <strong style="color:#fff;">KICKSHOP</strong>.<br>Tu pedido está en camino. 🚀';
        }
        ms.classList.add('show');
    }

    function cerrarExito() {
        document.getElementById('modal-success').classList.remove('show');
    }

    /* ===== BUSCADOR ===== */
    function buscarProductos(query) {
        const termino = query.trim().toLowerCase();
        const clearBtn = document.getElementById('search-clear');
        const banner = document.getElementById('search-banner');
        const termDisplay = document.getElementById('search-term-display');
        const countDisplay = document.getElementById('search-results-count');
        const noResults = document.getElementById('no-results');
        const allCards = document.querySelectorAll('.shoe-card');
        const allSections = document.querySelectorAll('main.container');

        clearBtn.style.display = termino ? 'block' : 'none';

        const hero = document.querySelector('header.hero');

        if (!termino) {
            allCards.forEach(c => c.classList.remove('hidden'));
            allSections.forEach(s => s.style.display = '');
            banner.style.display = 'none';
            noResults.style.display = 'none';
            if (hero) hero.style.display = '';
            return;
        }

        if (hero) hero.style.display = 'none';

        let encontrados = 0;
        allCards.forEach(card => {
            const nombre = (card.getAttribute('data-nombre') || '').toLowerCase();
            if (nombre.includes(termino)) {
                card.classList.remove('hidden');
                encontrados++;
            } else {
                card.classList.add('hidden');
            }
        });

        allSections.forEach(section => {
            const cards = section.querySelectorAll('.shoe-card');
            const visible = Array.from(cards).some(c => !c.classList.contains('hidden'));
            section.style.display = visible ? '' : 'none';
        });

        termDisplay.textContent = '"' + query.trim() + '"';
        countDisplay.textContent = encontrados;
        banner.style.display = 'block';
        noResults.style.display = encontrados === 0 ? 'block' : 'none';
    }

    function limpiarBusqueda() {
        const input = document.getElementById('search-input');
        input.value = '';
        input.focus();
        buscarProductos('');
    }

    window.agregarAlCarrito = agregarAlCarrito;
    window.cambiarCantidad = cambiarCantidad;
    window.eliminarItem = eliminarItem;
    window.abrirCarrito = abrirCarrito;
    window.cerrarCarrito = cerrarCarrito;
    window.finalizarCompra = finalizarCompra;
    window.cerrarPago = cerrarPago;
    window.selectPayMethod = selectPayMethod;
    window.formatCardNumber = formatCardNumber;
    window.formatExpiry = formatExpiry;
    window.confirmarPago = confirmarPago;
    window.cerrarExito = cerrarExito;
    window.buscarProductos = buscarProductos;
    window.limpiarBusqueda = limpiarBusqueda;

    const passwordInput = byId('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            updatePasswordStrengthUI(passwordInput.value);
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            cerrarCarrito();
            cerrarPago();
            window.closeAuthModal();
            window.cerrarSizeModal();
        }
    });

    setAuthMode('login');
    actualizarContador();
    renderCarrito();
    checkUser();

    if (supabase && supabase.auth && typeof supabase.auth.onAuthStateChange === 'function') {
        supabase.auth.onAuthStateChange((_event, session) => {
            const user = session && session.user ? session.user : null;
            updateAuthStatus(user ? user.email : '');
            updateProfileUI(user);
        });
    }
})();
