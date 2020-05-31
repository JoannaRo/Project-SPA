import style from "./css/index.scss";
import Boeing747 from "./assets/img/samolotDuzyHtml.svg";
//import Boeing737 from "";
//import Bombardier from "";

//EKRAN_1_

// funkcja oczekuje na kliknięcie inputa, po wybraniu inputa usuwa wartość wpisaną z góry w inpucie ORAZ sprawdza jaka ma klasę: jeśli 'invisible' dodaje 'visible' i wyswietlane są opcje do wyboru. Jeśli po kliknieciu w input mamy juz klase 'visible' - funkcja dodaje klase 'invisible' dzieki czemu dodatkowe opcje sa usuwane. W value inputa umieszczany jest odpowiedni komentarz. Gdy rodzic inputa (ul) posiada klase 'totalNumOfPassengers' - wykonywana jest funkcja numberOfPassengers, która sumuje ilosc dzieci i doroslych i wyswietla odpowiedni komentarz (ilosc osob lub info o przekroczeniu 9 osob). Jeśli rodzic inputa (ul) nie ma klasy 'totalNumOfPassengers' pokazywany jest komentarz 'not selected!'. 
//var inputHTMLOld = Array.from(document.getElementsByTagName("input"));
var inputHTML = Array.from(document.getElementsByClassName("page01input"));
inputHTML.forEach(function(item) {
    item.addEventListener("click", function () {
        this.setAttribute("value", "");     
        if (this.parentNode.parentNode.classList.contains("invisible")) {
            this.parentNode.parentNode.classList.remove("invisible");
            this.parentNode.parentNode.classList.add("visible");
        }   
        else if (this.parentNode.parentNode.classList.contains("visible")) {
            this.parentNode.parentNode.classList.remove("visible");
            this.parentNode.parentNode.classList.add("invisible");
            if (this.parentNode.parentNode.classList.contains("totalNumOfPassengers")) {
                var total = numberOfPassengers();
                    if (total <= 9) {
                        this.setAttribute("value", "Number of passengers: " + total);
                    } else {
                        this.setAttribute("value", "Choose max 9 people!");
                    }   
            } else {  
                this.setAttribute("value", "Not selected!");
            }
        }
    })
})
// funkcja użyta w bloku kodu powyżej - pobiera wartosci z pola liczba doroslych i liczba dzieci i zwraca ich sumę
function numberOfPassengers() {
    var adultsNumber = parseInt(document.getElementById("adultsNumber").value);
    var childrensNumber = parseInt(document.getElementById("childrensNumber").value);
    return (adultsNumber + childrensNumber);
}


// <span onclick="this.parentNode.style.display = 'none';" class="closebtn">&times;</span>
// <p>To close this container, click on the X symbol to the right.</p>
// </div>

//pobierane sa ul i dla każdego ul sprawdzamy czy kliknięte, jeśli tak pobierane są li danego ul. Na wszystkich li poza pierwszym[0]gdzie mamy inputa, wykonywana jest funkcja która sprawdza które li zostalo kliknięte i jego wartość ustawia w value inputa. Nie dotyczy to li z klasą 'passengers'.
var ulHTML = Array.from(document.getElementsByTagName("ul"));
ulHTML.forEach(function(item) {
    item.addEventListener("click", function () {
            var listOfLi = Array.from(item.children);
            listOfLi.forEach(function(element, index) {
                if(index !== 0) {
                    element.onclick = function() {
                        if (element.classList.contains("passengers")) {
                            return;
                        } else {
                            listOfLi[0].firstChild.setAttribute("value", this.textContent);
                            this.parentNode.classList.remove("visible");
                            this.parentNode.classList.add("invisible");
                        }   
                    }
                }
            })
    })
})

//obsłużenie inputów z klasą 'passengersNumber'. Po kliknięciu w przycisk minus - zmniejszana jest wartosc w inpucie o 1. 
var minusButtons = Array.from(document.getElementsByClassName("minus"));
minusButtons.forEach(function(item) {
    item.addEventListener("click", function() {
        this.parentNode.children[1].stepDown();
    })
})
//obsłużenie inputów z klasą 'passengersNumber'. Po kliknięciu w przycisk plus - zwiększana jest wartosc w inpucie o 1. 
var plusButtons = Array.from(document.getElementsByClassName("plus"));
plusButtons.forEach(function(item) {
    item.addEventListener("click", function() {
        this.parentNode.children[1].stepUp();
    })
})

//kalendarz - data od dnia dzisiejszego, max rok w przód
var d = new Date();
var monthNumber = function() {
    var mth = d.getMonth() + 1;
    if (mth <= 9) {
        mth = "0" + mth;
    }
    return mth;
}

var dayNumber = function() {
    var dy = d.getDate();
    if (dy <= 9) {
        dy = "0" + dy;
    }
    return dy;
}

var minDate = d.getFullYear() + "-" + monthNumber() + "-" + dayNumber();
var maxDate = (d.getFullYear() + 1) + "-" + monthNumber() + "-" + dayNumber();

document.getElementById("departureDate").min = minDate;
document.getElementById("departureDate").max = maxDate;
document.getElementById("returnDate").min = minDate;
document.getElementById("returnDate").max = maxDate;


//przejście do kolejnej strony - sprawdzenie czy nie ma błędów
var searchBtn = document.getElementById("searchButton");
searchBtn.addEventListener("click", function() {
    var valid = true;
    inputHTML.forEach(function(item) {
        if (item.value === "Not selected!" || item.value === "PLACE OF DEPARTURE" || item.value === "DESTINATION" || item.value === "CABIN CLASS" || item.value === "NUMBER OF PASSENGERS" || item.value === "Choose max 9 people!" || item.value === "") {
            item.classList.add("searchBtnError");
            valid = false;
        } else if (item.classList.contains("date")) {
            var depDate = new Date(document.getElementById("departureDate").value);
            var retDate = new Date(document.getElementById("returnDate").value);
            if (depDate > retDate) {
//                console.log("Data powrotu jest przed datą wylotu.")
                item.classList.add("searchBtnError");
                valid = false;
            } else {
                item.classList.remove("searchBtnError");
            }
        } else {
            item.classList.remove("searchBtnError");
        }
    })
    if (valid == false) {
        alert("Fill out the fields correctly");
    } else {
    document.getElementById("page01").classList.add("invisible01");
    document.getElementById("page02").classList.remove("invisible02");
    searchingResult();
    }
});



//EKRAN_2_

const flightsParsed = require("./flights.json");

function dayName(dayIndex) {
    var weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";
    return weekday[dayIndex];
    }

//searchingResult(); // funkcja użyta w kodzie powyzej gdzie przechodzimy do strony2

function getFlight() {
    var userDestination = document.getElementById("destination").value;
    for (const flight of flightsParsed.flights) {
        if (flight.to === userDestination) {
            return flight;
        }
}}

function searchingResult() {

    var userDepartureDate = new Date(document.getElementById("departureDate").value);
    var userDayNameDeparture = dayName(userDepartureDate.getDay());
  
    const dND = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(userDepartureDate);
    const dD = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(userDepartureDate);
    const mD = new Intl.DateTimeFormat('en', { month: 'short' }).format(userDepartureDate);
    const yD = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(userDepartureDate);
    const dateDepartureFormated = `${dND}, ${dD} ${mD} ${yD}`;
    document.getElementById("departureDateThere").innerHTML += dateDepartureFormated;
    document.getElementById("arrivalDateThere").innerHTML += dateDepartureFormated;

    var userReturnDate = new Date(document.getElementById("returnDate").value);
    var userDayNameReturn = dayName(userReturnDate.getDay());

    const dNR = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(userReturnDate);
    const dR = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(userReturnDate);
    const mR = new Intl.DateTimeFormat('en', { month: 'short' }).format(userReturnDate);
    const yR = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(userReturnDate);
    const dateReturnFormated = `${dNR}, ${dR} ${mR} ${yR}`;
    document.getElementById("departureDateBack").innerHTML += dateReturnFormated;
    document.getElementById("arrivalDateBack").innerHTML += dateReturnFormated;

    let flight = getFlight();

    const departurePlacesArray = document.getElementsByClassName("from"); 
    for (let field of departurePlacesArray) {
        field.innerHTML += flight.from;
    }
    const destinationArray = document.getElementsByClassName("to");
    for (let field of destinationArray) {
        field.innerHTML += flight.to;
    }
    const durationArray = document.getElementsByClassName("duration");
    for (let field of durationArray) {
        field.innerHTML += flight.duration;
    }

    var departureTimeThere = flight.departureTimeThere[0][userDayNameDeparture]; //.aaa = ["aaa"]
    var arrivalTimeThere = flight.arrivalTimeThere[0][userDayNameDeparture];
    var departureTimeBack = flight.departureTimeBack[0][userDayNameReturn];
    var arrivalTimeBack = flight.arrivalTimeBack[0][userDayNameReturn];
    document.getElementById("departureTimeThere").innerHTML += departureTimeThere;
    document.getElementById("arrivalTimeThere").innerHTML += arrivalTimeThere;
    document.getElementById("departureTimeBack").innerHTML += departureTimeBack;
    document.getElementById("arrivalTimeBack").innerHTML += arrivalTimeBack;


    var userCabinClass = document.getElementById("cabinClass").value;
    var pricePerPerson = flight.price[0][userCabinClass];
    const priceArray = document.getElementsByClassName("price");
    for (let field of priceArray) {
        field.innerHTML += pricePerPerson;
    }

            /* 
                var obj = {
                    "pole": {"data": 1},
                    "tablica": [2, 3]
                }
                dla obiektu można dostać się przez . na przykład obj.pole.data -> 1
                dla tablic jest obj.tablica[0] -> 2 lub obj.tablica[1] -> 3 
                w JS można do obiektów też odwołać się za pomocą operatora tablicy, podając nazwę pola jako klucz
                obj["pole"]["data"] -> 1 
                .aaa = ["aaa"]
            */
}
    


const usersParsed = require("./users.json");

//funkcja logowanie po nacisnieciu przycisku
document.getElementById("login").addEventListener("click", function() {
    document.getElementById("loginWindow").classList.remove("invisible02login");
})
document.getElementById("loginPasswordConfirmation").addEventListener("click", function() {
    checkLogin();
    displayPlane();
});

//function leadingZero(i) {
//    return (i < 10) ? "0"+i : i;
//}

function sessionTimer() {
    alert("Three minutes have elapsed - you have been logged out.")
    sessionStorage.clear();
    location.reload();
}




function checkLogin() {
    let loginvalidation = true;
    for (let user of usersParsed) {
        if ((document.getElementById("userlogin").value.toLowerCase() == user.login.toLowerCase()) && (document.getElementById("userpassword").value == user.password)) {
            loginvalidation = true;
            const timeOfLogin = new Date();
            sessionStorage.clear();
            sessionStorage.setItem("name", user.name);
            sessionStorage.setItem("forname", user.forname);
            sessionStorage.setItem("loginTimeInSeconds", (timeOfLogin.getTime() / 1000));
            document.getElementById("page02").classList.add("invisible02");
            document.getElementById("page03").classList.remove("invisible03");
            document.getElementById("userData").innerHTML += `${sessionStorage.name} ${sessionStorage.forname}`;
            document.getElementById("logout").classList.remove("invisibleLogout");
            
            setInterval(timeToLogOut, 1000);
            setTimeout(sessionTimer, sessionTime * 1000);
            return;

        } else {
            loginvalidation = false;
        }
    };
    if (loginvalidation === false) {
        alert("Incorrect login or password!");
    };
}


const sessionTime = 60*9;

if (sessionStorage.length != 0) {
    document.getElementById("userData").innerHTML += `${sessionStorage.name} ${sessionStorage.forname}`;
    document.getElementById("logout").classList.remove("invisibleLogout");
    
    const currentTime = new Date();
    const currentTimeInSeconds = currentTime.getTime()/1000;    
    setTimeout(sessionTimer, (sessionTime - (currentTimeInSeconds - sessionStorage.getItem("loginTimeInSeconds"))) * 1000);
    setInterval(timeToLogOut, 1000);

    document.getElementById("login").classList.add("invisible02login");
    document.getElementById("seatReservation").classList.remove("invisible02seatReservation");
    document.getElementById("seatReservation").addEventListener("click", function() {
        document.getElementById("page02").classList.add("invisible02");
        document.getElementById("page03").classList.remove("invisible03");
        displayPlane();
    })
} else {
    document.getElementById("userData").innerHTML = "";
}

document.getElementById("logout").addEventListener("click", function() {
    alert("You have been logged out.");
    sessionStorage.clear();
    location.reload();
})

function timeToLogOut() {
    const currentTime = new Date();
    const currentTimeInSeconds = currentTime.getTime()/1000;
    if (sessionStorage.length != 0) {
        let remainingTimeInSeconds = sessionTime - (currentTimeInSeconds - sessionStorage.getItem("loginTimeInSeconds"));
        let minutes = Math.floor(remainingTimeInSeconds / 60);
        let seconds = Math.floor(remainingTimeInSeconds) % 60;
        document.getElementById("logoutTime").innerHTML = `You will be logged out in: ${minutes}:${seconds}`;
    }   
}


//EKRAN_3_

var planes = {
    "Boeing747": Boeing747,
//    "Boeing737": Boeing737,
//    "Bombardier": Bombardier
};

//wyswietli odpowiedni samolot w zaleznosci od tego jaki przelot wybrany - zaimportowac w js odpowiednie 2 pliki
//odblokuje miejsca w odpowieniej klasie, zalezy jaka wybrana
function displayPlane() {
    let flight = getFlight();
    let planeType = flight.plane;
    document.getElementById("plane").innerHTML += planes[planeType];

    let businessClass = document.getElementById("layer3");
    let placesBusinessClass = seatsIntoArray(businessClass);
    let premiumEconomyClass = document.getElementById("layer4");
    let placesPremiumEconomyClass = seatsIntoArray(premiumEconomyClass);
    let economyClass = document.getElementById("layer5");
    let placesEconomyClass = seatsIntoArray(economyClass);

    let selectedCabinClass = document.getElementById("cabinClass").value    

    if (selectedCabinClass == "Business Class") {
        placesBusinessClass.forEach(toogleBookedSeat);
        placesEconomyClass.forEach(toogleLockedSeat);
        placesPremiumEconomyClass.forEach(toogleLockedSeat);
    } else if (selectedCabinClass == "Premium Economy") {
        placesPremiumEconomyClass.forEach(toogleBookedSeat);
        placesEconomyClass.forEach(toogleLockedSeat);
        placesBusinessClass.forEach(toogleLockedSeat);
    } else {
        placesEconomyClass.forEach(toogleBookedSeat);
        placesPremiumEconomyClass.forEach(toogleLockedSeat);
        placesBusinessClass.forEach(toogleLockedSeat);
    }
};





function toogleLockedSeat(item) {
    item.classList.add("lockedPlace");
}



function toogleBookedSeat(item) {
    item.addEventListener("click", function() {
        if (item.classList.contains("bookedPlace")) {
            item.classList.remove("bookedPlace");
        } else {
            item.classList.add("bookedPlace");
        }
        })
}

function seatsIntoArray(cabinClass) {
    let placesArray = [];
    for (let item of cabinClass.children) {
        placesArray.push(item.children[0])
    }
    return placesArray;
}













