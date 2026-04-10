package com.healthinal.backend.service

import com.healthinal.backend.dto.*
import com.healthinal.backend.model.HealthMetric
import com.healthinal.backend.repository.HealthMetricRepository
import org.springframework.stereotype.Service

@Service
class HealthMetricService(private val repository: HealthMetricRepository) {

    fun createMetric(req: HealthMetricRequest): HealthMetricResponse {
        val entity = HealthMetric(
            userId = req.userId,
            weight = req.weight,
            steps = req.steps,
            water = req.water,
            sleep = req.sleep
        )
        val saved = repository.save(entity)
        return mapToResponse(saved)
    }

    fun getMetricsByUserId(userId: String): List<HealthMetricResponse> {
        return repository.findByUserId(userId).map { mapToResponse(it) }
    }

    private fun mapToResponse(it: HealthMetric) = HealthMetricResponse(
        id = it.id,
        userId = it.userId,
        weight = it.weight,
        steps = it.steps,
        water = it.water,
        sleep = it.sleep,
        createdAt = it.createdAt.toString()
    )
}
