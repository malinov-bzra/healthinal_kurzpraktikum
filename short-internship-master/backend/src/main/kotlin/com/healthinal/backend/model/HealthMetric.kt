package com.healthinal.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "health_metrics")
class HealthMetric(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "user_id")
    val userId: String = "",

    val weight: Float = 0f,
    val steps: Int = 0,
    val water: Float = 0f,
    val sleep: Float = 0f,

    @Column(name = "created_at", insertable = false, updatable = false)
    val createdAt: LocalDateTime? = null
)
