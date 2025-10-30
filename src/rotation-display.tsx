'use client'; // Required for Next.js App Router for client-side components

import React, { useEffect } from 'react';

import { useDeviceRotation } from './use-device-rotation'; // Assuming the hook is in a file named useDeviceRotation.ts

const RotationDisplay = () => {
    const { rotation, error, isSensorAvailable, requestPermissions } = useDeviceRotation();

    // Prompt for permissions when the component mounts
    useEffect(() => {
        if (isSensorAvailable) {
            // It's often best practice to prompt for permission based on a user action (e.g., button click)
            // but for automatic startup, this works:
            // requestPermissions();
        }
    }, [isSensorAvailable]);

    const handleStart = async () => {
        const granted = await requestPermissions();
        if (granted) {
            console.log("Started observing rotation updates.");
        }
    }

    return (
        <div>
            {error && <p style={{ color: 'red' }}> Error: {error.message} </p>}

            {
                !isSensorAvailable && (
                    <p>Sensor Not Available on this device / browser.</p>
                )}

            {
                isSensorAvailable && !rotation.alpha && (
                    <button onClick={handleStart}> Request Sensor Permissions and Start </button>
                )
            }

            {
                rotation.alpha !== null && (
                    <table>
                        <thead>
                            <tr><th>Axis</th><th>Angle (Degrees)</th > </tr>
                        </thead>
                        < tbody >
                            <tr><td>Alpha(Z - axis) </td><td>{rotation.alpha?.toFixed(2)}</td > </tr>
                            < tr > <td>Beta(X - axis) </td><td>{rotation.beta?.toFixed(2)}</td > </tr>
                            < tr > <td>Gamma(Y - axis) </td><td>{rotation.gamma?.toFixed(2)}</td > </tr>
                            < tr > <td>Absolute </td><td>{rotation.absolute ? 'Yes' : 'No'}</td > </tr>
                        </tbody>
                    </table>
                )
            }
        </div>
    );
};

export default RotationDisplay;