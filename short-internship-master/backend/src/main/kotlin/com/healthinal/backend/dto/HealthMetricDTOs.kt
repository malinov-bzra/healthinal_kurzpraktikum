package com.healthinal.backend.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class HealthMetricRequest(
    @JsonProperty("user_id") val userId: String,
    val weight: Float,
    val steps: Int,
    val water: Float,
    val sleep: Float
)

data class HealthMetricResponse(
    val id: Long,
    val userId: String,
    val weight: Float,
    val steps: Int,
    val water: Float,
    val sleep: Float,
    val createdAt: String
)

data class AnalysisRequest(
    val history: List<HealthMetricResponse>,
    val userId: String
)
