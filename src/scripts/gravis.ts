if (!window.__gravisLoaded) {
    window.__gravisLoaded = true;

    let active: boolean = false;

    window.__gravis = {
        enable: (): void => { active = true; },
            disable: (): void => { active = false; },
            isActive: (): boolean => active
    };
}
