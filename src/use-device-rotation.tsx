import { useEffect, useState } from 'react';

// Defines the shape of the data, similar to the Swift output (but using Euler angles)
export interface RotationData {
    alpha: number | null; // Rotation around the Z-axis (0 to 360)
    beta: number | null;  // Rotation around the X-axis (-180 to 180)
    gamma: number | null; // Rotation around the Y-axis (-90 to 90)
    absolute: boolean | null; // true if the device is providing absolute orientation
}

// A custom error, mirroring the Swift enum
export class SensorError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SensorError';
    }
}

/**
 * Hook to start observing device rotation updates using the browser's Device Orientation API.
 * @returns An object containing the current rotation data, an error, and a function to request permissions.
 */
export const useDeviceRotation = () => {
    const [rotation, setRotation] = useState<RotationData>({
        alpha: null,
        beta: null,
        gamma: null,
        absolute: null,
    });
    const [error, setError] = useState<SensorError | null>(null);

    // Checks if the 'deviceorientation' event is available in the browser
    const isSensorAvailable = 'DeviceOrientationEvent' in window;

    // The event handler function
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
        // The browser event provides alpha, beta, and gamma
        setRotation({
            alpha: event.alpha,
            beta: event.beta,
            gamma: event.gamma,
            absolute: event.absolute,
        });
        setError(null); // Clear any previous error on successful update
    };

    // Function to request permission (required on iOS/Safari since 2020)
    const requestPermissions = async (): Promise<boolean> => {
        if (!isSensorAvailable) {
            setError(new SensorError('Device Orientation Sensor Not Available.'));
            return false;
        }

        // Modern browsers (like Safari on iOS) require explicit permission
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const permissionState = await (DeviceOrientationEvent as any).requestPermission();

                if (permissionState === 'granted') {
                    // If permission is granted, we'll let useEffect handle adding the listener
                    setError(null);
                    return true;
                } else {
                    setError(new SensorError('Device orientation access denied by user.'));
                    return false;
                }
            } catch (e) {
                setError(new SensorError('Permission request failed.'));
                return false;
            }
        }

        // For other browsers, assume available and granted
        return true;
    };

    // Effect to manage the event listeners (start/stop observing)
    useEffect(() => {
        // This function is the equivalent of 'startObservingRotationUpdates' logic
        const startObserving = () => {
            if (isSensorAvailable) {
                window.addEventListener('deviceorientation', handleDeviceOrientation);
                // Check if we can get the attitude (rotation) data
                // if (rotation.alpha === null && rotation.beta === null && rotation.gamma === null) {
                //     // This block is less critical but can be a good check for an actual reading
                //     // setError(new SensorError('Sensor available but not providing data.')); 
                // }
            } else {
                setError(new SensorError('Device Orientation Sensor Not Available.'));
            }
        }

        startObserving();

        // Cleanup function: equivalent to 'stopObservingRotationUpdates'
        return () => {
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
        };

    }, [isSensorAvailable]); // Re-run if sensor availability changes (unlikely)

    // Returns data, error, and a way to prompt for permissions
    return { rotation, error, isSensorAvailable, requestPermissions };
};