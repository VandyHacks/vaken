---
id: routing
title: Routing
sidebar_label: Routing
---

## Overview

This page covers aspects of how Vaken handles routing in the application, including route authentication, and how to add new routes.

## Existing Routes

### Authentication

All of our routes are protected by authenticating against what type the user is. As detailed in [other documents](docs/../auth.md), only certain user types have access to different areas in the application. Routing is generally controlled via an [AuthContext]
