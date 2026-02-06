// Package handlers provides HTTP API handlers.
//
// GO CONCEPT 8: JSON MARSHAL AND UNMARSHAL
// This file demonstrates:
// - JSON encoding/decoding for API requests/responses
// - HTTP request handling
// - Error response formatting
package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	
	"p2p-library/models"
	"p2p-library/services"
)

// APIHandler handles HTTP requests
type APIHandler struct {
	userService       *services.UserService
	libraryService    *services.LibraryService
	reputationService *services.ReputationService
	searchService     *services.SearchService
}

// NewAPIHandler creates a new API handler
func NewAPIHandler(
	userService *services.UserService,
	libraryService *services.LibraryService,
	reputationService *services.ReputationService,
	searchService *services.SearchService,
) *APIHandler {
	return &APIHandler{
		userService:       userService,
		libraryService:    libraryService,
		reputationService: reputationService,
		searchService:     searchService,
	}
}

// Response types for JSON marshaling
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

type CreateUserRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CreateResourceRequest struct {
	Filename    string   `json:"filename"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Subject     string   `json:"subject"`
	Tags        []string `json:"tags"`
	Size        int64    `json:"size"`
}

type RateResourceRequest struct {
	Rating  float64 `json:"rating"`
	Comment string  `json:"comment"`
}

// writeJSON is a helper for JSON responses
func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func writeSuccess(w http.ResponseWriter, data interface{}) {
	writeJSON(w, http.StatusOK, APIResponse{Success: true, Data: data})
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, APIResponse{Success: false, Error: msg})
}

// ============================================================================
// USER ENDPOINTS
// ============================================================================

// CreateUser handles POST /api/users
func (h *APIHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var req CreateUserRequest
	
	// JSON Unmarshal - decode request body
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON: "+err.Error())
		return
	}
	
	user, err := h.userService.CreateUser(req.Username, req.Email, req.Password)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	
	// JSON Marshal - encode response (automatic via writeJSON)
	writeSuccess(w, user)
}

// GetUser handles GET /api/users/{id}
func (h *APIHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := models.UserID(vars["id"])
	
	user, err := h.userService.GetUser(id)
	if err != nil {
		writeError(w, http.StatusNotFound, err.Error())
		return
	}
	
	writeSuccess(w, user)
}

// GetAllUsers handles GET /api/users
func (h *APIHandler) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.userService.GetAllUsers()
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeSuccess(w, users)
}

// GetLeaderboard handles GET /api/leaderboard
func (h *APIHandler) GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	limit := 10
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}
	
	users, err := h.userService.GetLeaderboard(limit)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeSuccess(w, users)
}

// ============================================================================
// RESOURCE ENDPOINTS
// ============================================================================

// CreateResource handles POST /api/resources
func (h *APIHandler) CreateResource(w http.ResponseWriter, r *http.Request) {
	var req CreateResourceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON: "+err.Error())
		return
	}
	
	// Get user ID from header (simplified auth)
	userID := models.UserID(r.Header.Get("X-User-ID"))
	if userID == "" {
		writeError(w, http.StatusUnauthorized, "User ID required")
		return
	}
	
	resource := models.NewResource(req.Filename, req.Size, userID)
	resource.Title = req.Title
	resource.Description = req.Description
	resource.Subject = req.Subject
	resource.Tags = req.Tags
	
	if err := h.libraryService.Upload(resource); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	
	writeSuccess(w, resource)
}

// GetResource handles GET /api/resources/{id}
func (h *APIHandler) GetResource(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := models.ContentID(vars["id"])
	
	resource, err := h.libraryService.GetResource(id)
	if err != nil {
		writeError(w, http.StatusNotFound, err.Error())
		return
	}
	
	writeSuccess(w, resource)
}

// DownloadResource handles POST /api/resources/{id}/download
func (h *APIHandler) DownloadResource(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	resourceID := models.ContentID(vars["id"])
	userID := models.UserID(r.Header.Get("X-User-ID"))
	
	resource, err := h.libraryService.Download(resourceID, userID)
	if err != nil {
		writeError(w, http.StatusNotFound, err.Error())
		return
	}
	
	writeSuccess(w, resource)
}

// GetPopularResources handles GET /api/resources/popular
func (h *APIHandler) GetPopularResources(w http.ResponseWriter, r *http.Request) {
	limit := 10
	if l := r.URL.Query().Get("limit"); l != "" {
		if n, err := strconv.Atoi(l); err == nil {
			limit = n
		}
	}
	
	resources, err := h.libraryService.GetPopular(limit)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeSuccess(w, resources)
}

// GetRecentResources handles GET /api/resources/recent
func (h *APIHandler) GetRecentResources(w http.ResponseWriter, r *http.Request) {
	limit := 10
	if l := r.URL.Query().Get("limit"); l != "" {
		if n, err := strconv.Atoi(l); err == nil {
			limit = n
		}
	}
	
	resources, err := h.libraryService.GetRecent(limit)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeSuccess(w, resources)
}

// ============================================================================
// SEARCH ENDPOINTS
// ============================================================================

// SearchResources handles GET /api/search
func (h *APIHandler) SearchResources(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	
	filters := services.SearchFilters{
		Subject:   r.URL.Query().Get("subject"),
		SortBy:    r.URL.Query().Get("sort_by"),
		SortOrder: r.URL.Query().Get("sort_order"),
		Page:      1,
		PageSize:  10,
	}
	
	if p := r.URL.Query().Get("page"); p != "" {
		if n, err := strconv.Atoi(p); err == nil {
			filters.Page = n
		}
	}
	
	results, err := h.searchService.Search(query, filters)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	
	writeSuccess(w, results)
}

// GetSuggestions handles GET /api/search/suggestions
func (h *APIHandler) GetSuggestions(w http.ResponseWriter, r *http.Request) {
	partial := r.URL.Query().Get("q")
	suggestions, err := h.searchService.GetSuggestions(partial)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeSuccess(w, suggestions)
}

// ============================================================================
// REPUTATION ENDPOINTS
// ============================================================================

// GetReputation handles GET /api/users/{id}/reputation
func (h *APIHandler) GetReputation(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := models.UserID(vars["id"])
	
	info, err := h.reputationService.GetUserReputation(userID)
	if err != nil {
		writeError(w, http.StatusNotFound, err.Error())
		return
	}
	
	writeSuccess(w, info)
}

// GetNetworkStats handles GET /api/stats
func (h *APIHandler) GetNetworkStats(w http.ResponseWriter, r *http.Request) {
	stats, err := h.reputationService.GetNetworkStats()
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeSuccess(w, stats)
}

// RateResource handles POST /api/resources/{id}/rate
func (h *APIHandler) RateResource(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	resourceID := models.ContentID(vars["id"])
	
	var req RateResourceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON")
		return
	}
	
	// Get resource to find uploader
	resource, err := h.libraryService.GetResource(resourceID)
	if err != nil {
		writeError(w, http.StatusNotFound, err.Error())
		return
	}
	
	// Add rating
	resource.AddRating(models.Rating(req.Rating))
	
	writeSuccess(w, map[string]interface{}{
		"resource_id": resourceID,
		"new_rating":  resource.AverageRating,
	})
}

// SetupRoutes configures all API routes
func (h *APIHandler) SetupRoutes(r *mux.Router) {
	api := r.PathPrefix("/api").Subrouter()
	
	// Users
	api.HandleFunc("/users", h.CreateUser).Methods("POST")
	api.HandleFunc("/users", h.GetAllUsers).Methods("GET")
	api.HandleFunc("/users/{id}", h.GetUser).Methods("GET")
	api.HandleFunc("/users/{id}/reputation", h.GetReputation).Methods("GET")
	api.HandleFunc("/leaderboard", h.GetLeaderboard).Methods("GET")
	
	// Resources
	api.HandleFunc("/resources", h.CreateResource).Methods("POST")
	api.HandleFunc("/resources/popular", h.GetPopularResources).Methods("GET")
	api.HandleFunc("/resources/recent", h.GetRecentResources).Methods("GET")
	api.HandleFunc("/resources/{id}", h.GetResource).Methods("GET")
	api.HandleFunc("/resources/{id}/download", h.DownloadResource).Methods("POST")
	api.HandleFunc("/resources/{id}/rate", h.RateResource).Methods("POST")
	
	// Search
	api.HandleFunc("/search", h.SearchResources).Methods("GET")
	api.HandleFunc("/search/suggestions", h.GetSuggestions).Methods("GET")
	
	// Stats
	api.HandleFunc("/stats", h.GetNetworkStats).Methods("GET")
}
