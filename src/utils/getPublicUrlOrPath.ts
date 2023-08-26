import { URL } from "url";

export const getPublicUrlOrPath = (isEnvDevelopment: boolean, homepage: string, envPublicUrl?: string) => {
    // Placehodler domain used to validate other urls / paths
    const validDomain = 'https://create-sage-app.dev';

    if (envPublicUrl) {
        // Ensure last slash exists
        envPublicUrl = envPublicUrl.endsWith('/')
            ? envPublicUrl
            : envPublicUrl + '/';

        // Validate if `envPublicUrl` is a URL or path like `stubDomain`
        // Ignored if `envPublicUrl` contains a domain
        const validPublicUrl = new URL(envPublicUrl, validDomain);

        // Some apps do not use client-side routing with pushState.
        // For these, "homepage" can be set to "." to enable relative asset paths.
        if (!isEnvDevelopment)
            return envPublicUrl;

        return envPublicUrl.startsWith('.')
            ? '/'
            : validPublicUrl.pathname;
    }

    if (homepage) {
        // Strip last slash if exists
        homepage = homepage.endsWith('/') 
            ? homepage 
            : homepage + '/';

        // Validate if `homepage` is a URL or path like and use just pathname
        const validHomepagePathname = new URL(homepage, validDomain).pathname;

        // Some apps do not use client-side routing with pushState.
        // For these, "homepage" can be set to "." to enable relative asset paths.
        if (!isEnvDevelopment)
            return homepage.startsWith('.')
                ? homepage
                : validHomepagePathname;
        
        return homepage.startsWith('.')
            ? '/'
            : validHomepagePathname;
    }

    return '/';
}