const BASE_URL = 'http://localhost:10000';
const app = Vue.createApp({
     data() {
         return {
             allFood: '',
             specificFood: '',
             addedFood: '',
             searchName: '',
             name: '',
             type: '',
             calories: ''
         }
     },
     methods: {
         /** Searches for specific food **/
         async search() {
             const response = await fetch(`${BASE_URL}/food/${this.searchName}`);
             let jsonData = await response.json();
             this.specificFood = this.handleData(jsonData);
         },
         /** Adds a specific food **/
         async add() {
             let foodJson = {
                 name: this.name,
                 type: this.type,
                 calories: this.calories
             };
             const response = await fetch(`${BASE_URL}/food`, {
                 method: 'POST',
                 body: JSON.stringify(foodJson)
             });

             let jsonData = await response.json();
             let html = "FOOD ADDED! <br><br>" + this.handleData(jsonData);
             this.addedFood = html;
             await this.getFoods();
         },
         /** Gets all foods **/
         async getFoods() {
             try {
                 const response = await fetch(`${BASE_URL}/food`);
                 let jsonData = await response.json();
                 this.allFood = this.handleData(jsonData);
             } catch (errors) {
                 console.error(errors);
             }
         },
         /** Handles jsonData, whether its an array or just an object **/
         handleData(jsonData) {
             let formatted = "";
             if (jsonData.length) {
                 for (let obj of jsonData) {
                     formatted += this.parseData(obj) + "<br></br>";
                 }
             }
             else {
                 formatted = this.parseData(jsonData)
             }
             return formatted;
         },
         /** Gets the keys from the object and constructs a string from it **/
         parseData (jsonData)  {
             let formatted = "";
             for (let key of Object.keys(jsonData)) {
                 formatted += jsonData[key] + " "
             }
             return formatted;
         }
     },
    /** Runs at the start of execution **/
     beforeMount() {
         this.getFoods();
     }
 })

/**The div the app will be inserted to **/
 app.mount('#app')