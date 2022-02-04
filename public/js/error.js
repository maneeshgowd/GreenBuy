export default function errorDisplay(errMsg, classlist = "error",time=5000) {
  const message = `<h1 class="error-msg ${classlist}">${errMsg}</h1>`;
  const body = document.querySelector("body");

  if (body.querySelector(".error-msg")) body.removeChild(body.querySelector(".error-msg"));

  body.insertAdjacentHTML("afterbegin", message);

  window.setTimeout(() => body.querySelector(".error-msg") && body.removeChild(body.querySelector(".error-msg")), time);
}
