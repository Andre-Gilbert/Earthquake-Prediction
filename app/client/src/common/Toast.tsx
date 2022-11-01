import { Intent, Toaster } from '@blueprintjs/core';

const AppToaster = typeof window !== 'undefined' ? Toaster.create() : null;

export const showToast = (path: (string | number)[] | string, message: string) => {
    AppToaster?.show({
        message: (
            <>
                <b>{path}</b>: {message}
            </>
        ),
        intent: Intent.DANGER,
    });
};
