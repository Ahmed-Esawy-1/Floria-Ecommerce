package com.ahmedesawy.floria.common.base;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import com.ahmedesawy.floria.common.exception.NotFoundException;

@NoRepositoryBean 
public interface FindOrThrowRepository<T, ID> extends JpaRepository<T, ID> {

    default T findByIdOrThrow(ID id) {
        return findById(id)
                .orElseThrow(() -> new NotFoundException("Not found!"));
    }
    
    default T findByIdOrThrow(ID id, String entityName) {
        return findById(id)
                .orElseThrow(() -> new NotFoundException(entityName + " not found!"));
    }

    
}