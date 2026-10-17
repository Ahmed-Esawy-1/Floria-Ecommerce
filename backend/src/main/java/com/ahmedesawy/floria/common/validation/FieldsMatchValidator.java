package com.ahmedesawy.floria.common.validation;

import org.springframework.beans.BeanWrapperImpl;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class FieldsMatchValidator implements ConstraintValidator<FieldsMatch, Object> {

    private String firstFieldName;
    private String secondFieldName;

    @Override 
    public void initialize(FieldsMatch constraintAnnotation) {
        this.firstFieldName = constraintAnnotation.first();
        this.secondFieldName = constraintAnnotation.second();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        Object firstValue = new BeanWrapperImpl(value).getPropertyValue(firstFieldName);
        Object secondValue = new BeanWrapperImpl(value).getPropertyValue(secondFieldName);

        boolean isValid = firstValue == null ? secondValue == null : firstValue.equals(secondValue);
        
        if(!isValid) {
            context.disableDefaultConstraintViolation();

            context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
                    .addPropertyNode(secondFieldName)
                    .addConstraintViolation();
        }

        return isValid;
    }
    
}
