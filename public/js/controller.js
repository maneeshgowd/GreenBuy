/* eslint-disable */
"use strict";

import "regenerator-runtime";
import "core-js/stable";
import view from "./view";
import * as model from "./model";
import errorDisplay from "./error";

// VIEW LOGIC

const viewMainAnimHandler = function (main, mainTitle) {
  if (!main) return;

  const imageArr = [leaf_1, leaf_2, leaf_3];

  const textArr = [
    "easy to care plants with nutrients rich soil",
    "harnessing the beauty of your home decor",
    "plants that reflects your personality",
  ];

  let count = 0;

  // setInterval(() => main.classList.add("image-anim"), 3990);

  // setInterval(() => {
  //   if (count === 3) count = 0;
  //   main.classList.remove("image-anim");
  //   main.src = imageArr[count];
  //   mainTitle.innerText = textArr[count];
  //   count++;
  // }, 4000);

  return;
};

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

const viewWishlistHandler = function () {
  const classs = "wishlist-wishlist";
  !this.classList.contains(classs) ? this.classList.add(classs) : this.classList.remove(classs);
};

// SEND: TO CART

const addToCart = function () {
  const cartAnim = this.closest("#product").querySelector("#cart-anim");
  cartAnim.classList.remove("hidden-helper");
  this.classList.add("cart--helper");
  setTimeout(() => cartAnim.classList.add("hidden-helper"), 1000);
  this.setAttribute("disabled", true);
};

const viewProductHandler = function (e) {
  if (e.target.id === "wishlist-icon") {
    viewWishlistHandler.call(e.target);
  }

  if (e.target.id === "add-cart-btn") {
    addToCart.call(e.target);
  }

  if (e.target.id === "wishlist-icon" || e.target.id === "add-cart-btn") {
    e.target.closest("#product").setAttribute("href", "#");
  }
  if (e.target.id === "product") e.target.setAttribute("href", e.target.dataset.attr);
};

const viewAuthLogin = function (e, inputArr) {
  e.preventDefault();
  const [email, password] = inputArr;

  const validatedData = userAuthenticator(email.value.trim(), password.value.trim());
  if (validatedData.includes(0)) return;

  this.querySelector(".form__btn").textContent = "Please wait...";

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

const viewProductCountHandler = function (e) {
  const input = this.querySelector("input");
  const val = +input.value;
  if (e.target.classList.contains("btn--increment")) {
    input.value = val >= 10 ? 10 : val + 1;
  }
  if (e.target.classList.contains("btn--decrement")) {
    input.value = val <= 1 ? 1 : val - 1;
  }
};

const viewAuthCreate = async function (e, inputArr) {
  e.preventDefault();
  const [name, email, password, repeatPassword] = inputArr;

  const validatedData = userAuthenticator(
    email.value.trim(),
    password.value.trim(),
    repeatPassword.value.trim(),
    name.value.trim()
  );
  if (validatedData.includes(0)) return errorDisplay("Passwords dosen't match");

  this.querySelector(".form__btn").textContent = "Please wait...";

  const userData = {
    name: validatedData[1],
    email: validatedData[0],
    password: validatedData[2],
    passwordConfirm: validatedData[2],
  };

  const otp = await model.userSignup(userData, "validate");

  if (otp.status !== "success") return errorDisplay(otp.message, "error");

  sessionStorage.setItem("OTP", otp.OTP);
  sessionStorage.setItem("data", JSON.stringify(userData));

  this.classList.add("hidden-helper");

  this.nextElementSibling.classList.remove("hidden-helper");
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

const viewUserSettingsToggleHandler = function (e, buttons, sections) {
  const [passwordInfo, personelInfo, myOrders, closeInfo] = sections;
  if (!e.target.classList.contains("user-settings-btn")) return;

  buttons.forEach((ele) => ele.parentElement.classList.remove("info--btn"));
  e.target.parentElement.classList.add("info--btn");

  sections.forEach((ele) => ele.classList.add("hidden-helper"));

  if (e.target.id === "user-personel-info") personelInfo.classList.remove("hidden-helper");
  if (e.target.id === "user-password") passwordInfo.classList.remove("hidden-helper");
  if (e.target.id === "user-orders") myOrders.classList.remove("hidden-helper");
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

////////////////////////////////////////////////////////

const IFEE = function () {
  view.menuToggleHandler(viewMenuHandler, viewHideMenuHandler);
  view.toolTipHandler(viewToolTipHandler);
  view.addLogoutHandler(viewLogoutHandler);
  // view.mainAnimationHandler(viewMainAnimHandler);
  view.passwordVisibleHandler(viewPasswordVisibleHandler);
  view.authenticateHandler(viewAuthCreate, viewAuthLogin, validateOTP);
  view.addProductHandler(viewProductHandler);
  view.addProductCounter(viewProductCountHandler);
  view.addUserSettingToggler(viewUserSettingsToggleHandler);
};

IFEE();



// TODO : 1. filter, 2. Wishlist , 3. Cart, 4. Animation, 4. user-edit 5. resetpassword 6. image compress