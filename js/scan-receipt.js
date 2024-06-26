document.addEventListener("DOMContentLoaded", function () {
  var correctionText = document.getElementById("correction");
  var shareText = document.getElementById("share-box");
  var saveText = document.getElementById("save-box");
  var sum = document.getElementById("sum");
  var tax = document.getElementById("tax");
  var titleText = document.getElementById("logo-title");
  var listHeaderDiv = document.querySelector("#list-header div");
  var listAddButton = document.querySelector(".list-add");
  var listBody = document.getElementById("list-body");
  var listItems = document.querySelectorAll(".list");
  var listContainer = document.getElementById("receipt-container");
  var selectedItem = null;
  var shareBox = null;
  var overlay = document.createElement("div");
  var dateElement = document.getElementById("receipt-date");
  var datePicker = document.createElement("div");
  var dateBorder = document.createElement("hr");
  var dateButton = document.createElement("div");
  var startDate = document.getElementById("start-date");

  // 날짜 선택기 초기화 확인 플래그
  var datePickerInitialized = false;

  // date-picker
  overlay.className = "overlay";
  datePicker.className = "date-picker";
  dateBorder.className = "hr";
  dateButton.classList = "date-button";
  dateButton.textContent = "선택하기";

  dateElement.addEventListener("click", function () {
    overlay.style.display = "block";
    datePicker.style.display = "block";
  });

  document.body.appendChild(overlay);
  document.body.appendChild(datePicker);

  function createDatePickerCalendar() {
    if (datePickerInitialized) return;
    datePickerInitialized = true;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const datePicker = document.querySelector(".date-picker");
    let selectedDate = null;

    const setCalendar = (year, month) => {
      datePicker.innerHTML = "";

      const navigation = document.createElement("div");
      navigation.className = "calendar-navigation";
      navigation.style.display = "flex";
      navigation.style.fontSize = "14px";
      navigation.style.columnGap = "14px";
      navigation.style.fontWeight = "bold";
      navigation.style.alignItems = "center";
      navigation.style.justifyContent = "center";
      navigation.style.fontFamily = "NanumSquareRound";
      datePicker.appendChild(navigation);
      datePicker.appendChild(dateBorder);

      const prevButton = document.createElement("p");
      prevButton.textContent = "<";
      prevButton.style.color = "#2C2C2C";
      prevButton.style.marginTop = "32px";
      prevButton.onclick = () => {
        if (month === 0) {
          month = 11;
          year -= 1;
        } else {
          month -= 1;
        }
        setCalendar(year, month);
      };
      navigation.appendChild(prevButton);

      const title = document.createElement("div");
      title.className = "calendar-title";
      title.style.fontSize = "14px";
      title.style.marginTop = "32px";
      title.textContent = `${year}. ${String(month + 1).padStart(2, "0")}`;
      navigation.appendChild(title);

      const nextButton = document.createElement("p");
      nextButton.textContent = ">";
      nextButton.style.color = "#2C2C2C";
      nextButton.style.marginTop = "32px";
      nextButton.onclick = () => {
        if (month === 11) {
          month = 0;
          year += 1;
        } else {
          month += 1;
        }
        setCalendar(year, month);
      };
      navigation.appendChild(nextButton);

      const days = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];
      const daysRow = document.createElement("div");
      daysRow.className = "calendar-days-row";
      days.forEach((day) => {
        const dayElement = document.createElement("div");
        dayElement.className = "calendar-day-header";
        dayElement.textContent = day;
        daysRow.appendChild(dayElement);
      });
      datePicker.appendChild(daysRow);

      const firstDay = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();

      const datesGrid = document.createElement("div");
      datesGrid.className = "calendar-dates-grid";

      for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-date empty";
        datesGrid.appendChild(emptyCell);
      }

      for (let date = 1; date <= lastDate; date++) {
        const dateCell = document.createElement("div");
        dateCell.className = "calendar-date";
        dateCell.textContent = date;
        dateCell.onclick = () => {
          if (selectedDate) {
            selectedDate.style.color = "#707174";
          }
          dateCell.style.color = "#ED4B62";
          dateCell.classList.add("selected");
          selectedDate = dateCell;
          startDate.textContent = `${year}. ${String(month + 1).padStart(
            2,
            "0"
          )}. ${String(date).padStart(2, "0")}`;
        };
        datesGrid.appendChild(dateCell);
      }
      datePicker.appendChild(datesGrid);
      datePicker.appendChild(dateButton);
    };
    setCalendar(year, month);

    dateButton.addEventListener("click", function () {
      overlay.style.display = "none";
      datePicker.style.display = "none";
      selectingStartDate = true;
    });
  }
  createDatePickerCalendar();

  function calculateInitialSum() {
    var total = 0;
    var prices = document.querySelectorAll(".list-price");
    prices.forEach(function (price) {
      total += parseFloat(price.textContent);
    });
    sum.textContent = total;
  }
  calculateInitialSum();

  function addDeleteButtons() {
    listItems.forEach(function (item) {
      var deleteButton = document.createElement("img");
      deleteButton.src = "../../img/delete.png";
      deleteButton.alt = "삭제";
      deleteButton.style.width = "10px";
      deleteButton.style.height = "10px";
      deleteButton.style.cursor = "pointer";
      deleteButton.style.marginLeft = "12px";
      deleteButton.classList.add("delete-button");
      item.appendChild(deleteButton);

      deleteButton.addEventListener("click", function () {
        item.remove();
        listContainer.style.height =
          parseInt(getComputedStyle(listContainer).height) - 35 + "px";
        calculateSum();
      });

      var itemName = item.querySelector(".list-name");
      var itemCnt = item.querySelector(".list-cnt");
      var itemPrice = item.querySelector(".list-price");

      var itemNameInput = document.createElement("input");
      itemNameInput.type = "text";
      itemNameInput.value = itemName.textContent;
      itemNameInput.classList.add("list-name-input");

      var itemCntInput = document.createElement("input");
      itemCntInput.type = "number";
      itemCntInput.value = itemCnt.textContent;
      itemCntInput.classList.add("list-cnt-input");

      var itemPriceInput = document.createElement("input");
      itemPriceInput.type = "number";
      itemPriceInput.value = itemPrice.textContent;
      itemPriceInput.classList.add("list-price-input");

      var taxInput = document.createElement("input");
      taxInput.type = "number";
      taxInput.value = tax.textContent;
      taxInput.classList.add("tax-input");
      taxInput.style.outline = "none";
      taxInput.style.textAlign = "right";
      taxInput.style.borderRadius = "4px";
      taxInput.style.fontFamily = "Pretendard";
      taxInput.style.border = "1px solid rgb(240, 242, 246)";
      tax.replaceWith(taxInput);

      itemName.replaceWith(itemNameInput);
      itemCnt.replaceWith(itemCntInput);
      itemPrice.replaceWith(itemPriceInput);
    });
  }

  correctionText.addEventListener("click", function () {
    if (correctionText.textContent === "수정") {
      correctionText.textContent = "완료";
      titleText.textContent = "수정";
      listItems.forEach(function (item) {
        item.style.padding = "12px";
        item.style.borderRadius = "8px";
        item.style.border = "1px solid #F0F2F6";
      });
      listContainer.style.height =
        parseInt(getComputedStyle(listContainer).height) + 56 + "px";
      listAddButton.style.display = "block";
      addDeleteButtons();
      shareText.classList.remove("disabled");
      document.querySelector(".tax-input").disabled = false;
      document.querySelector(".tax-input").style.borderRadius = "4px";
      document.querySelector(".tax-input").style.paddingRight = "8px";
      document.querySelector(".tax-input").style.border = "1px solid #F0F2F6";

      document
        .querySelectorAll(
          ".list-name-input, .list-cnt-input, .list-price-input"
        )
        .forEach((input) => {
          input.addEventListener("input", calculateSum);
        });
      document.querySelector(".tax-input").addEventListener("input", updateTax); // 소비세 업데이트
      calculateSum();
    } else {
      correctionText.textContent = "수정";
      titleText.textContent = "영수증";
      listItems.forEach(function (item) {
        item.style.border = "none";
        item.style.padding = "0";
        item.style.borderRadius = "0";
      });
      listHeaderDiv.style.columnGap = "70px";
      listContainer.style.height =
        parseInt(getComputedStyle(listContainer).height) - 56 + "px";
      listAddButton.style.display = "none";
      removeDeleteButtons();
      shareText.classList.add("disabled");
      document.querySelector(".tax-input").disabled = true;
      document.querySelector(".tax-input").style.border = "none";
      document.querySelector(".tax-input").style.paddingRight = "0";
      document.querySelector(".tax-input").style.background = "none";
    }
  });

  function updateTax() {
    tax.textContent = document.querySelector(".tax-input").value;
  }

  shareText.addEventListener("click", function () {
    if (correctionText.textContent !== "완료") {
      return;
    }

    if (shareText.textContent === "나누기") {
      shareText.textContent = "취소";
      saveText.textContent = "다음";
      shareText.style.color = "#707174";
      shareText.style.backgroundColor = "#F0F2F6";

      setTimeout(function () {
        shareText.style.color = "";
        shareText.style.backgroundColor = "";
      }, 500);

      shareBox = document.createElement("div");
      shareBox.style.color = "#FFF";
      shareBox.style.width = "320px";
      shareBox.style.height = "39px";
      shareBox.style.display = "flex";
      shareBox.style.fontSize = "14px";
      shareBox.style.marginTop = "35px";
      shareBox.style.borderRadius = "8px";
      shareBox.style.alignItems = "center";
      shareBox.style.padding = "8px 0 8px 14px";
      shareBox.style.backgroundColor = "#464D57";
      shareBox.textContent = "같이 산 물건을 선택해주세요";
      listContainer.appendChild(shareBox);

      var listInputs = document.querySelectorAll(".list input");
      listInputs.forEach(function (input) {
        input.disabled = true;
        input.style.background = "none";
      });

      listItems.forEach(function (item) {
        item.addEventListener("click", function (event) {
          toggleBorder(event);
          saveText.textContent = "선택"; // Save text를 '선택'으로 변경
        });
      });
    } else {
      shareText.textContent = "나누기";
      saveText.textContent = "저장하기";
      var listInputs = document.querySelectorAll(".list input");
      listInputs.forEach(function (input) {
        input.disabled = false;
      });

      listItems.forEach(function (item) {
        item.removeEventListener("click", toggleBorder);
        item.style.background = "#FFF";
        item.style.border = "1px solid #F0F2F6";
      });

      if (shareBox) {
        shareBox.style.display = "none";
      }
    }
  });

  saveText.addEventListener("click", function () {
    if (saveText.textContent === "선택" && selectedItem) {
      var overlay = document.createElement("div");
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.zIndex = "999";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.opacity = "0.1";
      overlay.style.position = "fixed";
      overlay.style.backgroundColor = "#000";
      document.body.appendChild(overlay);

      var shareDiv = document.createElement("div");
      shareDiv.style.left = "50%";
      shareDiv.style.bottom = "0";
      shareDiv.style.width = "360px";
      shareDiv.style.zIndex = "1000";
      shareDiv.style.height = "348px";
      shareDiv.style.padding = "20px";
      shareDiv.style.display = "flex";
      shareDiv.style.position = "fixed";
      shareDiv.style.background = "#FFF";
      shareDiv.style.alignItems = "center";
      shareDiv.style.flexDirection = "column";
      shareDiv.style.border = "1px solid #ccc";
      shareDiv.style.fontFamily = "Pretendard";
      shareDiv.style.justifyContent = "center";
      shareDiv.style.transform = "translateX(-50%)";
      shareDiv.style.borderRadius = "20px 20px 0 0";

      var shareText = document.createElement("p");
      shareText.textContent = "몇 명과 나누시겠습니까?";

      var selectedItemClone = selectedItem.cloneNode(true);
      var deleteButton = selectedItemClone.querySelector(".delete-button");
      deleteButton.remove();
      selectedItemClone.style.marginTop = "16px";
      selectedItemClone.style.background = "none";
      selectedItemClone.style.border = "1px solid #F0F2F6";

      var shareControls = document.createElement("div");
      shareControls.style.display = "flex";
      shareControls.style.columnGap = "20px";
      shareControls.style.alignItems = "center";
      shareControls.style.margin = "22px 0 40px 0";
      shareControls.style.justifyContent = "space-between";

      var shareMinus = document.createElement("button");
      shareMinus.textContent = "-";
      shareMinus.style.width = "32px";
      shareMinus.style.height = "32px";
      shareMinus.style.border = "none";
      shareMinus.style.color = "#707174";
      shareMinus.style.fontSize = "24px";
      shareMinus.style.borderRadius = "100%";
      shareMinus.style.fontFamily = "Pretendard";
      shareMinus.style.backgroundColor = "#F0F2F6";

      var itemCntInput = selectedItem.querySelector(".list-cnt-input");
      var initialShareValue = parseInt(itemCntInput.value, 10);

      var shareValue = document.createElement("div");
      shareValue.textContent = initialShareValue;
      shareValue.style.width = "100px";
      shareValue.style.height = "100px";
      shareValue.style.display = "flex";
      shareValue.style.color = "#ED4B62";
      shareValue.style.fontSize = "40px";
      shareValue.style.fontWeight = "bold";
      shareValue.style.textAlign = "center";
      shareValue.style.alignItems = "center";
      shareValue.style.borderRadius = "100%";
      shareValue.style.fontFamily = "Pretendard";
      shareValue.style.justifyContent = "center";
      shareValue.style.border = "2px solid #ED4B62";

      var sharePlus = document.createElement("button");
      sharePlus.textContent = "+";
      sharePlus.style.width = "32px";
      sharePlus.style.height = "32px";
      sharePlus.style.border = "none";
      sharePlus.style.color = "#707174";
      sharePlus.style.fontSize = "24px";
      sharePlus.style.borderRadius = "100%";
      sharePlus.style.fontFamily = "Pretendard";
      sharePlus.style.backgroundColor = "#F0F2F6";

      shareMinus.onclick = function () {
        var currentValue = parseInt(shareValue.textContent, 10);
        if (currentValue > 1) {
          shareValue.textContent = currentValue - 1;
        }
      };

      sharePlus.onclick = function () {
        var currentValue = parseInt(shareValue.textContent, 10);
        shareValue.textContent = currentValue + 1;
      };

      shareControls.appendChild(shareMinus);
      shareControls.appendChild(shareValue);
      shareControls.appendChild(sharePlus);

      var shareButton = document.createElement("button");
      shareButton.textContent = "완료";
      shareButton.style.color = "#FFF";
      shareButton.style.width = "320px";
      shareButton.style.border = "none";
      shareButton.style.height = "46px";
      shareButton.style.fontSize = "14px";
      shareButton.style.borderRadius = "8px";
      shareButton.style.fontFamily = "Pretendard";
      shareButton.style.backgroundColor = "#ED4B62";

      shareButton.onclick = function () {
        var shareAmount = parseInt(shareValue.textContent);
        var itemCntInput = selectedItem.querySelector(".list-cnt-input");
        var itemPriceInput = selectedItem.querySelector(".list-price-input");

        var originalCnt = parseFloat(itemCntInput.value);
        var originalPrice = parseFloat(itemPriceInput.value);

        var oldCntContainer = document.createElement("p");
        oldCntContainer.style.textDecoration = "line-through";
        oldCntContainer.textContent = itemCntInput.value;
        oldCntContainer.classList.add("list-cnt");

        var oldPriceContainer = document.createElement("p");
        oldPriceContainer.style.textDecoration = "line-through";
        oldPriceContainer.textContent = itemPriceInput.value;
        oldPriceContainer.classList.add("list-price");

        var newCnt = document.createElement("p");
        newCnt.textContent = originalCnt + "/" + shareAmount;
        newCnt.style.color = "#ED4B62";
        newCnt.style.fontSize = "10px";
        newCnt.style.textAlign = "center";

        var newPrice = document.createElement("p");
        newPrice.textContent = Math.round(originalPrice / shareAmount);
        newPrice.style.color = "#ED4B62";
        newPrice.style.fontSize = "10px";
        newPrice.style.textAlign = "right";

        var newValuesWrapper = document.createElement("div");
        newValuesWrapper.appendChild(newCnt);
        newValuesWrapper.appendChild(newPrice);
        newValuesWrapper.classList.add("list-child");
        newValuesWrapper.style.display = "flex";

        itemCntInput.replaceWith(oldCntContainer);
        itemPriceInput.replaceWith(oldPriceContainer);
        selectedItem.appendChild(newValuesWrapper);

        selectedItem.style.border = "1px solid #F0F2F6";
        selectedItem.style.backgroundColor = "#FFF";
        selectedItem = null;
        saveText.textContent = "다음";
        if (shareBox) {
          shareBox.style.display = "none";
        }

        document.body.removeChild(shareDiv);
        document.body.removeChild(overlay);
      };

      shareDiv.appendChild(shareText);
      shareDiv.appendChild(selectedItemClone);
      shareDiv.appendChild(shareControls);
      shareDiv.appendChild(shareButton);
      document.body.appendChild(shareDiv);
      shareText.focus();
    }
  });

  function toggleBorder(event) {
    var item = event.currentTarget;
    if (selectedItem) {
      selectedItem.style.border = "1px solid #F0F2F6";
      selectedItem.style.backgroundColor = "#FFF";
    }
    if (selectedItem !== item) {
      item.style.backgroundColor = "#FFF6F8";
      item.style.border = "1px solid #FFBEC7";
      selectedItem = item;
      saveText.textContent = "다음";
    } else {
      selectedItem = null;
      saveText.textContent = "저장하기";
    }
  }

  function calculateSum() {
    var total = 0;
    var prices = document.querySelectorAll(".list-price-input");

    prices.forEach(function (priceInput) {
      total += parseFloat(priceInput.value);
    });

    sum.textContent = total;
  }

  listAddButton.addEventListener("click", function () {
    var newItem = document.createElement("div");
    newItem.classList.add("list");

    newItem.style.padding = "12px";
    newItem.style.borderRadius = "8px";
    newItem.style.border = "1px solid #F0F2F6";

    var itemNameInput = document.createElement("input");
    itemNameInput.type = "text";
    itemNameInput.value = "상품명을 입력하세요";
    itemNameInput.style.outline = "none";
    itemNameInput.classList.add("list-name-input");

    var itemCntInput = document.createElement("input");
    itemCntInput.type = "number";
    itemCntInput.value = "0";
    itemCntInput.style.outline = "none";
    itemCntInput.classList.add("list-cnt-input");

    var itemPriceInput = document.createElement("input");
    itemPriceInput.type = "number";
    itemPriceInput.value = "0";
    itemPriceInput.style.outline = "none";
    itemPriceInput.classList.add("list-price-input");

    newItem.appendChild(itemNameInput);
    newItem.appendChild(itemCntInput);
    newItem.appendChild(itemPriceInput);

    var deleteButton = document.createElement("img");
    deleteButton.src = "../../img/delete.png";
    deleteButton.alt = "삭제";
    deleteButton.style.width = "10px";
    deleteButton.style.height = "10px";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.marginLeft = "12px";
    deleteButton.classList.add("delete-button");
    newItem.appendChild(deleteButton);

    deleteButton.addEventListener("click", function () {
      newItem.remove();
      listContainer.style.height =
        parseInt(getComputedStyle(listContainer).height) - 35 + "px";
      calculateSum();
    });

    listBody.insertBefore(newItem, listAddButton);
    listContainer.style.height =
      parseInt(getComputedStyle(listContainer).height) + 35 + "px";
    listItems = document.querySelectorAll(".list");

    var itemName = newItem.querySelector(".list-name-input");
    var itemCnt = newItem.querySelector(".list-cnt-input");
    var itemPrice = newItem.querySelector(".list-price-input");

    itemName.addEventListener("input", function () {
      newItem.style.textDecoration = "none";
      calculateSum();
    });

    itemCnt.addEventListener("input", function () {
      newItem.style.textDecoration = "none";
      calculateSum();
    });

    itemPrice.addEventListener("input", function () {
      newItem.style.textDecoration = "none";
      calculateSum();
    });
  });

  function removeDeleteButtons() {
    var deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(function (button) {
      button.remove();
    });

    listItems.forEach(function (item) {
      var itemNameInput = item.querySelector(".list-name-input");
      var itemCntInput = item.querySelector(".list-cnt-input");
      var itemPriceInput = item.querySelector(".list-price-input");

      var itemName = document.createElement("p");
      itemName.textContent = itemNameInput.value;
      itemName.classList.add("list-name");

      var itemCnt = document.createElement("p");
      itemCnt.textContent = itemCntInput.value;
      itemCnt.classList.add("list-cnt");

      var itemPrice = document.createElement("p");
      itemPrice.textContent = itemPriceInput.value;
      itemPrice.classList.add("list-price");

      itemNameInput.replaceWith(itemName);
      itemCntInput.replaceWith(itemCnt);
      itemPriceInput.replaceWith(itemPrice);
    });
  }

  document.getElementById("save-box").addEventListener("click", function () {
    var correctionText = document.getElementById("correction").textContent;
    if (correctionText === "수정") {
      var items = [];
      document.querySelectorAll("#list-body .list").forEach((item) => {
        var itemName = item.querySelector(".list-name").textContent;
        var itemCnt = parseInt(item.querySelector(".list-cnt").textContent);
        var itemPrice = parseFloat(
          item.querySelector(".list-price").textContent
        );
        items.push({ item: itemName, quantity: itemCnt, price: itemPrice });
      });

      var tax = parseFloat(document.querySelector(".tax-input").value);
      var total = parseFloat(document.getElementById("sum").textContent);
      var date = document.getElementById("start-date").textContent;
      var title = document.getElementById("receipt-title").value;
      var receivedMemos = document.getElementById("receive-box").value;
      var givenMemos = document.getElementById("give-box").value;

      var createReceiptData = {
        items: items,
        tax: tax,
        total: total,
        date: date,
        title: title,
        receivedMemos: receivedMemos,
        givenMemos: givenMemos,
      };

      localStorage.setItem(
        "createReceiptData",
        JSON.stringify(createReceiptData)
      );
      window.location.href = "../html/save-receipt.html"; // Link 이동
    }
  });
});
