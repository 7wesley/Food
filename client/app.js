let BASE_URL
const LOCAL = "http://localhost"
const LOCAL_API = "http://localhost:10001"
const KUBERNETES_API = "/api"

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
            try {
                const response = await fetch(`${BASE_URL}/food/${this.$refs.searchName.value}`);
                let jsonData = await response.json();
                this.specificFood = this.handleData(jsonData);
            } catch (errors) {
                console.log(errors)
            }
        },
        /** Adds a specific food **/
        async add() {
            let jsonData
            let foodJson = {
                name: this.$refs.name.value,
                type: this.$refs.type.value,
                calories: this.$refs.calories.value
            };

            try {
                const response = await fetch(`${BASE_URL}/food`, {
                    method: 'POST',
                    body: JSON.stringify(foodJson)
                });
                jsonData = await response.json();
            } catch (errors) {
                console.log(errors)
                return
            }
            
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
        /** Checks if deployed by a docker container or kubernetes */
        alterReadMore() {
            this.readMore = !this.readMore;
        }
    },
    /** Runs at the start of execution **/
    async beforeMount() {
        //Checking if deployed locally or to kubernetes
        if (window.location.href.includes(LOCAL)) {
            //Assumes API is hosted on this port
            BASE_URL = LOCAL_API
        } else {
            BASE_URL = KUBERNETES_API
        }
        this.getFoods();
    }
 })

/**The div the app will be inserted to **/
 app.mount('#app')