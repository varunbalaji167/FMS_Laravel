import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { toast } from "sonner";

export default function ToastListener() {
    const { flash = {}, errors = {} } = usePage().props;

    useEffect(() => {
        // Catch Backend Flash Messages
        if (flash?.success) {
            toast.success(flash.success, { duration: 4000 });
        }
        if (flash?.error) {
            toast.error(flash.error, { duration: 5000 });
        }

        // Catch Validation Errors
        if (errors && Object.keys(errors).length > 0) {
            Object.entries(errors).forEach(([field, message]) => {
                const fieldName =
                    field.charAt(0).toUpperCase() + field.slice(1);
                toast.error(`${fieldName} Validation Error`, {
                    description: message,
                    duration: 5000,
                });
            });
        }
    }, [flash, errors]);

    return null;
}
