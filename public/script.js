// ===== ELEMENTS =====
const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const startBtn = document.getElementById("startBtn");
const startPrediction = document.getElementById("startPrediction");

const currentPeriodEl = document.getElementById("currentPeriod");
const nextPeriodEl = document.getElementById("nextPeriod");
const predictionEl = document.getElementById("prediction");
const timerEl = document.getElementById("timer");
const userIdEl = document.getElementById("userId");
const historyBody = document.getElementById("historyBody");

// ===== VARIABLES =====
let timerInterval = null;
let fetchInterval = null;
let timeLeft = 600; // 10 minutes

// ===== RANDOM USER =====
function randomUser(){
    return "Telegram User ID: TG" + Math.floor(Math.random()*9999999);
}

// ===== PAGE SWITCH =====
startBtn.onclick = () => {
    page1.classList.remove("active");
    page2.classList.add("active");
    userIdEl.innerText = randomUser();
};

// ===== START SESSION =====
startPrediction.onclick = () => {

    // Reset previous intervals
    if(timerInterval) clearInterval(timerInterval);
    if(fetchInterval) clearInterval(fetchInterval);

    timeLeft = 600;
    updateTimer();

    timerInterval = setInterval(()=>{
        timeLeft--;
        updateTimer();

        if(timeLeft <= 0){
            clearInterval(timerInterval);
            clearInterval(fetchInterval);
            predictionEl.innerText = "🔒 Session Ended";
        }
    },1000);

    fetchData();
    fetchInterval = setInterval(fetchData,15000);
};

// ===== TIMER UPDATE =====
function updateTimer(){
    let min = Math.floor(timeLeft/60);
    let sec = timeLeft % 60;
    timerEl.innerText = `${min}:${sec < 10 ? "0"+sec : sec}`;
}

// ===== FETCH DATA =====
function fetchData(){

    fetch("https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json?pageSize=5&pageNo=1")
    .then(res => res.json())
    .then(data => {

        if(!data || !data.data || !data.data.list) return;

        let list = data.data.list;

        // ===== HISTORY TABLE =====
        historyBody.innerHTML = "";

        list.forEach(item => {

            let number = parseInt(item.number);
            let size = number >= 5 ? "BIG" : "SMALL";
            let last5 = item.issueNumber.slice(-5);

            historyBody.innerHTML += `
                <tr>
                    <td>${last5}</td>
                    <td>${number}</td>
                    <td>${size}</td>
                </tr>
            `;
        });

        // ===== CURRENT & NEXT PERIOD =====
        let latest = list[0];

        let currentPeriodFull = latest.issueNumber;
        let currentPeriod = parseInt(currentPeriodFull);
        let nextPeriod = currentPeriod + 1;

        currentPeriodEl.innerText = currentPeriodFull.slice(-5);
        nextPeriodEl.innerText = String(nextPeriod).slice(-5);

        // ===== SIMPLE RESULT DISPLAY =====
        let number = parseInt(latest.number);
        let size = number >= 5 ? "BIG" : "SMALL";
        let color = number % 2 === 0 ? "GREEN" : "RED";

        predictionEl.innerText = `${size} | ${color}`;

    })
    .catch(err => {
        console.log("API Error:", err);
    });
}
