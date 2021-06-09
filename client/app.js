const BASE_URL = 'http://localhost:10000';
const addBtn = document.querySelector('#addBtn')
/*
Ajax = async javascript and XML,
helps load data in background and display it on page w/o refresh
Jquery provides several methods for ajax functionality
Different browsers have diff ajax syntax, jqeury is universal
Note: Ajax only works in a server
$ = shortcut for jQuery, could replace $ with jQuery
 */

//document.ready
//Ensures that jquery loads after website has loaded
$(document).ready(() => {
    $("#searchBtn").click(async () => {
        $("#foodGet").html(await search());
    });

    $("#addBtn").click(async () => {
        $("#foodGet").html(await add());
        await getAll();
    });

    getAll();
});

const handleData = (jsonData) => {
    let formatted = "";
    if (jsonData.length) {
        for (let obj of jsonData) {
            formatted += parseData(obj) + "<br></br>";
        }
    }
    else {
        formatted = parseData(jsonData)
    }
    return formatted;
}

//Json cannot be displayed in html, must be formatted
const parseData = (jsonData) => {
    let formatted = "";
    for (let key of Object.keys(jsonData)) {
        formatted += jsonData[key] + " "
    }
    return formatted;
}

const getAll = async () => {
    try {
        const response = await fetch(`${BASE_URL}/food`);
        let jsonData = await response.json();
        let parsedData = handleData(jsonData);
        $("#foodsGet").html(parsedData);
    } catch (errors) {
        console.error(errors);
    }
}

const search = async () => {
    let formValue = $("#searchInput").val();
    const response = await fetch(`${BASE_URL}/food/${formValue}`);
    let jsonData = await response.json();
    return handleData(jsonData);
}

const add = async () => {
    let name = $("#foodName").val();
    let type = $("#foodType").val();
    let calories = $("#foodCalories").val();

    let foodJson = {
        name, type, calories
    }
    const response = await fetch(`${BASE_URL}/food`, {
        method: 'POST',
        body: JSON.stringify(foodJson)
    });

    let jsonData = await response.json();
    let parsedData = handleData(jsonData);
    let html = "FOOD ADDED! <br><br>" + parsedData
    $("#foodAdd").html(html);
}