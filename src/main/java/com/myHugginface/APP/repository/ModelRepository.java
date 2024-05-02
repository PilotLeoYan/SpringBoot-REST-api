package com.myHugginface.APP.repository;

import com.myHugginface.APP.model.Modelmodel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Optional;

@Repository
public interface ModelRepository extends CrudRepository<Modelmodel, Long> {
    public Optional<Modelmodel> findModelById(Long id);
    public Optional<Modelmodel> findModelByName(String name);
    public ArrayList<Modelmodel> findAllByNameContainingIgnoreCase(String name);
}
