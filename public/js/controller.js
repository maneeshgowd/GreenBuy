/* eslint-disable */
"use strict";

import "regenerator-runtime";
import "core-js/stable";
import view from "./view";
import * as model from "./model";
import errorDisplay from "./error";

// VIEW LOGIC

const viewMenuHandler = function (menuWindow) {
  menuWindow.classList.remove("hidden-helper");
  document.body.style.overflow = "hidden";
};

const viewHideMenuHandler = function () {
  this.parentElement.classList.add("hidden-helper");
  document.body.style.overflow = "visible";
};

const viewToolTipHandler = function (categoriesWindow) {
  const chevorn = this.querySelector(".chevorn");

  if (categoriesWindow.classList.contains("tooltip-helper")) {
    categoriesWindow.classList.remove("tooltip-helper");
    chevorn.classList.add("chevorn-toggle");
  } else {
    categoriesWindow.classList.add("tooltip-helper");
    chevorn.classList.remove("chevorn-toggle");
  }
};

// SEND: TO WISHLIST

const viewWishlistHandler = function (nearest) {
  const classs = "wishlist-wishlist";
  this.closest(nearest).dataset.wishlist = "true";
  !this.classList.contains(classs) ? this.classList.add(classs) : this.classList.remove(classs);
};

// SEND: TO CART

const addToCart = function () {
  const cartAnim = this.closest("#product").querySelector("#cart-anim");
  cartAnim.classList.remove("hidden-helper");

  this.classList.add("cart--helper");
  setTimeout(() => cartAnim.classList.add("hidden-helper"), 1000);
  this.setAttribute("disabled", true);
  this.closest("#product").dataset.cart = "true";
};

function cartItemAdder(attr, parentEle) {
  const parent = [...document.querySelectorAll(parentEle)];
  const filtered = parent
    .filter((ele) => ele.dataset[attr] === "true")
    .map((ele) => ele.dataset.prodid);
  return filtered;
}

const viewProductHandler = function (e) {
  if (e.target.id === "wishlist-icon" || e.target.id === "add-cart-btn") {
    e.target.closest("#product").setAttribute("href", "#");
  }
  if (e.target.id === "product") e.target.setAttribute("href", e.target.dataset.attr);

  if (e.target.id === "wishlist-icon") {
    const { type } = e.target.closest("#product").dataset;
    viewWishlistHandler.call(e.target, "#product");
    const items = cartItemAdder("wishlist", "#product");
    model.addItemToWishlit({ [type]: items, type });
  }

  if (e.target.id === "add-cart-btn") {
    const { type } = e.target.closest("#product").dataset;
    addToCart.call(e.target);
    const items = cartItemAdder("cart", "#product");
    model.addItemToCart({ [type]: items, type });
  }
};

const viewAuthLogin = function (e, inputArr) {
  e.preventDefault();
  const [email, password] = inputArr;

  const validatedData = userAuthenticator(email.value.trim(), password.value.trim());
  if (validatedData.includes(0)) return;

  errorDisplay("Please wait!..", "success", 10000);

  const userData = {
    email: validatedData[0],
    password: validatedData[1],
  };

  model.userLogin(userData);
};

const viewPasswordVisibleHandler = function (loginPassword) {
  if (loginPassword.type === "password") {
    loginPassword.type = "text";
    this.src = "/icons/eye.svg";
  } else {
    loginPassword.type = "password";
    this.src = "/icons/eye-off.svg";
  }
};

const viewProductCartHandler = function (data, e) {
  if (e.target.id === "wishlist-icon") {
    viewWishlistHandler.call(e.target, ".items");
    const { type } = e.target.closest(".items").dataset;
    const items = cartItemAdder("wishlist", ".items");
    model.addItemToWishlit({ [type]: items, type });
  }

  if (e.target.id === "remove-cart-item") {
    const totalItems = document.getElementById("total-items");
    const totalPrice = document.getElementById("total-price");

    const { type, prodid } = e.target.closest(".items").dataset;
    model.updateCartWishlist({ type, [type]: prodid }, "cart/updateCartItem");

    e.target.closest(".items").remove();
    calcProductItemsHandler(this, totalItems, totalPrice);
  }

  if (e.target.classList.contains("btn--increment")) {
    const val = +e.target.previousElementSibling.value;
    e.target.previousElementSibling.value = val >= 10 ? 10 : val + 1;
    calcProductItemsHandler(this, ...data);
  }
  if (e.target.classList.contains("btn--decrement")) {
    const val = +e.target.nextElementSibling.value;
    e.target.nextElementSibling.value = val <= 1 ? 1 : val - 1;
    calcProductItemsHandler(this, ...data);
  }
};

const viewWishlistFeatureHandler = function (e) {
  if (e.target.id === "cart") {
    e.target.closest(".items").dataset.cart = "true";
    const { type } = e.target.closest(".items").dataset;
    const items = cartItemAdder("cart", ".items");
    model.addItemToCart({ [type]: items, type });
  } else if (e.target.id === "remove-wishlist-item") {
    const { type, prodid } = e.target.closest(".items").dataset;
    model.updateCartWishlist({ type, [type]: prodid }, "wishlist/updateWishlistItem");
    e.target.closest(".items").remove();
  } else return;
};

function calcProductItemsHandler(parent, totalItems, totalPrice) {
  if (!parent) return;
  const items = [...parent?.querySelectorAll(".items")];
  if (items.length === 0) return;
  const totalProducts = [];
  const price = items.map((item) => {
    const itemPrice = item.querySelector(".items__price").textContent.substr(1);
    const inputval = +item.querySelector("input").value;
    totalProducts.push(inputval);
    return Number(itemPrice) * inputval;
  });

  totalItems.textContent = totalProducts.reduce((acc, ele) => acc + ele, 0);
  totalPrice.textContent = `₹${price.reduce((acc, ele) => acc + ele, 0)}`;
}

const viewAuthCreate = async function (e, inputArr) {
  e.preventDefault();
  const [name, email, password, repeatPassword] = inputArr;

  const validatedData = userAuthenticator(
    email.value.trim(),
    password.value.trim(),
    repeatPassword.value.trim(),
    name.value.trim()
  );
  if (validatedData.includes(0)) return errorDisplay("Passwords dosen't match", "error");

  errorDisplay("Please wait!..", "success", 10000);

  const userData = {
    name: validatedData[1],
    email: validatedData[0],
    password: validatedData[2],
    passwordConfirm: validatedData[2],
  };

  try {
    const otp = await model.userSignup(userData, "validate");

    if (otp.status !== "success") throw new Error(otp.message);

    sessionStorage.setItem("OTP", otp.OTP);
    sessionStorage.setItem("data", JSON.stringify(userData));

    this.classList.add("hidden-helper");

    this.nextElementSibling.classList.remove("hidden-helper");
  } catch (err) {
    errorDisplay(err.message, "error");
  }
};

function viewLogoutHandler() {
  model.logoutUser();
}

function validateOTP(e) {
  e.preventDefault();

  const OTP = sessionStorage.getItem("OTP");
  const data = JSON.parse(sessionStorage.getItem("data"));
  const otpValue = this.querySelector("#otp").value.trim();

  if (otpValue !== OTP) return errorDisplay("Invalid OTP!", "error");

  errorDisplay("Successfully signed.", "success");
  // send data to backend
  model.userSignup(data, "signup");
}

const viewUserSettingsToggleHandler = async function (e, buttons, sections) {
  const [passwordInfo, personelInfo, myOrders, closeInfo] = sections;
  if (!e.target.classList.contains("user-settings-btn")) return;

  buttons.forEach((ele) => ele.parentElement.classList.remove("info--btn"));
  e.target.parentElement.classList.add("info--btn");

  sections.forEach((ele) => ele.classList.add("hidden-helper"));

  if (e.target.id === "user-personel-info") personelInfo.classList.remove("hidden-helper");
  if (e.target.id === "user-password") passwordInfo.classList.remove("hidden-helper");
  if (e.target.id === "user-orders") {
    const data = await model.viewBookings();

    myOrders.classList.remove("hidden-helper");
    view.addMyBookingsHandler(data.data.bookings.product);
  }
  if (e.target.id === "close-account") closeInfo.classList.remove("hidden-helper");
};

function userAuthenticator(email, password, repeatPassword, name) {
  const userData = [];

  const validate =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  validate.test(email) ? userData.push(email) : userData.push(0);

  if (name) name.length < 5 ? userData.push(0) : userData.push(name);

  if (repeatPassword) {
    password.length >= 8 && password === repeatPassword
      ? userData.push(password)
      : userData.push(0);
  } else {
    password.length >= 8 ? userData.push(password) : userData.push(0);
  }
  return userData;
}

const filterSettings = async function () {
  let endpoint, queryString;
  const [priceRange, ratings, categories] = this;

  const price = [...priceRange.querySelectorAll("input")].map((e) => e.value.trim());
  const rating = [...ratings.querySelectorAll(".star")];

  if (!categories) {
    queryString = `?price=${price.join(",") === "," ? "100,9999" : price.join(",")}&ratings=${
      rating.length || 1
    }`;
    endpoint = "pots";
  } else {
    const input = [...categories?.querySelectorAll("input")]
      .filter((e) => e.checked)
      .map((e) => e.name);

    queryString = `?category=${
      input?.join(",") || "Air purifier,Medicinal herbal,Easy care,Flowering plant"
    }&price=${price.join(",") === "," ? "100,9999" : price.join(",")}&ratings=${
      rating.length || 1
    }`;

    endpoint = "products";
  }

  const data = await model.queryParam(queryString, endpoint);

  view.viewFilterData(data.data.data);
};

const viewForgetPass = function (email) {
  this.parentElement.classList.add("hidden-helper");
  email.classList.remove("hidden-helper");
};

const viewSendForgetEmail = async function (token, e) {
  e.preventDefault();
  const email = this.querySelector("#email-forget").value.trim();

  const response = await model.forgetPassword({ email });
  if (response.status === "success") {
    this.classList.add("hidden-helper");
    token.classList.remove("hidden-helper");
  } else return;
};

const viewChangeForgetPass = function (e) {
  e.preventDefault();
  const token = this.querySelector("#forget-token").value.trim();
  const password = this.querySelector("#newPassword").value.trim();
  const passwordConfirm = this.querySelector("#confirmNewPassword").value.trim();

  if (password !== passwordConfirm) return errorDisplay("passwords dosen't match", "error");

  model.resetForgetPassword({ password, passwordConfirm }, token);
};

const viewMostPopularHandler = async function () {
  let endpoint, queryString;

  queryString = `?ratings=4`;
  endpoint = this.dataset.btn;
  const data = await model.queryParam(queryString, endpoint);

  view.viewFilterData(data.data.data);
};

const viewRatingsHandler = function (e) {
  if (!e.target.classList.contains("icons--star")) return;

  e.target.classList.contains("star")
    ? e.target.classList.remove("star")
    : e.target.classList.add("star");
};

const arrayToObj = (data) => {
  const obj = {};
  for (let d of data) obj[d.name] = d.value.trim();
  return obj;
};

const validateuserData = (data) => data.filter((d) => d.value.trim().length !== 0);

const viewUpdateUserDataHandler = function (e) {
  e.preventDefault();
  const newData = validateuserData(this);

  if (newData[0].value === "India" && newData.length === 1) return;

  const data = arrayToObj(newData);

  model.userDataUpdate(data);
};

const viewUpdateUserPasswordHandler = function (e) {
  e.preventDefault();

  const newData = validateuserData(this);
  if (newData.length < 3) return;

  const data = arrayToObj(newData);

  model.userPasswordUpdate(data);
};

const viewCloseUserAccountHandler = function (e) {
  e.preventDefault();
  const newData = this.value.trim();

  if (newData.length === 0) return;

  const data = { password: newData };

  model.deleteUser(data);
};

const viewUploadUserImage = function () {
  const form = new FormData();
  const photo = this.files[0];
  if (!photo) return;
  form.append("photo", photo, photo.name);

  model.userImageUpdate(form);
};

const viewOverviewCartHandler = function () {
  const items = cartItemAdder("cart", "#overview");
  model.addItemToCart({ product: items, type: "product" });
};

const viewOverViewCheckoutHandler = function () {
  location.assign("/cart");
};

const checkoutSession = function (e) {
  const product = [...this.previousElementSibling.querySelectorAll(".items")].map((ele) => {
    const quantity = +ele.querySelector(".product-count").value;
    return {
      id: ele.dataset.prodid,
      quantity,
      type: ele.dataset.type,
    };
  });

  if (!e.target.classList.contains("checkout-btn")) return;
  model.checkoutSession({ product });
};

function alertMessage() {
  const alert = document.querySelector("body").dataset.alert;
  if (alert) errorDisplay(alert, "success", 10000);
  else return;
}

alertMessage();

////////////////////////////////////////////////////////

const IFEE = function () {
  view.menuToggleHandler(viewMenuHandler, viewHideMenuHandler);
  view.toolTipHandler(viewToolTipHandler);
  view.addLogoutHandler(viewLogoutHandler);
  view.passwordVisibleHandler(viewPasswordVisibleHandler);
  view.authenticateHandler(viewAuthCreate, viewAuthLogin, validateOTP);
  view.addProductHandler(viewProductHandler);
  view.addProductCartFeatures(viewProductCartHandler);
  view.checkOutHandler(calcProductItemsHandler);
  view.addUserSettingToggler(viewUserSettingsToggleHandler);
  view.addModifyUserData(viewUpdateUserDataHandler);
  view.addUploadUserImage(viewUploadUserImage);
  view.addModifyUserPass(viewUpdateUserPasswordHandler);
  view.addCloseUserAccount(viewCloseUserAccountHandler);
  view.addRatingsHandler(viewRatingsHandler);
  view.addFilterHandler(filterSettings);
  view.addMostPopularHandler(viewMostPopularHandler);
  view.addForgetPassHandler(viewForgetPass);
  view.addSendForgetEmail(viewSendForgetEmail);
  view.addChangeForgetPass(viewChangeForgetPass);
  view.addWishlistFeatures(viewWishlistFeatureHandler);
  view.addCheckoutSession(checkoutSession);
  view.addProductOverviewHandler(viewOverviewCartHandler, viewOverViewCheckoutHandler);
};

IFEE();
