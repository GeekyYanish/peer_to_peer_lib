// P2P Academic Library - Main Entry Point
//
// This is the main entry point for the P2P Academic Library application.
// It demonstrates the initialization and wiring of all services.
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	
	"p2p-library/handlers"
	"p2p-library/models"
	"p2p-library/services"
	"p2p-library/store"
)

func main() {
	// Initialize storage
	memoryStore := store.NewMemoryStore()
	
	// Initialize services
	userService := services.NewUserService(memoryStore)
	libraryService := services.NewLibraryService(memoryStore, userService)
	reputationService := services.NewReputationService(memoryStore)
	searchService := services.NewSearchService(memoryStore)
	
	// Seed demo data
	seedDemoData(memoryStore, userService, libraryService)
	
	// Initialize handlers
	apiHandler := handlers.NewAPIHandler(
		userService,
		libraryService,
		reputationService,
		searchService,
	)
	
	// Setup router
	router := mux.NewRouter()
	
	// API routes
	apiHandler.SetupRoutes(router)
	
	// Serve static files for frontend
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./frontend/dist")))
	
	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})
	
	handler := c.Handler(router)
	
	// Get port from environment or default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	fmt.Printf("🚀 P2P Academic Library Server running on http://localhost:%s\n", port)
	fmt.Println("📚 API endpoints available at /api")
	fmt.Println("📖 Documentation: See P2P_Academic_Library_Documentation.md")
	
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

// seedDemoData creates sample data for testing
func seedDemoData(store *store.MemoryStore, userService *services.UserService, libService *services.LibraryService) {
	// Create demo users
	alice, _ := userService.CreateUser("alice", "alice@university.edu", "password")
	bob, _ := userService.CreateUser("bob", "bob@university.edu", "password")
	charlie, _ := userService.CreateUser("charlie", "charlie@university.edu", "password")
	
	// Make Alice a contributor
	for i := 0; i < 25; i++ {
		userService.RecordUpload(alice.ID)
	}
	
	// Make Bob neutral
	for i := 0; i < 10; i++ {
		userService.RecordUpload(bob.ID)
	}
	for i := 0; i < 5; i++ {
		userService.RecordDownload(bob.ID)
	}
	
	// Charlie is a leecher
	for i := 0; i < 3; i++ {
		userService.RecordUpload(charlie.ID)
	}
	for i := 0; i < 30; i++ {
		userService.RecordDownload(charlie.ID)
	}
	
	// Create demo resources
	resources := []struct {
		filename string
		title    string
		subject  string
		uploader models.UserID
		tags     []string
	}{
		{"golang_tutorial.pdf", "Go Programming Fundamentals", "Computer Science", alice.ID, []string{"golang", "programming", "tutorial"}},
		{"data_structures.pdf", "Data Structures and Algorithms", "Computer Science", alice.ID, []string{"algorithms", "dsa", "programming"}},
		{"calculus_notes.pdf", "Calculus Complete Notes", "Mathematics", bob.ID, []string{"calculus", "math", "notes"}},
		{"physics_mechanics.pdf", "Classical Mechanics", "Physics", alice.ID, []string{"physics", "mechanics"}},
		{"database_design.pdf", "Database Design Principles", "Computer Science", bob.ID, []string{"database", "sql", "design"}},
		{"linear_algebra.pdf", "Linear Algebra Essentials", "Mathematics", alice.ID, []string{"algebra", "math", "linear"}},
		{"networking_basics.pdf", "Computer Networks Basics", "Computer Science", charlie.ID, []string{"networking", "tcp", "protocols"}},
		{"chemistry_organic.pdf", "Organic Chemistry Guide", "Chemistry", bob.ID, []string{"chemistry", "organic"}},
	}
	
	for _, r := range resources {
		resource := models.NewResource(r.filename, 1024*1024, r.uploader)
		resource.Title = r.title
		resource.Subject = r.subject
		resource.Tags = r.tags
		resource.Description = "Sample resource for " + r.title
		libService.Upload(resource)
		
		// Add some ratings
		resource.AddRating(models.Rating(4.0))
		resource.AddRating(models.Rating(4.5))
	}
	
	fmt.Println("✅ Demo data seeded successfully")
}
