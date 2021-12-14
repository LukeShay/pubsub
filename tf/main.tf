terraform {
  required_providers {
    mycloud = {
      source  = "hashicorp/google"
      version = "~> 4.4"
    }
  }
}

variable "project_id" {
  type = "string"
}

variable "name" {
  type = "string"
  default = "message"
}

provider "google" {
  project = var.project_id
  region  = "us-central1"
}

resource "google_pubsub_schema" "message" {
  name = var.name
  type = "AVRO"
  definition = file("${path.module}/schema/message.avso")
}

resource "google_pubsub_topic" "message" {
  name = var.name
  
  depends_on = [
    google_pubsub_schema.message
  ]

  schema_settings {
    schema = "projects/${var.project_id}/schemas/${var.name}"
    encoding = "JSON"
  }
}

resource "google_pubsub_subscription" "message" {
  name  = var.name
  topic = google_pubsub_topic.message.name

  # 20 minutes
  message_retention_duration = "604800s"
  retain_acked_messages      = true

  ack_deadline_seconds = 20

  expiration_policy {
    ttl = "30s"
  }

  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "25s"
  }

  depends_on = [
    google_pubsub_topic.message
  ]

  enable_message_ordering    = true
}

resource "google_kms_key_ring" "core" {
  name     = "core"
  location = "us-central1"
}

resource "google_kms_crypto_key" "core" {
  name     = "core"
  key_ring = google_kms_key_ring.core.id
}
