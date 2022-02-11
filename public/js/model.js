////////////////////////==== USER AUTH ====//////////////////////////
import errorDisplay from "./error";

export const queryParam = async function (queryString, endPoint) {
  try {
    const request = await fetch(`/api/v1/${endPoint}${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },

      mode: "cors",
    });

    const response = await request.json();
    if (response.status !== "success") throw new Error(response.message);
    return response;
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};

export const userLogin = async function (data) {
  try {
    const request = await fetch(`/api/v1/users/login`, {
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
    const request = await fetch(`/api/v1/users/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });

    const response = await request.json();
    if (response.status === "success") {
      errorDisplay("Logged out!", "success");
      window.setTimeout(() => location.assign("/"), 1000);
    }
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};

export const userSignup = async function (data, endPoint) {
  try {
    const request = await fetch(`/api/v1/users/${endPoint}`, {
      method: `POST`,
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(data),
    });

    const response = await request.json();

    if (response.status !== "success") throw new Error(response.message);

    if (endPoint === "signup") window.setTimeout(() => location.assign("/"), 1000);

    return response;
  } catch (err) {
    throw err;
  }
};

export const userDataUpdate = async function (data) {
  try {
    const request = await fetch(`/api/v1/users/updateMe`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },

      mode: "cors",
      body: JSON.stringify(data),
    });

    const response = await request.json();

    if (response.status !== "success") throw new Error(response.message);

    errorDisplay("Data updated successfully!", "success");
    window.setTimeout(() => location.assign("/my-account"), 1000);
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};

export const userImageUpdate = async function (data) {
  try {
    const request = await fetch(`/api/v1/users/updateMe`, {
      method: "PATCH",
      mode: "cors",
      body: data,
    });

    const response = await request.json();
    if (response.status !== "success") throw new Error(response.message);

    errorDisplay("Image updated successfully!", "success");
    window.setTimeout(() => location.assign("/my-account"), 1000);
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};

export const userPasswordUpdate = async function (data) {
  try {
    const request = await fetch(`/api/v1/users/updateMyPassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },

      mode: "cors",
      body: JSON.stringify(data),
    });

    const response = await request.json();

    if (response.status !== "success") throw new Error(response.message);

    errorDisplay("Password updated successfully!", "success");
    logoutUser();
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};

export const deleteUser = async function (data) {
  try {
    const request = await fetch(`/api/v1/users/deleteMe`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(data),
    });

    const response = await request.json();

    if (response.status !== "success") throw new Error(response.message);

    errorDisplay("Deleted user!", "success");
    window.setTimeout(() => location.assign("/login"), 1500);
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};

//================== forget-password===============

export const forgetPassword = async function (email) {
  try {
    const request = await fetch(`/api/v1/users/forgotPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(email),
    });

    const response = await request.json();

    if (response.status !== "success") throw new Error(response.message);

    errorDisplay("Token sent to your email address!", "success");

    return response;
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};

export const resetForgetPassword = async function (data, token) {
  try {
    const request = await fetch(`/api/v1/users/resetPassword/${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(data),
    });

    const response = await request.json();

    if (response.status !== "success") throw new Error(response.message);

    errorDisplay("Password updated successfully!", "success");
    window.setTimeout(() => location.assign("/login"), 1000);
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};

/////////////////////////====CART ITEMS====/////////////////////////////////////
// Add item to wishlist

export const addItemToCart = async function (data) {
  try {
    const request = await fetch(`/api/v1/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      mode: "cors",
      body: JSON.stringify(data),
    });

    const response = await request.json();
    if (response.status !== "success") throw new Error("Unable to add item to cart!");
    errorDisplay(`Item added to cart!`, "success");
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};

export const updateCartWishlist = async function (data, endPoint) {
  try {
    const request = await fetch(`/api/v1/${endPoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },

      mode: "cors",
      body: JSON.stringify(data),
    });

    const response = await request.json();
    if (response.status !== "success") throw new Error(response.message);
    errorDisplay(response.message, "success");
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};

export const addItemToWishlit = async function (data) {
  try {
    const request = await fetch(`/api/v1/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(data),
    });

    const response = await request.json();
    if (response.status !== "success") throw new Error("Unable to add item to wishlist!");
    errorDisplay(`Item added to wishlist!`, "success");
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};

// checkput-session

export const checkoutSession = async function (data) {
  try {
    const session = await fetch(`/api/v1/bookings/checkout-session/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",

      body: JSON.stringify(data),
    });
    errorDisplay("Please wait...", "success", 10000);

    const sessionData = await session.json();

    window.location.href = sessionData.url;
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};

export const viewBookings = async function () {
  try {
    const request = await fetch("/my-bookings");
    const response = await request.json();
    return response;
  } catch (err) {
    errorDisplay(`${err.message}`, "error");
  }
};
