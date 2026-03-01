const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const startBtn = document.getElementById("startBtn");
const startPrediction = document.getElementById("startPrediction");

const periodEl = document.getElementById("period");
const predictionEl = document.getElementById("prediction");
const timerEl = document.getElementById("timer");
const userIdEl = document.getElementById("userId");
const historyBody = document.getElementById("historyBody");

let timerInterval;
let fetchInterval;
let timeLeft = 600;

function showAd(){
    // 👉 Yaha apna Ad network code lagao
    console.log("Ad Trigger Placeholder");
}

function randomUser(){
    return "Telegram User ID: TG" + Math.floor(Math.random()*9999999);
}

startBtn.onclick = () => {
    showAd();   // Ad before page switch
    page1.classList.remove("active");
    page2.classList.add("active");
    userIdEl.innerText = randomUser();
};

startPrediction.onclick = () => {

    showAd();  // Ad before starting prediction

    timeLeft = 600;
    updateTimer();

    timerInterval = setInterval(()=>{
        timeLeft--;
        updateTimer();

        if(timeLeft <= 0){
            clearInterval(timerInterval);
            clearInterval(fetchInterval);
            predictionEl.innerText = "🔒 Prediction Locked";
        }
    },1000);

    fetchPrediction();
    fetchInterval = setInterval(fetchPrediction,15000);
};

function updateTimer(){
    let min = Math.floor(timeLeft/60);
    let sec = timeLeft%60;
    timerEl.innerText = `${min}:${sec<10?"0"+sec:sec}`;
}

function fetchPrediction(){
    fetch("https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json?pageSize=5&pageNo=1")
    .then(res=>res.json())
    .then(data=>{
        let list = data.data.list;

        historyBody.innerHTML = "";

        list.forEach(item=>{
            let number = parseInt(item.number);
            let size = number>=5?"BIG":"SMALL";
            let last5 = item.issueNumber.slice(-5);

            let row = `
                <tr>
                    <td>${last5}</td>
                    <td>${number}</td>
                    <td>${size}</td>
                </tr>
            `;
            historyBody.innerHTML += row;
        });

        let latest = list[0];
        let number = parseInt(latest.number);
        let size = number>=5?"BIG":"SMALL";
        let color = number%2===0?"GREEN":"RED";
        let last5 = latest.issueNumber.slice(-5);

        periodEl.innerText = last5;
        predictionEl.innerText = `${size} ${number} COLOR ${color}`;
    });
}
