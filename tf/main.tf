terraform {
  required_providers {
    mycloud = {
      source  = "hashicorp/google"
      version = "~> 4.4"
    }
  }
}

variable "name" {
  type    = string
  default = "pubsub"
}

variable "project_id" {
  type = string
  default = "pubsub-335122"
}

provider "google" {
  region = "us-central1"
  project = var.project_id
}

resource "google_project_iam_custom_role" "pubsub_secrets" {
  role_id     = "pubsubSecretsRole"
  title       = "PubSubSecretsRole"
  project     = var.project_id
  permissions = ["resourcemanager.projects.get"]
}

resource "google_service_account" "pubsub" {
  account_id   = var.name
  display_name = "PubSub"
  project      = var.project_id
}

resource "google_secret_manager_secret" "pubsub" {
  secret_id = var.name
  project     = var.project_id

  replication {
    user_managed {
      replicas {
        location = "us-central1"
      }
      replicas {
        location = "us-east1"
      }
    }
  }
}

resource "google_secret_manager_secret_iam_binding" "binding" {
  project   = google_secret_manager_secret.pubsub.project
  secret_id = google_secret_manager_secret.pubsub.secret_id
  role      = google_project_iam_custom_role.pubsub_secrets.name

  members = [
    "serviceAccount:${google_service_account.pubsub.email}",
  ]
}

resource "google_pubsub_schema" "pubsub" {
  name       = var.name
  type       = "AVRO"
  definition = file("${path.module}/schema/message.avso")
  project     = var.project_id
}

resource "google_pubsub_topic" "pubsub" {
  name = var.name
  project     = var.project_id

  depends_on = [
    google_pubsub_schema.pubsub
  ]

  schema_settings {
    schema   = "projects/${var.project_id}/schemas/${var.name}"
    encoding = "JSON"
  }
}

resource "google_pubsub_subscription" "pubsub" {
  name  = var.name
  topic = google_pubsub_topic.pubsub.name
  project     = var.project_id

  # 20 minutes
  message_retention_duration = "86400s"
  retain_acked_messages      = true

  ack_deadline_seconds = 20

  expiration_policy {
    ttl = "86400.5s"
  }

  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "25s"
  }

  depends_on = [
    google_pubsub_topic.pubsub
  ]

  enable_message_ordering = true
}