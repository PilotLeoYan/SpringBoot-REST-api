package com.myHugginface.APP.service;

import com.myHugginface.APP.model.Modelmodel;
import com.myHugginface.APP.repository.ModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class ModelService {
    @Autowired
    ModelRepository modelRepository;

    public ArrayList<Modelmodel> findAllModels(){
        return (ArrayList<Modelmodel>) modelRepository.findAll();
    }

    public Modelmodel saveModel(Modelmodel studentModel){
        if(modelRepository.findModelByName(studentModel.getName()).isEmpty()){
            return modelRepository.save(studentModel);
        }
        Modelmodel error = new Modelmodel();
        error.setId(-1L);
        return error;
    }

    public Optional<Modelmodel> findModel(Long id){
        return modelRepository.findModelById(id);
    }

    public Optional<Modelmodel> findByName(String name){
        return modelRepository.findModelByName(name);
    }

    public Modelmodel editModel(Modelmodel modelmodel){
        return modelRepository.save(modelmodel);
    }

    public String deleteModel(Long id){
        Optional<Modelmodel> ans = modelRepository.findModelById(id);
        if(ans.isPresent()){
            modelRepository.deleteById(id);
            return "model eleminated";
        }
        return "model not find";
    }

    public ArrayList<Modelmodel> findAllByNameContainingIgnoreCase(String searchName){
        return modelRepository.findAllByNameContainingIgnoreCase(searchName);
    }
}
