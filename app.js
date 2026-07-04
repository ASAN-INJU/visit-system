let currentArea = "A";
let currentIndex = 0;
let currentHouses = housesA;

function key(type){
  return "geolmaeri_" + currentArea + "_" + currentIndex + "_" + type;
}

function loadHouse(){
  const house = currentHouses[currentIndex];

  document.getElementById("current").innerText = currentIndex + 1;
  document.getElementById("total").innerText = currentHouses.length;

  document.getElementById("houseNumber").innerText = house.number;
  document.getElementById("houseName").innerText = house.name || "이름 없음";
  document.getElementById("houseAddress").innerText = house.address;

  document.getElementById("memo").value = localStorage.getItem(key("memo")) || "";

  updateProgress();
}

function setStatus(status){
  localStorage.setItem(key("status"), status);
  updateProgress();
}

function saveMemo(){
  localStorage.setItem(key("memo"), document.getElementById("memo").value);
}

function nextHouse(){
  saveMemo();
  if(currentIndex < currentHouses.length - 1){
    currentIndex++;
    loadHouse();
  }
}

function prevHouse(){
  saveMemo();
  if(currentIndex > 0){
    currentIndex--;
    loadHouse();
  }
}

function updateProgress(){
  let done = 0;

  currentHouses.forEach((h, i)=>{
    if(localStorage.getItem("geolmaeri_" + currentArea + "_" + i + "_status")){
      done++;
    }
  });

  const percent = Math.round(done / currentHouses.length * 100);

  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressPercent").innerText = percent + "%";
}

document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("memo").addEventListener("input", saveMemo);
  loadHouse();
});
