const canvas = document.getElementById("Game");
const grafic = canvas.getContext("2d");
const diaBox = document.getElementById("DIABOX");
const all = document.getElementById("box");
const charDisp = document.getElementById("charDisp");
const positionning = {
    "FL": [-400, -40],
    "L": [-200, -40],
    "M": [400, -40],
    "R": [1000, -40],
    "FR": [1200, -40]
}
var jsonData;
let diaBoxNMB = 1;
let animeDone = false;
let currentDiaBoxTXT;
let sprite1 = new Image(); let sprite2 = new Image(); let sprite3 = new Image(); let sprite4 = new Image();
let sprites = [sprite1, sprite2, sprite3, sprite4]
let soundTrack = new Audio();


function jumpAnimation(img) {
    
}

function arraysAreEqual(arr1, arr2) {
    for (let i = 1; i < 3; i++) {
        let arr = (i === 1) ? arr1 : arr2;
        if (arr[0].length === 0) {
            arr.shift();
        }
    }return arr1.length === arr2.length}

function fadeOut(time, callback1, callback2) {
    canvas.style.opacity = 0;
    setTimeout(() => {callback1(); if (typeof callback2 === 'function') {callback2()}}, 300);
    setTimeout(() => {
        canvas.style.opacity = 1;
    }, time);
}

function playSoundtrack(source, vol, isLoop) {
    soundTrack.pause();
    soundTrack.src = source;
    soundTrack.loop = isLoop;
    soundTrack.volume = vol;
    soundTrack.play();
}

function generateIMGs(NMB, pos, sources, NMBOfIMGs) {
    const drawImages = () => {
        if(sources[0].length !== 0){
            grafic.clearRect(0, 0, canvas.width, canvas.height)
            for (let i = 0; i < NMBOfIMGs; i++) {sprites[i].src = `assets/IMGs/Sprites/FullBodyChars/${sources[i]}.png`}
            for (let i = 0; i < NMBOfIMGs; i++) {
                sprites[i].onload = (function(i) {
                    return function() {
                        grafic.drawImage(sprites[i], positionning[pos[i]][0], positionning[pos[i]][1], 1600, 2640);
                        // animate(sprites[i])
                    }
                })(i)
            }
        } else {grafic.clearRect(0, 0, canvas.width, canvas.height)}
    }
    if ((!canvas.style.backgroundImage.includes(`assets/IMGs/BGs/${jsonData[Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}`))][0]}.jpg`) || !arraysAreEqual(Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}-`)).split(`diaBox${NMB}-`)[1].split("-"), Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB-1}-`)).split(`diaBox${NMB-1}-`)[1].split("-")))) {
        const setBackground = () => {canvas.style.backgroundImage = `url(assets/IMGs/BGs/${jsonData[Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}`))][0]}.jpg)`}
        fadeOut(1000, setBackground, drawImages);
        setTimeout(() => {TXTSpawningAnime(jsonData, NMB), charDisp.style.backgroundImage = `url(assets/IMGs/Sprites/FaceICONs/${jsonData[Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}`))][2]}.png)`}, 1000);
        animeDone = false;
    } else if (diaBoxNMB === 1 || Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB-1}-`)).split(`diaBox${NMB-1}-`)[1] !== Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}-`)).split(`diaBox${NMB}-`)[1]) {
        drawImages()
        setTimeout(() => {TXTSpawningAnime(jsonData, NMB), charDisp.style.backgroundImage = `url(assets/IMGs/Sprites/FaceICONs/${jsonData[Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}`))][2]}.png)`}, 300);
        animeDone = false;
    } else {TXTSpawningAnime(jsonData, NMB), charDisp.style.backgroundImage = `url(assets/IMGs/Sprites/FaceICONs/${jsonData[Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}`))][2]}.png)`}
}

function TXTSpawningAnime(jsonData, NMB) {
    animeDone = false;
    diaBox.textContent = "";
    const txt = jsonData[Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}`))][3];
    for (let i = 0; i < txt.length; i++) {
        setTimeout(() => {
            diaBox.textContent += txt[i];
            if (diaBox.textContent === jsonData[Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}`))][3]) {animeDone = true}
        }, 10 * i);
    }
}

async function loadBase64File() {
    const response = await fetch("DATA/data.b64");
    const base64Data = await response.text();
    const binaryString = atob(base64Data);
    const decoder = new TextDecoder('utf-8');
    const jsonString = decoder.decode(new Uint8Array([...binaryString].map(c => c.charCodeAt(0))));
    jsonData = JSON.parse(jsonString)
}

function getJsonDiaData(NMB) {
    loadBase64File().then(() => {
        if(jsonData[Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}`))]){
            currentDiaBoxTXT = jsonData[Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}`))];
            generateIMGs(NMB, jsonData[Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}`))].slice(4), Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}-`)).split(`diaBox${NMB}-`)[1].split("-"), Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}-`)).split("-").length - 1);
            if (!soundTrack.src.includes(`assets/AUDIOs/SoundTracks/${jsonData[Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}`))][1]}.mp3`)) {playSoundtrack(`assets/AUDIOs/SoundTracks/${jsonData[Object.keys(jsonData).find(k => k.startsWith(`diaBox${NMB}`))][1]}.mp3`, 0.1, true)};
        }
    })
}

canvas.addEventListener("click", () => {
    getJsonDiaData(diaBoxNMB);
    all.style.opacity = 1;
}, { once: true })

document.body.onkeydown = function(e) {
    if (e.key === " " && animeDone === true && (diaBox.style.opacity === "1" || diaBox.style.opacity === "")) {diaBoxNMB++; getJsonDiaData(diaBoxNMB)}
    else if(e.key === "a") {[diaBox.style.opacity, charDisp.style.opacity] = diaBox.style.opacity === "0" ? ["1", "1"] : ["0", "0"]}
}