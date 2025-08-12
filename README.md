# RAG Chat — Node.js + MySQL (Custom SQL)

A store chatbot system, built with Node.js and MySQL using custom SQL queries.

---

## Quick Start

1. Copy the example environment file and fill in your values:

    ```bash
    cp .env.example .env
    ```

2. Edit the `.env` file to configure your environment variables, especially:

    * `API_KEY`
    * MySQL credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`)

3. Build and start the Docker containers:

    ```bash
    docker compose up --build
    ```

4. The API will be available at:
    <PROTOCOL.HOST/API_BASE_PATH/API_VERSION:PORT>

    e.g
    http://localhost:5001/api/v1/

    Swagger UI:
    <PROTOCOL.HOST:PORT/api-docs>

    e.g
    http://localhost:5001/api-docs

---

## Docker Commands

This project uses `docker compose` to manage the services. All commands should be run from the root directory of the project.

### Development and Deployment

* **Build and Start All Containers:** Builds all service images (if they don't exist or have changed) and starts the containers in the background.

    ```bash
    docker compose up --build -d
    ```

* **Start Containers Without Rebuilding:** Starts the containers using existing images.

    ```bash
    docker compose up
    ```

* **Remove all container including db and start as afresh :** Remove all container including db .

    ```bash
    docker compose down -v
    docker compose build --no-cache
    docker compose up --build
    ```

* **Stop All Running Containers:** Stops the services gracefully.

    ```bash
    docker compose stop
    ```

* **Stop and Remove All Containers:** Stops and removes containers, networks, and volumes. Use this for a clean restart.

    ```bash
    docker compose down
    ```

### Logging

* **Follow Logs for All Running Containers:** Streams logs from all services in real-time.

    ```bash
    docker compose logs -f
    ```

* **View Logs From a Specific Service (e.g., backend):**

    ```bash
    docker compose logs backend
    ```

### Testing

* **Run All Tests in a Temporary Container:** Builds and runs the `backend-test` service, then exits.

    ```bash
    docker compose run backend-test
    ```

* **Build Only the Backend Image (without cache):** This is useful for debugging build-related issues.

    ```bash
    docker compose build --no-cache backend
    ```

---

## NPM Commands (Run Locally or Inside Container)

* **Install Dependencies:**

    ```bash
    npm install
    ```

* **Start Backend Server:**

    ```bash
    npm start
    ```

* **Run Jest Tests:**

    ```bash
    npm test
    ```

* **Run Jest Tests with Open Handle Detection (Debug Async Issues):**

    ```bash
    npm test -- --detectOpenHandles
    ```
