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

let timerInterval;
let fetchInterval;
let timeLeft = 600;

function randomUser(){
    return "Telegram User ID: TG" + Math.floor(Math.random()*9999999);
}

startBtn.onclick = () => {
    page1.classList.remove("active");
    page2.classList.add("active");
    userIdEl.innerText = randomUser();
};

startPrediction.onclick = () => {

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

function updateTimer(){
    let min = Math.floor(timeLeft/60);
    let sec = timeLeft%60;
    timerEl.innerText = `${min}:${sec<10?"0"+sec:sec}`;
}

function fetchData(){
    fetch("https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json?pageSize=5&pageNo=1")
    .then(res=>res.json())
    .then(data=>{
        let list = data.data.list;
        historyBody.innerHTML = "";

        list.forEach(item=>{
            let number = parseInt(item.number);
            let size = number>=5?"BIG":"SMALL";
            let last5 = item.issueNumber.slice(-5);

            historyBody.innerHTML += `
                <tr>
                    <td>${last5}</td>
                    <td>${number}</td>
                    <td>${size}</td>
                </tr>
            `;
        });

        let latest = list[0];
        let currentPeriod = parseInt(latest.issueNumber);
        let nextPeriod = currentPeriod + 1;

        currentPeriodEl.innerText = latest.issueNumber.slice(-5);
        nextPeriodEl.innerText = String(nextPeriod).slice(-5);

        // ⚠ Safe Demo Logic (Not predictive gambling logic)
        let number = parseInt(latest.number);
        let size = number>=5?"BIG":"SMALL";
        let color = number%2===0?"GREEN":"RED";

        predictionEl.innerText = `${size} | ${color}`;
    });
}
