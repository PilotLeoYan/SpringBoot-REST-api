package com.myHugginface.APP.controller;

import com.myHugginface.APP.model.Modelmodel;
import com.myHugginface.APP.service.ModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/models")
public class ModelController {
    @Autowired
    ModelService modelService;

    @GetMapping()
    public ArrayList<Modelmodel> findAllModels(@RequestParam(required = false) String searchName){
        //return modelService.findAllModels();
        if(searchName != null && !searchName.isEmpty()) {
            return modelService.findAllByNameContainingIgnoreCase(searchName);
        }
        return modelService.findAllModels();
    }

    @PostMapping()
    public Modelmodel saveModel(@RequestBody Modelmodel model){
        return modelService.saveModel(model);
    }

    @PutMapping()
    public Modelmodel updateModel(@RequestBody Modelmodel model){
        return modelService.editModel(model);
    }

    @GetMapping("/{id}")
    public Optional<Modelmodel> findById(@PathVariable Long id){
        return modelService.findModel(id);
    }

    @GetMapping("/find-by-name/{name}")
    public Optional<Modelmodel> findByName(@PathVariable String name){
        return modelService.findByName(name);
    }

    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id){
        return modelService.deleteModel(id);
    }
}
