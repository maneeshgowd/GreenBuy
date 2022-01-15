/* eslint-disable */
"use strict";

import view from "./view";
import "regenerator-runtime/runtime";
import "core-js";
// import leaf_1 from "url:../img/leaf-1.jpg";
// import leaf_2 from "url:../img/leaf-2.jpg";
// import leaf_3 from "url:../img/leaf-3.jpg";
// import eye from "url:../icons/eye.svg";
// import eyeOff from "url:../icons/eye-off.svg";

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

const viewWishlistHandler = function () {
  const classs = "wishlist-wishlist";
  !this.classList.contains(classs) ? this.classList.add(classs) : this.classList.remove(classs);
};

const addToCart = function () {
  const cartAnim = document.getElementById("cart-anim");
  cartAnim.classList.remove("hidden-helper");
  this.classList.add("cart--helper");
  setTimeout(() => cartAnim.classList.add("hidden-helper"), 1000);
};

const viewProductHandler = function (e) {
  if (e.target.id === "wishlist-icon") viewWishlistHandler.call(e.target);
  if (e.target.id === "add-cart-btn") addToCart.call(e.target);
};

const viewAuthLogin = function (e, inputArr) {
  e.preventDefault();
  const [email, password] = inputArr;

  const validatedData = userAuthenticator(email.value.trim(), password.value.trim());
  if (validatedData.includes(0)) return console.log("error");

  this.querySelector(".form__btn").textContent = "Please wait...";
};

const viewPasswordVisibleHandler = function (loginPassword) {
  if (loginPassword.type === "password") {
    loginPassword.type = "text";
    this.src = eye;
  } else {
    loginPassword.type = "password";
    this.src = eyeOff;
  }
};

const viewAuthCreate = function (e, inputArr) {
  e.preventDefault();
  const [name, email, password, repeatPassword] = inputArr;

  const validatedData = userAuthenticator(
    email.value.trim(),
    password.value.trim(),
    repeatPassword.value.trim()
  );

  if (validatedData.includes(0)) return console.log("error");

  this.querySelector(".form__btn").textContent = "Please wait...";
};

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

//TODO function errorHandler() {}

function userAuthenticator(email, password, repeatPassword) {
  const userData = [];

  const validate =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  validate.test(email) ? userData.push(email) : userData.push(0);

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
  // view.mainAnimationHandler(viewMainAnimHandler);
  view.passwordVisibleHandler(viewPasswordVisibleHandler);
  view.authenticateHandler(viewAuthCreate, viewAuthLogin);
  view.addProductHandler(viewProductHandler);
  view.addUserSettingToggler(viewUserSettingsToggleHandler);
};

IFEE();

// const observerObj = {
//   root: null,
//   threshold: 0,
//   rootMargin: "-90px",
// };

// const callbackObserver = function (entries, intersection) {
//   const header = document.getElementById("index-header");
//   const [entry] = entries;
//   if (!entry.isIntersecting) header.classList.add("sticky-nav");
//   else header.classList.remove("sticky-nav");
// };

// const intersection = new IntersectionObserver(callbackObserver, observerObj);
// const section = document.getElementById("top");
// intersection.observe(section);
