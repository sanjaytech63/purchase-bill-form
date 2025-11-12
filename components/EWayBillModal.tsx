"use client";

import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eWayBillSchema } from '@/lib/validation';
import { EWayBill } from '@/types';

interface EWayBillModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: EWayBill) => void;
    initialData?: EWayBill;
}

const EWayBillModal: React.FC<EWayBillModalProps> = ({
    open,
    onClose,
    onSave,
    initialData
}) => {
    const { register, handleSubmit, formState: { errors }, reset, setFocus, setValue, watch, trigger } = useForm<EWayBill>({
        resolver: zodResolver(eWayBillSchema),
        defaultValues: initialData || {
            distance: 0,
            transporteryName: '',
            transporteryGstin: '',
            vehicleNumber: '',
            documentNumber: ''
        },
    });

    const formValues = watch();

    useEffect(() => {
        if (open) {
            reset(initialData || {
                distance: 0,
                transporteryName: '',
                transporteryGstin: '',
                vehicleNumber: '',
                documentNumber: ''
            });
            setTimeout(() => {
                setFocus('distance');
            }, 100);
        }
    }, [open, reset, initialData, setFocus]);

    const onSubmit = (data: EWayBill) => {
        onSave(data);
        onClose();
    };

    const handleInputChange = (field: keyof EWayBill, value: string) => {
        setValue(field, value);
    };

    const handleNumberChange = (field: keyof EWayBill, value: string) => {
        const numValue = value === '' ? 0 : Number(value);
        setValue(field, numValue, { shouldValidate: true });
    };

    const handleFieldBlur = (field: keyof EWayBill) => {
        trigger(field);
    };

    return (
        <Modal
            title="Add E-Way Bill"
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item
                    label="Distance (km)"
                    validateStatus={errors.distance ? 'error' : ''}
                    help={errors.distance?.message}
                >
                    <Input
                        type="number"
                        value={formValues.distance || ''}
                        onChange={(e) => handleNumberChange('distance', e.target.value)}
                        onBlur={() => handleFieldBlur('distance')}
                        min={0}
                        step="1"
                    />
                </Form.Item>

                <Form.Item
                    label="Transportery Name"
                    validateStatus={errors.transporteryName ? 'error' : ''}
                    help={errors.transporteryName?.message}
                >
                    <Input
                        value={formValues.transporteryName || ''}
                        onChange={(e) => handleInputChange('transporteryName', e.target.value)}
                        onBlur={() => handleFieldBlur('transporteryName')}
                    />
                </Form.Item>

                <Form.Item
                    label="Transportery GSTIN"
                    validateStatus={errors.transporteryGstin ? 'error' : ''}
                    help={errors.transporteryGstin?.message}
                >
                    <Input
                        value={formValues.transporteryGstin || ''}
                        onChange={(e) => handleInputChange('transporteryGstin', e.target.value)}
                        onBlur={() => handleFieldBlur('transporteryGstin')}
                    />
                </Form.Item>

                <Form.Item
                    label="Vehicle Number"
                    validateStatus={errors.vehicleNumber ? 'error' : ''}
                    help={errors.vehicleNumber?.message}
                >
                    <Input
                        value={formValues.vehicleNumber || ''}
                        onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                        onBlur={() => handleFieldBlur('vehicleNumber')}
                    />
                </Form.Item>

                <Form.Item
                    label="Document Number"
                    validateStatus={errors.documentNumber ? 'error' : ''}
                    help={errors.documentNumber?.message}
                >
                    <Input
                        value={formValues.documentNumber || ''}
                        onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                        onBlur={() => handleFieldBlur('documentNumber')}
                    />
                </Form.Item>

                <div className="flex justify-end space-x-2 mt-6">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default EWayBillModal;