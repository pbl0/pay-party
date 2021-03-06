// ==UserScript==
// @name        pay-party
// @namespace   https://pablobls.tech/
// @match        *://rivalregions.com/#listed/party/*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.0.1
// @author      Pablo
// @description
// @downloadURL https://github.com/pbl0/pay-party/raw/main/pay-party.user.js
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// ==/UserScript==

// =============================================================== //

var sueldo1;
var sueldo2;
var sueldo3;
var sueldo4;
var sueldo5;

var listaSueldo2;
var listaSueldo3;
var listaSueldo4;
var listaSueldo5;

var lastPayDate = GM_getValue("last-pay", "null");
var lstPagar = [];

$(document).ready(function () {
  init();
  $("#header_slide").append(
    `<button id="startButton">Start</button><span id="my-last-pay" class="name_input additional"> ${lastPayDate} </span>`
  );
  $("#startButton").click(function () {
    start();
    console.log("started");
  });
});

function init() {
  sueldo1 = GM_getValue("sueldo1"); // 10;
  sueldo2 = GM_getValue("sueldo2"); // 15;
  sueldo3 = GM_getValue("sueldo3"); // 17;
  sueldo4 = GM_getValue("sueldo4"); // 20;
  sueldo5 = GM_getValue("sueldo5"); // 25;

  if (!sueldo1) {
    sueldo1 = 10;
    GM_setValue("sueldo1", sueldo1);
  }
  if (!sueldo2) {
    sueldo2 = 15;
    GM_setValue("sueldo2", sueldo2);
  }
  if (!sueldo3) {
    sueldo3 = 17;
    GM_setValue("sueldo3", sueldo3);
  }
  if (!sueldo4) {
    sueldo4 = 20;
    GM_setValue("sueldo4", sueldo4);
  }
  if (!sueldo5) {
    sueldo5 = 25;
    GM_setValue("sueldo5", sueldo5);
  }

  listaSueldo2 = GM_getValue("lista-sueldo2"); // [];
  listaSueldo3 = GM_getValue("lista-sueldo3"); // [];
  listaSueldo4 = GM_getValue("lista-sueldo4"); // [];
  listaSueldo5 = GM_getValue("lista-sueldo5"); // [];

  const defLista = [];
  if (!listaSueldo2) {
    listaSueldo2 = [];
    GM_setValue("lista-sueldo2", defLista);
  }
  if (!listaSueldo3) {
    listaSueldo3 = [];
    GM_setValue("lista-sueldo3", defLista);
  }
  if (!listaSueldo4) {
    listaSueldo4 = [];
    GM_setValue("lista-sueldo4", defLista);
  }
  if (!listaSueldo5) {
    listaSueldo5 = [];
    GM_setValue("lista-sueldo5", defLista);
  }
}

function start() {
  $("#startButton").remove();
  var timer = setInterval(function () {
    try {
      if ($("#list_last").attr("style") === undefined) {
        throw "end";
      }
      $("#list_last").trigger("click");
      console.log("clicked");
    } catch (e) {
      console.log(e);
      clearInterval(timer);

      filtrarMiembros();
    }
  }, 2000);
}

function addPayButton() {
  $("#header_slide").append('<button id="payButton">pay</button>');
  $("#payButton").click(function () {
    pagarMiembros();
    $("#payButton").remove();
  });
}

function filtrarMiembros() {
  let count = 0;
  $(".list_name").each(function () {
    if (
      $(this).html().includes("✔") == false ||
      $(this).siblings(".list_helper").length ||
      $(this).siblings(".list_head").length
    ) {
      $(this).parent().remove();
    } else {
      count += 1;
      const profileId = $(this).parent().attr("user");
      lstPagar.push(profileId);
      console.log(count, profileId);
    }
  });


  addPayButton();
  console.log(lstPagar);
}

function pagarMiembro(profileId) {
  const sueldo = definirSueldo(profileId);

  $.ajax({
    type: "POST",
    data: {
      whom: profileId,
      type: "0",
      c: c_html,
      n: sueldo.toString() + "000000000"
    },
    url: "/storage/donate",
    success: function (data) {
      console.log("pagado", data);
      $(`tr[user=${profileId}]`).css("background-color", "green");
    },
  });
}

function pagarMiembros() {
  const payInterval = setInterval(function () {
    const profileId = lstPagar[0];
    pagarMiembro(profileId);
    lstPagar.shift();
    if (lstPagar.length === 0) {
      // Fin
      clearInterval(payInterval);
      lastPayDate = new Date().toLocaleString();
      GM_setValue("last-pay", lastPayDate);
      $("#my-last-pay").text(lastPayDate);

    }
  }, 2000);
}

function definirSueldo(profileId) {
  if (listaSueldo5.includes(profileId)) {
    return sueldo5;
  } else if (listaSueldo4.includes(profileId)) {
    return sueldo4;
  } else if (listaSueldo3.includes(profileId)) {
    return sueldo3;
  } else if (listaSueldo2.includes(profileId)) {
    return sueldo2;
  } else {
    return sueldo1;
  }
}
