let currentIndex = 0;

function key(type){
  return "geolmaeriA_" + currentIndex + "_" + type;
}

function loadHouse(){
  const house = houses[currentIndex];

  document.getElementById("current").innerText = currentIndex + 1;
  document.getElementById("total").innerText = houses.length;

  document.getElementById("houseNumber").innerText = house.number;
  document.getElementById("houseName").innerText = house.name || "이름 없음";
  document.getElementById("houseAddress").innerText = house.address;

  document.getElementById("memo").value =
    localStorage.getItem(key("memo")) || "";

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
  if(currentIndex < houses.length - 1){
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

  houses.forEach((h, i)=>{
    if(localStorage.getItem("geolmaeriA_" + i + "_status")){
      done++;
    }
  });

  const percent = Math.round(done / houses.length * 100);

  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressPercent").innerText = percent + "%";
}

document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("memo").addEventListener("input", saveMemo);
  loadHouse();
});
