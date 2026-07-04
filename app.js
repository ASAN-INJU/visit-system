// 현재 선택된 구역
let currentArea = "A";

// 현재 집 번호
let currentIndex = 0;

// 현재 사용할 데이터
let currentHouses = houses;

// 구역 변경
function loadArea(area){

    currentArea = area;

    if(area==="A"){
        currentHouses = housesA;
    }

    if(area==="B"){
        currentHouses = housesB;
    }

    currentIndex = 0;

    loadHouse();

}

// 현재 집 표시
function loadHouse(){

    const house = currentHouses[currentIndex];

    document.getElementById("current").innerText=currentIndex+1;
    document.getElementById("total").innerText=currentHouses.length;

    document.getElementById("houseNumber").innerText=house.number;
    document.getElementById("houseName").innerText=house.name;
    document.getElementById("houseAddress").innerText=house.address;

}
