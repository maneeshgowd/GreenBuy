/* eslint-disable */

class View {
  _productHamburger = document.getElementById("product-hamburger");
  _productMenu = document.getElementById("product-menu");
  _cancelHamburger = document.getElementById("cancel-hamburger");
  _main = document.getElementById("main-image");
  _mainTitle = document.getElementById("main-title");
  _filterCancel = document.getElementById("filter-cancel");
  _filter = document.getElementById("filter");
  _filterBtn = document.getElementById("filter--btn");
  /////
  _categoriesBtn = document.getElementById("categories-btn");
  _categoriesTooltip = document.getElementById("categories-tooltip");
  _productContainer = document.getElementById("product-container");
  /////
  _loginPassword = document.getElementById("password");
  _loginIcon = document.getElementById("login-pass-icon");
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

  // mainAnimationHandler(handler) {
  //   handler(this._main || null, this._mainTitle);
  // }

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

  addProductHandler(handler) {
    this._productContainer?.addEventListener("click", handler);
  }

  addProductCounter(handler) {
    this._productCounter?.addEventListener("click", handler);
  }

  addLogoutHandler(handler) {
    this._logoutUser?.forEach((ele) => ele.addEventListener("click", handler));
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
}

export default new View();
