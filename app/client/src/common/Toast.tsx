import { Intent, Toaster } from '@blueprintjs/core';

const toaster = typeof window !== 'undefined' ? Toaster.create() : null;

export const showToast = (path: (string | number)[] | string, message: string) => {
    toaster?.show({
        message: (
            <>
                <b>{path}</b>: {message}
            </>
        ),
        intent: Intent.DANGER,
    });
};
