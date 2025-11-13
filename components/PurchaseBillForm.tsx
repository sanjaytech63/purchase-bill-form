"use client";

import React, { useEffect, useRef, useState } from "react";
import { Form, Button, message, Row, Col } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  purchaseBillFormSchema,
  type PurchaseBillFormData,
} from "@/lib/validation";
import { saveFormData, loadFormData } from "@/lib/storage";
import {
  vendors,
  purchaseOrders,
  paymentMethods,
  transportAgencies,
} from "@/lib/mockData";
import ProductTable from "./ProductTable";
import EWayBillModal from "./EWayBillModal";
import FormField from "./FormField";
import { ProductRow, EWayBill } from "@/types";
import type { BaseSelectRef } from "rc-select";

const PurchaseBillForm: React.FC = () => {
  const vendorSelectRef = useRef<BaseSelectRef>(null);
  const [showEWayBillModal, setShowEWayBillModal] = useState(false);
  const [filteredPOs, setFilteredPOs] = useState(purchaseOrders);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    setFocus,
  } = useForm<PurchaseBillFormData>({
    resolver: zodResolver(purchaseBillFormSchema),
    defaultValues: {
      vendorId: "",
      poNumber: "",
      billNumber: "",
      billDate: "",
      dueDate: "",
      paymentMethod: "",
      transportAgency: "",
      products: [
        {
          id: "1",
          productId: "",
          batchId: "",
          qty: 0,
          freeQty: 0,
          rate: 0,
          discount: 0,
          amount: 0,
        },
      ],
      eWayBill: undefined,
      totalAmount: 0,
      status: "draft",
    },
  });

  const formValues = watch();
  const vendorId = watch("vendorId");

  useEffect(() => {
    const savedData = loadFormData();
    if (savedData) {
      Object.keys(savedData).forEach((key) => {
        setValue(
          key as keyof PurchaseBillFormData,
          savedData[key as keyof PurchaseBillFormData]
        );
      });
    }

    setTimeout(() => {
      setFocus("vendorId");
      if (vendorSelectRef.current) {
        vendorSelectRef.current.focus();
      }
    }, 100);
  }, [setValue, setFocus]);

  useEffect(() => {
    if (vendorId) {
      const filtered = purchaseOrders.filter((po) => po.vendorId === vendorId);
      setFilteredPOs(filtered);

      const currentPO = formValues.poNumber;
      const isPOValid = filtered.some((po) => po.poNumber === currentPO);
      if (!isPOValid) {
        setValue("poNumber", "");
      }
    } else {
      setFilteredPOs([]);
    }
  }, [vendorId, setValue, formValues.poNumber]);

  useEffect(() => {
    const total =
      formValues.products?.reduce(
        (sum, product) => sum + (product.amount || 0),
        0
      ) || 0;
    setValue("totalAmount", total);
  }, [formValues.products, setValue]);

  const handleProductsChange = (products: ProductRow[]) => {
    setValue("products", products);
  };

  const handleEWayBillSave = (eWayBill: EWayBill) => {
    setValue("eWayBill", eWayBill);
  };

  const handleSave = (status: "draft" | "saved") => {
    if (status === "draft") {
      const formData = { ...formValues, status };
      saveFormData(formData);
      message.success("Saved as Draft");
      console.log("Draft saved:", formData);
    } else {
      handleSubmit((data) => {
        const formData = { ...data, status };
        saveFormData(formData);
        message.success("Saved (mock)");
        console.log("Form Data:", formData);
      })().catch((error) => {
        console.error("Validation failed:", error);
        message.error("Please fix validation errors before saving");
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 border rounded-2xl border-gray-300">
      <h1 className="text-2xl font-bold mb-6">Create New Purchase Bill</h1>

      <Form layout="vertical" className="space-y-6">
        {/* Vendor and PO Section */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <FormField
              label="Vendor Name"
              name="vendorId"
              type="select"
              required={true}
              register={register}
              errors={errors}
              setValue={setValue}
              trigger={trigger}
              value={formValues.vendorId}
              options={vendors}
              autoFocus={true}
              selectRef={vendorSelectRef}
              placeholder="Select Vendor"
            />
          </Col>
          <Col xs={24} md={12}>
            <FormField
              label="PO #"
              name="poNumber"
              type="select"
              required={true}
              register={register}
              errors={errors}
              setValue={setValue}
              trigger={trigger}
              value={formValues.poNumber}
              options={filteredPOs.map((po) => ({
                id: po.poNumber,
                name: po.poNumber,
              }))}
              disabled={!vendorId}
              placeholder="Select Purchase Order"
            />
          </Col>
        </Row>

        {/* Bill Details Section */}
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <FormField
              label="Bill Number"
              name="billNumber"
              type="text"
              required={true}
              register={register}
              errors={errors}
              setValue={setValue}
              trigger={trigger}
              value={formValues.billNumber}
              placeholder="Enter Bill Number"
            />
          </Col>
          <Col xs={24} md={8}>
            <FormField
              label="Bill Date"
              name="billDate"
              type="date"
              required={true}
              register={register}
              errors={errors}
              setValue={setValue}
              trigger={trigger}
              value={formValues.billDate}
            />
          </Col>
          <Col xs={24} md={8}>
            <FormField
              label="Due Date"
              name="dueDate"
              type="date"
              required={true}
              register={register}
              errors={errors}
              setValue={setValue}
              trigger={trigger}
              value={formValues.dueDate}
            />
          </Col>
        </Row>

        {/* Payment and Transport Section */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <FormField
              label="Payment Method"
              name="paymentMethod"
              type="select"
              required={true}
              register={register}
              errors={errors}
              setValue={setValue}
              trigger={trigger}
              value={formValues.paymentMethod}
              options={paymentMethods}
              placeholder="Select Payment Method"
            />
          </Col>
          <Col xs={24} md={12}>
            <FormField
              label="Transport Agency"
              name="transportAgency"
              type="select"
              required={true}
              register={register}
              errors={errors}
              setValue={setValue}
              trigger={trigger}
              value={formValues.transportAgency}
              options={transportAgencies}
              placeholder="Select Transport Agency"
            />
          </Col>
        </Row>

        {/* Product Table */}
        <ProductTable
          products={formValues.products || []}
          onProductsChange={handleProductsChange}
          errors={errors}
        />

        {/* E-Way Bill Section */}
        <div className="mb-6">
          <Button type="primary" onClick={() => setShowEWayBillModal(true)}>
            Add E-Way Bill
          </Button>
          {formValues.eWayBill && (
            <div className="mt-2 p-2 bg-gray-50 rounded">
              <span className="text-green-600">E-Way Bill added</span>
            </div>
          )}
        </div>

        {/* Total Amount Display */}
        <div className="text-right text-lg font-semibold border-t border-gray-300 pt-4">
          Total Amount: ₹{(formValues.totalAmount || 0).toFixed(2)}
        </div>

        {/* Form Actions */}
        <div className="flex space-x-4 justify-end pt-6">
          <Button
            type="default"
            size="large"
            onClick={() => handleSave("draft")}
          >
            Save as Draft
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => handleSave("saved")}
          >
            Save
          </Button>
        </div>
      </Form>

      {/* E-Way Bill Modal */}
      <EWayBillModal
        open={showEWayBillModal}
        onClose={() => setShowEWayBillModal(false)}
        onSave={handleEWayBillSave}
        initialData={formValues.eWayBill}
      />
    </div>
  );
};

export default PurchaseBillForm;
