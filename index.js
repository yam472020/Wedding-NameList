let selectedValue; // 定義全局變量

// 使用 Fetch API 獲取 JSON 文件
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // 將數據保存在全局變量中
        jsonData = data;
    })
    .catch(error => console.error('Error fetching JSON:', error));

// JavaScript 函數，用於設置選中的單選按鈕樣式並取得值
function setRadio(element) {
    // 清除所有按鈕的選中樣式
    document.querySelectorAll('.custom-radio-button').forEach(function (button) {
        button.classList.remove('checked');
    });

    // 設置選中按鈕的樣式
    var selectedButton = element.parentNode;
    selectedButton.classList.add('checked');

    // 取得選中按鈕的值
    selectedValue = element.value;
    //console.log(selectedValue); // 這裡你可以使用取得的值進行其他操作

    // 清空搜尋框的內容
    document.getElementById("searchInput").value = '';

    // 顯示所有該按鈕的人員
    if (selectedValue === 'None') {
        const allNames = Object.values(jsonData).flatMap(names => Object.keys(names));
        displayResults(allNames);
    } else {
        displayResults(Object.keys(jsonData[selectedValue] || {}));
    }
}

// 實時搜尋的功能
function search() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    let results = [];

    // 如果有選中部門按鈕，僅搜尋該部門的人員
    const selectedButton = document.querySelector('.custom-radio-button.checked');
    if (selectedButton) {
        if (selectedValue === 'None') {
            // 如果選中 "無"，則搜尋所有部門的人員
            const allNames = Object.values(jsonData).flatMap(names => Object.keys(names));
            results = allNames.filter(name =>
                name.toLowerCase().includes(searchInput)
            );
        } else {
            // 如果選中了部門按鈕，僅搜尋該部門的人員
            results = Object.keys(jsonData[selectedValue] || {}).filter(name =>
                name.toLowerCase().includes(searchInput)
            );
        }
    } else {
        // 如果沒有選中部門按鈕，搜尋所有部門的人員
        Object.values(jsonData).forEach(names => {
            results = results.concat(Object.keys(names));
        });
        results = results.filter(name =>
            name.toLowerCase().includes(searchInput)
        );
    }

    displayResults(results);

}

// 顯示搜尋結果的函數
function displayResults(results) {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById("searchResults");
    if (searchInput != "") {
        resultsContainer.innerHTML = "";

        if (results.length === 0) {
            resultsContainer.innerHTML = "無匹配結果。";
        } else {
            results.forEach(person => {
                const resultDiv = document.createElement("div");
                resultDiv.classList.add("search-result");
                if (selectedValue === 'None') {
                    // 如果選擇 "None"，顯示所有部門的結果
                    Object.keys(jsonData).forEach(department => {
                        const seat = jsonData[department][person];
                        if (seat) {
                            resultDiv.innerHTML +=
                                `<span class="text-danger table">${seat}</span><span>- ${person}</span><br>`;
                        }
                    });
                    resultsContainer.appendChild(resultDiv);
                } else {
                    // 如果選中了部門按鈕，僅顯示該部門的結果
                    const seat = jsonData[selectedValue][person];
                    if (seat) {
                        resultDiv.innerHTML = `<span class="text-danger table">${seat}</span><span>- ${person}</span>`;
                        resultsContainer.appendChild(resultDiv);
                    }
                }
            });
        }
    } else {
        resultsContainer.innerHTML = "無匹配結果。";
    }

    //自動選取唯一筆的名子
    if (results.length == 1) {
        //取消聚焦
        document.activeElement.blur()
        autoclick()
    } else {
        // 初始化樣式
        $("#searchResults").find(".click-bg").removeClass("click-bg")
        $(".circle1,.circle2").removeClass("click-bg")
    }
}

function autoclick() {
    $(".search-result").click()
}

window.onload = function () {
    $("#option7").click()
}

$(document).ready(function () {
    $(document).on("click", ".search-result", function () {
        // 初始化樣式
        $("#searchResults").find(".click-bg").removeClass("click-bg")
        $(".circle1,.circle2").removeClass("click-bg")

        $(this).addClass("click-bg")
        table = $(this).find(".table").text()
        $("[name='" + table + "']").addClass("click-bg")
    })
})
