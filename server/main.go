package main

import (
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"net/http"
	"os"
)

var db *gorm.DB
var err error

//migrate to db
func initMigration() {
	handleErr(err)
	db.AutoMigrate(&Food{})
}

func handleErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func initRouter() {
	router := mux.NewRouter()

	//CRUD http protocol
	router.HandleFunc("/food", getFoods).Methods("GET")
	router.HandleFunc("/food/{id}", getFood).Methods("GET")
	router.HandleFunc("/food", createFood).Methods("POST")
	router.HandleFunc("/food/{id}", updateFood).Methods("PUT")
	router.HandleFunc("/food/{id}", deleteFood).Methods("DELETE")

	//Enabling CORS with restrictions. Different port = different origin
	//Set AllowedOrigins{"*"} to allow requests from local files
	//https://stackoverflow.com/q/20035101
	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"})
	originsOk := handlers.AllowedOrigins([]string{os.Getenv("ORIGIN_ALLOWED")})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})
	log.Fatal(http.ListenAndServe(os.Getenv("HOSTPORT"), handlers.CORS(originsOk, headersOk, methodsOk)(router)))
}

/** Program entry */
func main() {
	godotenv.Load()
	host := os.Getenv("HOST")
	dbPort := os.Getenv("DB_PORT")
	user := os.Getenv("USER")
	dbname := os.Getenv("DBNAME")
	password := os.Getenv("PASSWORD")
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, dbname, dbPort)
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	handleErr(err)
	initMigration()
	initRouter()
}