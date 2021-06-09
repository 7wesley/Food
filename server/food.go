package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"gorm.io/gorm"
	"net/http"
)

//gorm makes it easy to transfer structs to a DB table
type Food struct {
	gorm.Model
	Name string `json:"name"`
	Type string `json:"type"`
	Calories string `json:"calories"`
}

func getFoods(writer http.ResponseWriter, request *http.Request) {
	writer.Header().Set("Content-Type", "application/json")
	var food []Food
	//Grabs from the db and sets it to the food var
	db.Find(&food)
	json.NewEncoder(writer).Encode(food)
}

func getFood(writer http.ResponseWriter, request *http.Request) {
	writer.Header().Set("Content-Type", "application/json")
	//Get param from http request
	params := mux.Vars(request)
	var food Food
	db.First(&food, params["id"])
	json.NewEncoder(writer).Encode(food)
}

func createFood(writer http.ResponseWriter, request *http.Request) {
	writer.Header().Set("Content-Type", "application/json")
	var food Food
	//Parsing data passed in to food struct
	json.NewDecoder(request.Body).Decode(&food)
	//Creating data with the food struct and adding db fields
	db.Create(&food)
	//Returning the json with the db fields (id, timestamp, etc)
	json.NewEncoder(writer).Encode(food)
}

func updateFood(writer http.ResponseWriter, request *http.Request) {
	writer.Header().Set("Content-Type", "application/json")
	//Get param from http request
	params := mux.Vars(request)
	var food Food
	db.First(&food, params["id"])
	json.NewDecoder(request.Body).Decode(&food)
	db.Save(&food)
	json.NewEncoder(writer).Encode(food)
}

func deleteFood(writer http.ResponseWriter, request *http.Request) {
	writer.Header().Set("Content-Type", "application/json")
	//Get param from http request
	params := mux.Vars(request)
	var food Food
	db.Delete(&food, params["id"])
	json.NewEncoder(writer).Encode("Food with id " + params["id"] + " has been deleted")
}



