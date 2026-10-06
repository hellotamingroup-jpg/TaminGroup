(function () {
  "use strict";

  var EMAIL = "hello.tamingroup@gmail.com";

  // Адрес сервиса приёма форм, например "https://formspree.io/f/xxxxxxxx".
  // Пока строка пустая, форма копирует текст сообщения вместо отправки.
  var FORM_ENDPOINT = "";

  var form = document.getElementById("contact-form");
  var status = document.getElementById("f-status");
  var button = form.querySelector("button[type=submit]");

  function copyText(text) {
    try {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return false; });
    } catch (err) {
      return Promise.resolve(false);
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("f-name").value.trim();
    var mail = document.getElementById("f-email").value.trim();
    var text = document.getElementById("f-msg").value.trim();

    if (!name || !mail || !text) {
      status.textContent = "Заполните имя, почту и сообщение.";
      return;
    }

    if (!FORM_ENDPOINT) {
      var plain = "Имя: " + name + "\nПочта: " + mail + "\n\n" + text;
      copyText(plain).then(function (ok) {
        status.textContent = ok
          ? "Форма пока не подключена. Текст скопирован, отправьте его на " + EMAIL + "."
          : "Форма пока не подключена. Скопируйте текст вручную и отправьте на " + EMAIL + ".";
      });
      return;
    }

    button.disabled = true;
    status.textContent = "Отправляем…";
    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, email: mail, message: text })
    }).then(function (res) {
      if (!res.ok) { throw new Error("bad status " + res.status); }
      form.reset();
      status.textContent = "Сообщение отправлено. Мы ответим на указанную почту.";
    }).catch(function () {
      status.textContent = "Не удалось отправить. Напишите нам на " + EMAIL + ".";
    }).then(function () {
      button.disabled = false;
    });
  });

  var copyBtn = document.getElementById("copy-mail");
  var copyStatus = document.getElementById("copy-status");
  copyBtn.addEventListener("click", function () {
    copyText(EMAIL).then(function (ok) {
      if (ok) {
        copyStatus.textContent = "Адрес скопирован.";
      } else {
        var range = document.createRange();
        range.selectNodeContents(document.getElementById("mail-addr"));
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        copyStatus.textContent = "Адрес выделен, скопируйте его вручную.";
      }
    });
  });
})();
