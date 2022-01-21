////////////////////////==== USER AUTH ====//////////////////////////
import errorDisplay from "./error";

export const userLogin = async function (data) {
  try {
    const request = await fetch(`http://127.0.0.1:7000/api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      mode: "cors",
      body: JSON.stringify(data),
    });

    const response = await request.json();

    if (response.status !== "success") return errorDisplay(`${response.message}`, "error");

    errorDisplay(`${response.message}`, "success");

    window.setTimeout(() => location.assign("/"), 1000);
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};

export const logoutUser = async function () {
  try {
    const request = await fetch(`http://127.0.0.1:7000/api/v1/users/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });

    const response = await request.json();
    if (response.status === "success"){
      errorDisplay('Logged out!','success');
      window.setTimeout(() => location.assign("/"), 1000);
    };
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};

export const userSignup = async function (data, endPoint) {
  try {
    const request = await fetch(`http://127.0.0.1:7000/api/v1/users/${endPoint}`, {
      method: `POST`,
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(data),
    });

    const response = await request.json();

    if (response.status !== "success") throw new Error("Something went wrong. Please try again!");

    if (endPoint === "signup") window.setTimeout(() => location.assign("/"), 1000);

    return response;
  } catch (err) {
    throw err;
  }
};

export const userDataUpdate = async function (data) {
  try {
    const request = await fetch(`http://127.0.0.1:7000/api/v1/users/updateMe`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },

      mode: "cors",
      body: JSON.stringify(data),
    });

    const response = await request.json();
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};

/////////////////////////====CART ITEMS====/////////////////////////////////////
// Add item to wishlist

export const addItemToCart = async function (data) {
  try {
    const request = await fetch(`http://127.0.0.1:7000/api/v1/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      mode: "cors",
      body: JSON.stringify(data),
    });

    const response = await request.json();
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};

export const addItemToWishlit = async function (data) {
  try {
    const request = await fetch(`http://127.0.0.1:7000/api/v1/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(data),
    });

    const response = await request.json();
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};
