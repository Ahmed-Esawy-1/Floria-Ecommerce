package com.ahmedesawy.floria.common.util;

import lombok.experimental.UtilityClass;

@UtilityClass
public class ImageUrlResolver {

    private static final String UPLOAD_BASE_PATH = "/api/upload_images/";

    public static String resolve(String folder, String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return null;
        }

        // Google avatars
        if (isExternalAvatar(imageUrl)) {
            return imageUrl;
        }

        return UPLOAD_BASE_PATH + folder + "/" + imageUrl;
    }

    private static boolean isExternalAvatar(String imageUrl) {
        return imageUrl.startsWith("https://") || imageUrl.startsWith("http://");
    }
}