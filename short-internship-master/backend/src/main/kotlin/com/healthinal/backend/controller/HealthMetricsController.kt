package com.healthinal.backend.controller

import com.healthinal.backend.dto.*
import com.healthinal.backend.service.HealthMetricService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/health-metrics")
@CrossOrigin(origins = ["*"])
class HealthMetricController(private val service: HealthMetricService) {

    @PostMapping
    fun create(@RequestBody req: HealthMetricRequest) = service.createMetric(req)

    @GetMapping("/{userId}")
    fun getAll(@PathVariable userId: String) = service.getMetricsByUserId(userId)
}
