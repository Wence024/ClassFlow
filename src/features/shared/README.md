# Shared Features

This directory contains features and functionality shared across ALL user roles.

## Structure

- `auth/` - Authentication workflows (login, profile, registration)
- `general/` - Universal components and utilities
  - `notifications/` - Notification infrastructure
  - `shared/` - Global types and constants

## Guidelines

Only truly cross-role functionality belongs here. Role-specific code should be in the respective role directories.
