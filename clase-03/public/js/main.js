document.getElementById("readCookies").addEventListener("click", function () {
  fetch("/api/cookies/getCookies")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
});

document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  fetch("/api/cookies/setCookies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
});
