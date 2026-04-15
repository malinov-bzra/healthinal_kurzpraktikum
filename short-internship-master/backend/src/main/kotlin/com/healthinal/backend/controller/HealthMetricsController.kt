package com.healthinal.backend.controller

import com.healthinal.backend.dto.*
import com.healthinal.backend.service.HealthMetricService
import org.springframework.ai.chat.model.ChatModel
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/health-metrics")
@CrossOrigin(origins = ["*"])
class HealthMetricController(
    private val service: HealthMetricService,
    private val chatModel: ChatModel
) {

    @PostMapping
    fun create(@RequestBody req: HealthMetricRequest) = service.createMetric(req)

    @GetMapping("/{userId}")
    fun getAll(@PathVariable userId: String) = service.getMetricsByUserId(userId)

    @GetMapping("/analyze/{userId}")
    fun analyze(@PathVariable userId: String): String {
        val history = service.getMetricsByUserId(userId).takeLast(7)
        if (history.isEmpty()) return "Keine Daten für eine Analyse gefunden."

        val context = history.joinToString("\n") {
            "Datum: ${it.createdAt}, Wasser: ${it.water}L, Schritte: ${it.steps}, Schlaf: ${it.sleep}h"
        }

        val prompt = """
            Analysiere diese Gesundheitsdaten kurz auf Deutsch:
            $context
            Gib einen Trend und einen Tipp für morgen.
        """.trimIndent()

        return chatModel.call(prompt)
    }
}
