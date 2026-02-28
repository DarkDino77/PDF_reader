package main

import (
	"hello/controllers"
	"hello/implementation"
	"hello/services"
)

type AppContainer struct {
	DocController *controllers.DocumentController
}

func NewAppContainer() *AppContainer {

	store := &implementation.LocalStorage{BaseDir: "./uploads"}
	docService := &services.DocumentService{Storage: store}

	return &AppContainer{
		DocController: &controllers.DocumentController{Service: docService},
	}
}
