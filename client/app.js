const BASE_URL = 'http://localhost:10000';
const searchBtn = document.querySelector('#searchBtn')
const addBtn = document.querySelector('#addBtn')

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

const getData = async () => {
    try {
        const response = await fetch(`${BASE_URL}/food`);
        let jsonData = await response.json();
        let parsedData = handleData(jsonData);

        document.getElementById("foodsGet").innerHTML = parsedData;
    } catch (errors) {
        console.error(errors);
    }
}

const search = async () => {
    let formValue = document.querySelector("#searchInput").value;
    const response = await fetch(`${BASE_URL}/food/${formValue}`);
    let jsonData = await response.json();
    let parsedData = handleData(jsonData);
    document.querySelector("#foodGet").innerHTML = parsedData;
}

const add = async () => {
    let name = document.querySelector("#foodName").value;
    let type = document.querySelector("#foodType").value;
    let calories = document.querySelector("#foodCalories").value;

    let foodJson = {
        name, type, calories
    }
    const response = await fetch(`${BASE_URL}/food`, {
        method: 'POST',
        body: JSON.stringify(foodJson)
    });

    let jsonData = await response.json();
    let parsedData = handleData(jsonData);
    document.querySelector("#foodAdd").innerHTML = "FOOD ADDED!"
    document.querySelector("#foodAdd").innerHTML += "<br></br>" + parsedData;

}

searchBtn.addEventListener('click', async () => {
    await search();
})

addBtn.addEventListener('click', async () => {
    await add();
})

//Load immediately
getData();