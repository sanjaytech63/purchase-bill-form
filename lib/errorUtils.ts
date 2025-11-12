import { FieldErrors } from 'react-hook-form';
import { PurchaseBillFormData } from './validation';

export type FormErrors = FieldErrors<PurchaseBillFormData>;

export const getErrorMessage = (errors: FormErrors, fieldName: keyof PurchaseBillFormData): string | undefined => {
    const error = errors[fieldName];
    return error?.message as string | undefined;
};

export const getProductError = (
    errors: FormErrors,
    productIndex: number,
    field: keyof NonNullable<PurchaseBillFormData['products']>[0]
): string | undefined => {
    const productsError = errors.products;

    if (productsError && Array.isArray(productsError)) {
        const productError = productsError[productIndex];
        if (productError && typeof productError === 'object' && field in productError) {
            const fieldError = (productError)[field];
            return fieldError?.message as string | undefined;
        }
    }

    return undefined;
};

export const getProductsArrayError = (errors: FormErrors): string | undefined => {
    const productsError = errors.products;

    if (productsError && 'message' in productsError) {
        return productsError.message as string;
    }

    return undefined;
};