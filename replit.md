# Todos API

## Overview

Una API REST simple desarrollada con Flask para manejar una lista de tareas (todos) con interfaz web interactiva para pruebas. La aplicación proporciona operaciones específicas para todos con almacenamiento en memoria, ideal para desarrollo y pruebas. El sistema incluye una interfaz web limpia construida con Bootstrap que permite crear y eliminar tareas mientras visualiza las respuestas de la API en tiempo real.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Flask web framework para simplicidad y naturaleza liviana
- **Storage**: Almacenamiento en memoria usando clases Python (TodoManager y Todo models)
- **API Design**: Endpoints específicos para todos: GET /todos, POST /todos, DELETE /todos/{position}
- **Request Handling**: API basada en JSON con validación de datos y manejo de errores
- **Logging**: Sistema integrado de logging para peticiones/respuestas y debugging

### Frontend Architecture
- **Technology**: JavaScript vanilla con Bootstrap 5 para UI responsiva
- **Design Pattern**: Aplicación de página única con manipulación dinámica del DOM
- **Styling**: Tema oscuro de Bootstrap para apariencia moderna
- **Interactivity**: Interfaz de pruebas de API en tiempo real con logging de respuestas
- **Icons**: Integración de Font Awesome para elementos visuales mejorados

### Data Model
- **Todo Structure**: Modelo simple de todo con "label" (string) y "done" (boolean)
- **Validation**: Validación del lado del cliente y servidor para integridad de datos
- **State Management**: Almacenamiento en memoria usando lista de Python

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