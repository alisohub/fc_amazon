export interface WorkTimeData {
    ms: number;
    formatted: string;
}

/**
 * Calculates the exact amount of milliseconds a user has been working,
 * factoring in day/night shifts, custom start times, and Amazon break deductions.
 */
export function getEffectiveWorkTime(customStartTime: string | null, counterOption: number): WorkTimeData {
    const now = new Date();
    const hours = now.getHours();
    const isNight = hours >= 17 || hours < 6;
    let shiftStart = new Date(now.getTime());

    let appliedCustomTime = false;
    
    // Safely parse the manual HH:MM text input
    if (customStartTime && customStartTime.includes(':')) {
        const parts = customStartTime.split(':');
        const cHours = parseInt(parts[0], 10);
        const cMins = parseInt(parts[1], 10);
        
        if (!isNaN(cHours) && !isNaN(cMins) && cHours >= 0 && cHours <= 23 && cMins >= 0 && cMins <= 59) {
            shiftStart.setHours(cHours, cMins, 0, 0);
            if (isNight && hours < 6 && cHours >= 17) {
                shiftStart.setDate(shiftStart.getDate() - 1);
            }
            appliedCustomTime = true;
        }
    } 
    
    // Default Logic if no custom time is set
    if (!appliedCustomTime) {
        if (isNight) {
            if (hours < 6) shiftStart.setDate(shiftStart.getDate() - 1);
            shiftStart.setHours(18, 30, 0, 0);
        } else {
            shiftStart.setHours(6, 30, 0, 0);
        }
    }

    const elapsedMs = now.getTime() - shiftStart.getTime();
    if (elapsedMs <= 0) return { ms: 0, formatted: '0h0m' };
    
    let breakStart = new Date(shiftStart.getTime());
    let breakEnd = new Date(shiftStart.getTime());
    const opt = counterOption || 1;
    
    // Break schedules
    if (isNight) {
        if (opt === 1) { breakStart.setHours(23, 20, 0, 0); breakEnd.setHours(23, 50, 0, 0); }
        else if (opt === 2) { breakStart.setHours(23, 50, 0, 0); breakEnd.setDate(breakEnd.getDate() + 1); breakEnd.setHours(0, 20, 0, 0); }
        else if (opt === 3) { breakStart.setDate(breakStart.getDate() + 1); breakStart.setHours(0, 20, 0, 0); breakEnd.setDate(breakEnd.getDate() + 1); breakEnd.setHours(0, 50, 0, 0); }
        else if (opt === 4) { breakStart.setDate(breakStart.getDate() + 1); breakStart.setHours(0, 50, 0, 0); breakEnd.setDate(breakEnd.getDate() + 1); breakEnd.setHours(1, 20, 0, 0); }
    } else {
        if (opt === 1) { breakStart.setHours(11, 20, 0, 0); breakEnd.setHours(11, 50, 0, 0); }
        else if (opt === 2) { breakStart.setHours(11, 50, 0, 0); breakEnd.setHours(12, 20, 0, 0); }
        else if (opt === 3) { breakStart.setHours(12, 20, 0, 0); breakEnd.setHours(12, 50, 0, 0); }
        else if (opt === 4) { breakStart.setHours(12, 50, 0, 0); breakEnd.setHours(13, 20, 0, 0); }
    }
    
    let effectiveMs = elapsedMs;
    
    if (now >= breakStart && now < breakEnd) {
        effectiveMs = breakStart.getTime() - shiftStart.getTime();
    } else if (now >= breakEnd) {
        effectiveMs = elapsedMs - (30 * 60 * 1000);
    }
    
    const maxMs = 10 * 60 * 60 * 1000;
    if (effectiveMs > maxMs) effectiveMs = maxMs;
    
    const totalMinutes = Math.floor(effectiveMs / (1000 * 60));
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    
    return { ms: effectiveMs, formatted: `${h}h${m}m` };
}

/**
 * Calculates Units Per Hour (UPH) safely.
 */
export function calculateUPH(itemCount: number, effectiveMs: number): string {
    if (itemCount === 0 || effectiveMs <= 0) return "0.0";
    const hoursWorked = effectiveMs / (1000 * 60 * 60);
    return (itemCount / hoursWorked).toFixed(1);
}

/**
 * Calculates the percentage to target dynamically.
 */
export function calculatePercentageStr(uphString: string, targetRate: number): string {
    if (targetRate <= 0) return "---%";
    return ((parseFloat(uphString) / targetRate) * 100).toFixed(1) + "%";
}
