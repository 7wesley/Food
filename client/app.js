const BASE_URL = 'http://localhost:10000';
const app = Vue.createApp({
     data() {
         return {
             allFood: '',
             specificFood: '',
             addedFood: '',
             readMore: false
         }
     },
     methods: {
         /** Searches for specific food **/
         async search() {
             console.log(this.$refs.searchName.value)
             const response = await fetch(`${BASE_URL}/food/${this.$refs.searchName.value}`);
             let jsonData = await response.json();
             this.specificFood = this.handleData(jsonData);
         },
         /** Adds a specific food **/
         async add() {
             let foodJson = {
                 name: this.$refs.name.value,
                 type: this.$refs.type.value,
                 calories: this.$refs.calories.value
             };
             const response = await fetch(`${BASE_URL}/food`, {
                 method: 'POST',
                 body: JSON.stringify(foodJson)
             });

             let jsonData = await response.json();
             let html = "FOOD ADDED! <br></br>" + this.handleData(jsonData);
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
                 formatted = this.parseData(jsonData);
             }
             return formatted;
         },
         /** Gets the keys from the object and constructs a string from it **/
         parseData(jsonData)  {
             let formatted = "";
             for (let key of Object.keys(jsonData)) {
                 formatted += jsonData[key] + " ";
             }
             return formatted;
         },
         alterReadMore() {
             this.readMore = !this.readMore;
         }
     },
    /** Runs at the start of execution **/
     async beforeMount() {
         this.getFoods();
     }
 })

/**The div the app will be inserted to **/
 app.mount('#app')