package com.healthinal.backend.repository

import com.healthinal.backend.model.HealthMetric
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface HealthMetricRepository : JpaRepository<HealthMetric, Long> {
    fun findByUserId(userId: String): List<HealthMetric>
}
