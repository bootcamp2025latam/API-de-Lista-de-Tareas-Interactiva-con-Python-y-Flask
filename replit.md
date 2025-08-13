# Task List API

## Overview

A simple Flask-based REST API for managing tasks with an interactive web interface for testing. The application provides CRUD operations for tasks with in-memory storage, making it ideal for development and testing purposes. The system includes a clean web UI built with Bootstrap that allows users to create, read, update, and delete tasks while viewing API responses in real-time.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Flask web framework chosen for its simplicity and lightweight nature
- **Storage**: In-memory storage using Python classes (TaskManager and Task models)
- **API Design**: RESTful endpoints following standard HTTP methods (GET, POST, PUT, DELETE)
- **Request Handling**: JSON-based API with comprehensive validation and error handling
- **Logging**: Built-in request/response logging for debugging and monitoring

### Frontend Architecture
- **Technology**: Vanilla JavaScript with Bootstrap 5 for responsive UI
- **Design Pattern**: Single-page application with dynamic DOM manipulation
- **Styling**: Bootstrap dark theme for modern appearance
- **Interactivity**: Real-time API testing interface with response logging
- **Icons**: Font Awesome integration for enhanced visual elements

### Data Model
- **Task Structure**: Simple task model with id, title, description, completion status, and timestamps
- **Validation**: Client and server-side validation for data integrity
- **State Management**: In-memory dictionary storage with auto-incrementing IDs

### Security & Configuration
- **CORS**: Enabled for cross-origin requests during development
- **Session Management**: Flask session secret key configuration
- **Environment Variables**: Support for production configuration overrides

## External Dependencies

### Frontend Libraries
- **Bootstrap 5**: CSS framework for responsive design and components
- **Font Awesome 6**: Icon library for enhanced user interface

### Backend Packages
- **Flask**: Core web framework for API development
- **Flask-CORS**: Cross-origin resource sharing support for frontend-backend communication

### Development Tools
- **Python Logging**: Built-in logging system for request/response tracking
- **Flask Debug Mode**: Development server with hot reloading capabilities

Note: The current implementation uses in-memory storage. For production use, this would typically be replaced with a persistent database solution like PostgreSQL with an ORM such as SQLAlchemy or Drizzle.