# Getting Started Guide

Welcome to the ClassFlow development team! This guide will walk you through setting up your local environment and running the application.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/) for version control
- A [Supabase](https://supabase.com/) account (the free tier is sufficient)

## 1. Supabase Project Setup

This application uses Supabase for its database, authentication, and real-time features.

### Database Schema

1. **Create a New Project**: Log in to your Supabase account and create a new project.
2. **Run the Schema Script**: Navigate to the **SQL Editor** in your Supabase project dashboard. Copy the entire contents of the `supabase/schema.sql` file from this repository and run it. This script will create the initial tables and relationships.
3. **Apply Migrations**: The project may contain migration files in the `supabase/migrations` directory. Apply any new migrations to your database schema to ensure it is up-to-date with the latest changes, such as adding the `program_id` columns.

### Get Your Credentials

1. After setting up the project, navigate to **Project Settings > API**.
2. You will need two values from this page:
    - The **Project URL**.
    - The **Project API Key** (the `anon` `public` key).

## 2. Local Environment Setup

Now, let's get the application code running on your machine.

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/classflow.git

# Navigate into the project directory
cd classflow

# Install all dependencies
npm install
```

### Configure Environment Variables

1. In the project's root directory, find the `.env.example` file.
2. Create a copy of this file and name it `.env`.
3. Open the new `.env` file and paste in the credentials you copied from your Supabase project:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

## 3. Running the Application

With your environment configured, you can now start the development server.

```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

### Important: Set User Role

After registering a new user, you must manually set their role in the Supabase database for the application to function correctly.

1. Navigate to **Table Editor > profiles** in your Supabase dashboard.
2. Find the new user's row and set their `role` to either `admin` or `program_head`.
3. Assign them a `program_id` by selecting one from your `programs` table.

## Development Workflow

- **Branching**: Follow a standard feature-branching model (e.g., `feature/add-new-sidebar`, `fix/login-bug`).
- **Committing**: Use conventional commit messages (`feat:`, `fix:`, `refactor:`, etc.).
- **Pre-merge Check**: Before merging, run the full quality suite: `npm run premerge`.
