package com.healthinal.backend.helloworld

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
    class healthMetricsController {


    @GetMapping("/health-metrics/{id}")
    fun getUserById(@PathVariable id: String) : String{
        return "User ID: " + id;
    }


}

