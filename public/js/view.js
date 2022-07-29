/* eslint-disable */

class View {
  _productHamburger = document.getElementById("product-hamburger");
  _productMenu = document.getElementById("product-menu");
  _cancelHamburger = document.getElementById("cancel-hamburger");
  _filterCancel = document.getElementById("filter-cancel");
  _filter = document.getElementById("filter");
  _filterBtn = document.getElementById("filter--btn");
  /////
  _categoriesBtn = document.getElementById("categories-btn");
  _categoriesTooltip = document.getElementById("categories-tooltip");
  _productContainer = document.getElementById("product-container");
  _mostPopular = document.getElementById("most-popular");
  _wishlistCounter = document.getElementById("wishlist-counter");
  /////
  _loginPassword = document.getElementById("password");
  _loginIcon = document.getElementById("login-pass-icon");
  _forgetPassIcon = document.querySelectorAll("#forget-pass-icon");
  _loginEmail = document.getElementById("email");
  _loginIn = document.getElementById("form--login");
  /////
  _createPassword = document.getElementById("new-password");
  _createRepeatPassword = document.getElementById("repeat-password");
  _createName = document.getElementById("name");
  _createEmail = document.getElementById("create-email");
  _createIcon = document.querySelectorAll("#create-pass-icon");
  _signUp = document.getElementById("form--create");
  _validateOtp = document.getElementById("form--otp");
  /////
  _userInformation = document.getElementById("user-information");
  /////
  _productCounter = document.getElementById("product-counter");
  /////
  _logoutUser = document.querySelectorAll("#logout-user");

  _forgetEmail = document.getElementById("forget--email");
  _token = document.getElementById("token");
  _forgetPass = document.getElementById("forget-pass");

  _totalItems = document.getElementById("total-items");
  _totalPrice = document.getElementById("total-price");
  _checkout = document.getElementById("checkout");
  ///////

  _categories = document.getElementById("categories");
  _priceRange = document.getElementById("price-range");
  _ratings = document.getElementById("ratings");
  _setFilter = document.getElementById("set-filter");

  _imageUpload = document.getElementById("image-upload");
  _avatar = document.getElementById("avatar");
  _address = document.getElementById("address");
  _postCode = document.getElementById("postcode");
  _country = document.getElementById("select");
  _submitData = document.getElementById("submit-user-data");
  _currentPassword = document.getElementById("currentPassword");
  _newPassword = document.getElementById("newPassword");
  _repeatPassword = document.getElementById("repeatPassword");
  _submitPassword = document.getElementById("submit-password");
  _closePassword = document.getElementById("close-password");
  _closeAccount = document.getElementById("close-user-account");
  _myOrders = document.getElementById("my-orders");
  _overviewCheckoutBtn = document.getElementById("checkoutBtn");
  _overviewAddToCart = document.getElementById("addToCart");

  ////////

  constructor() {
    this._viewIntersectionObserver();
  }

  checkOutHandler(handler) {
    handler(this._productCounter, this._totalItems, this._totalPrice);
  }

  _viewIntersectionObserver() {
    const revealSection = function (entries, observer) {
      const [entry] = entries;
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("anim");
      observer.unobserve(entry.target);
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
      root: null,
      threshold: 0.15,
    });

    document.querySelectorAll(".section").forEach((section) => {
      sectionObserver.observe(section);
      section.classList.add("anim");
    });
  }

  menuToggleHandler(showMenuHandler, hideMenuHandler) {
    this._cancelHamburger?.addEventListener("click", hideMenuHandler);
    this._productHamburger?.addEventListener(
      "click",
      showMenuHandler.bind(this, this._productMenu)
    );
    this._filterBtn?.addEventListener("click", showMenuHandler.bind(this, this._filter));
    this._filterCancel?.addEventListener("click", hideMenuHandler);
  }

  toolTipHandler(handler) {
    this._categoriesBtn?.addEventListener(
      "click",
      handler.bind(this._categoriesBtn, this._categoriesTooltip)
    );
  }

  passwordVisibleHandler(handler) {
    this._loginIcon?.addEventListener("click", handler.bind(this._loginIcon, this._loginPassword));
    this._createIcon[0]?.addEventListener(
      "click",
      handler.bind(this._createIcon[0], this._createPassword)
    );

    this._forgetPassIcon[0]?.addEventListener("click", (e) => {
      handler.call(e.target, e.target.parentElement.firstElementChild);
    });

    this._forgetPassIcon[1]?.addEventListener("click", (e) => {
      handler.call(e.target, e.target.parentElement.firstElementChild);
    });

    this._createIcon[1]?.addEventListener(
      "click",
      handler.bind(this._createIcon[1], this._createRepeatPassword)
    );
  }

  authenticateHandler(signUpHandler, loginHandler, validateOtpHandler) {
    const inputCreate = [
      this._createName,
      this._createEmail,
      this._createPassword,
      this._createRepeatPassword,
    ];

    const inputLogin = [this._loginEmail, this._loginPassword];

    this._signUp?.addEventListener("submit", function (e) {
      signUpHandler.call(this, e, inputCreate);
    });

    this._loginIn?.addEventListener("submit", function (e) {
      loginHandler.call(this, e, inputLogin);
    });

    this._validateOtp?.addEventListener("submit", validateOtpHandler);
  }

  addFilterHandler(handler) {
    const data = [this._priceRange, this._ratings, this._categories];
    this._setFilter?.addEventListener("click", handler.bind(data));
  }

  addProductHandler(handler) {
    this._productContainer?.addEventListener("click", handler);
  }

  addProductCartFeatures(handler) {
    const data = [this._totalItems, this._totalPrice];
    this._productCounter?.addEventListener("click", handler.bind(this._productCounter, data));
  }

  addWishlistFeatures(handler) {
    this._wishlistCounter?.addEventListener("click", handler);
  }
  addLogoutHandler(handler) {
    this._logoutUser?.forEach((ele) => ele.addEventListener("click", handler));
  }

  addRatingsHandler(handler) {
    this._ratings?.addEventListener("click", handler);
  }

  addForgetPassHandler(handler) {
    const emailForget = this._forgetEmail;
    this._forgetPass?.addEventListener("click", handler.bind(this._forgetPass, emailForget));
  }

  addSendForgetEmail(handler) {
    const tokenVerify = this._token;
    this._forgetEmail?.addEventListener("submit", handler.bind(this._forgetEmail, tokenVerify));
  }

  addChangeForgetPass(handler) {
    this._token?.addEventListener("submit", handler);
  }

  addUserSettingToggler(handler) {
    const userPersonelInfo = document.getElementById("user-personel-info");
    const userPassword = document.getElementById("user-password");
    const userOrder = document.getElementById("user-orders");
    const userCloseAcc = document.getElementById("close-account");
    const personelInfo = document.getElementById("personel-info");
    const passwordInfo = document.getElementById("password-info");
    const myOrders = document.getElementById("my-orders");
    const closeInfo = document.getElementById("close-info");

    this._userInformation?.addEventListener("click", (e) => {
      handler.call(
        this,
        e,
        [userPersonelInfo, userPassword, userOrder, userCloseAcc],
        [passwordInfo, personelInfo, myOrders, closeInfo]
      );
    });
  }

  addModifyUserData(handler) {
    const data = [
      this._createName,
      this._createEmail,
      this._address,
      this._postCode,
      this._country,
    ];
    this._submitData?.addEventListener("submit", handler.bind(data));
  }

  addModifyUserPass(handler) {
    const data = [this._currentPassword, this._newPassword, this._repeatPassword];
    this._submitPassword?.addEventListener("submit", handler.bind(data));
  }

  addCloseUserAccount(handler) {
    const data = this._closePassword;
    this._closeAccount?.addEventListener("submit", handler.bind(data));
  }

  addUploadUserImage(handler) {
    const data = this._avatar;
    this._imageUpload?.addEventListener("click", handler.bind(data));
  }

  addCheckoutSession(handler) {
    this._checkout?.addEventListener("click", handler);
  }

  star(rating, start = 0, clr = "#ffae00") {
    const html = `<svg class="icons--star icons--mini" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.2" stroke="#4a4a4a" fill=${clr} stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" style="pointer-events:none;" />
    <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" style="pointer-events:none;" />
    </svg>`;

    const data = [];

    for (let i = 0; i < Math.abs(rating - start); i++) data.push(html);

    return data;
  }

  addMostPopularHandler(handler) {
    this._mostPopular?.addEventListener("click", handler);
  }

  addProductOverviewHandler(cartHandler, checkoutHandler) {
    this._overviewAddToCart?.addEventListener("click", cartHandler);
    this._overviewCheckoutBtn?.addEventListener("click", checkoutHandler);
  }

  viewFilterData(prod) {
    const data = prod.map((d) => {
      const starIcon_1 = this.star(Math.floor(d.ratings), 0);
      const starIcon_2 = this.star(Math.floor(d.ratings), 5, "none");
      return `
            <a id="product" class="product--prod" href="/${d.slug}" data-attr="/${
        d.slug
      }" data-prodID="${d._id}">
                <img class="product-image" src="/img/${d.images[0]}" alt="${
        d.plantName || d.potName
      }"/>
                <h2 class="product-name">${d.plantName || d.potName}</h2>
                <div class="product-rating">
                    ${starIcon_1.join("")}
                    ${starIcon_2.join("")}
                    <h2 class="rating-title"> ${d.ratings} </h2>
                </div>
                <svg id="wishlist-icon" class="wishlist-icon" xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewbox='0 0 24 24' stroke-width='1.5' stroke='none' fill='none' stroke-linecap='round' stroke-linejoin='round'>
                    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                    <path style='pointer-events: none' d='M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572' />
                </svg>
                <div id="cart-anim" class="shopping-cart hidden-helper">
                    <img class="cart-anim" src='/icons/cart-2.svg' alt='cart' />
                </div>
                <div class="product-price">
                    <h2 class="price">₹${d.price}</h2>
                    <button id="add-cart-btn" class="add-cart"> Add to cart</button>
                </div>
            </a>`;
    });

    this._productContainer.innerHTML = "";
    let domData = data.join("");

    if (domData.length === 0) domData = "<h1 style='color:gray;'>No Match found!</h1>";
    this._productContainer?.insertAdjacentHTML("beforeend", domData);
  }

  addMyBookingsHandler(data) {
    const html = data.map((order) => {
      return `
     
      <div class="orders">
      <img src='/img/${order.images[0]}' alt=${order.name} />
      <h2 class="order-title">${order.name}</h2>
      <h2 class="order-title order--mini"> Arriving soon</h2>
      <h2 class="order-price"> ₹${(order.amount / 100) * order.quantity} </h2>
      </div>`;
    });

    this._myOrders.innerHTML = "";

    html.shift("<h1 orders__title.info--title> Orders Information</h1>");

    let domData = html.join("");

    if (domData.length === 0) domData = "<h1 style='color:gray;'>No Bookings found!</h1>";

    this._myOrders.insertAdjacentHTML("beforeend", domData);
  }
}

export default new View();
