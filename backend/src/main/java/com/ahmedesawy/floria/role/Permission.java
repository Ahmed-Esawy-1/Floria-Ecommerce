package com.ahmedesawy.floria.role;

public enum Permission {
    VIEW_DASHBOARD("view:dashboard"),

    // Section Permissions
    CREATE_SECTION("create:section"),
    READ_SECTION("read:section"),
    UPDATE_SECTION("update:section"),
    DELETE_SECTION("delete:section"),

    // Category Permissions
    CREATE_CATEGORY("create:category"),
    READ_CATEGORY("read:category"),
    UPDATE_CATEGORY("update:category"),
    DELETE_CATEGORY("delete:category"),

    // Occasion Permissions
    CREATE_OCCASION("create:occasion"),
    READ_OCCASION("read:occasion"),
    UPDATE_OCCASION("update:occasion"),
    DELETE_OCCASION("delete:occasion"),

    // Color Permissions
    CREATE_COLOR("create:color"),
    READ_COLOR("read:color"),
    UPDATE_COLOR("update:color"),
    DELETE_COLOR("delete:color"),

    // Product Permissions
    CREATE_PRODUCT("create:product"),
    READ_PRODUCT("read:product"),
    UPDATE_PRODUCT("update:product"),
    DELETE_PRODUCT("delete:product"),

    // City Permissions
    CREATE_CITY("create:city"),
    READ_CITY("read:city"),
    UPDATE_CITY("update:city"),
    DELETE_CITY("delete:city"),

    // Coupon Permissions
    CREATE_COUPON("create:coupon"),
    READ_COUPON("read:coupon"),
    UPDATE_COUPON("update:coupon"),
    DELETE_COUPON("delete:coupon"),

    // Order Permissions
    READ_ORDER("read:order"),
    UPDATE_ORDER("update:order"),
    DELETE_ORDER("delete:order"),

    // Employee Permissions
    CREATE_EMPLOYEE("create:employee"),
    READ_EMPLOYEE("read:employee"),
    UPDATE_EMPLOYEE("update:employee"),
    DELETE_EMPLOYEE("delete:employee"),

    // CUSTOMER
    CREATE_CUSTOMER("create:customer"),
    READ_CUSTOMER("read:customer"),
    UPDATE_CUSTOMER("update:customer"),
    DELETE_CUSTOMER("delete:customer"),

    // Role Permissions
    CREATE_ROLE("create:role"),
    READ_ROLE("read:role"),
    UPDATE_ROLE("update:role"),
    DELETE_ROLE("delete:role"),

    MANAGE_PERMISSIONS("manage:permissions"),

    // Settings
    MANAGE_SETTINGS("manage:settings");

    private final String permission;

    Permission(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return permission;
    }
}