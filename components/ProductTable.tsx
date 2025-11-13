import React from "react";
import { Table, Input, Button, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ProductRow } from "@/types";
import { batches } from "@/lib/mockData";
import {
  FormErrors,
  getProductError,
  getProductsArrayError,
} from "@/lib/errorUtils";

const { Option } = Select;

interface ProductTableProps {
  products: ProductRow[];
  onProductsChange: (products: ProductRow[]) => void;
  errors: FormErrors;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onProductsChange,
  errors,
}) => {
  const calculateAmount = (
    qty: number,
    freeQty: number,
    rate: number,
    discount: number
  ): number => {
    const netQty = qty - freeQty;
    return netQty * rate * (1 - discount / 100);
  };

  const updateProduct = (
    id: string,
    field: keyof ProductRow,
    value: string | number
  ) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const updated = { ...product, [field]: value };

        if (["qty", "freeQty", "rate", "discount"].includes(field)) {
          updated.amount = calculateAmount(
            updated.qty,
            updated.freeQty,
            updated.rate,
            updated.discount
          );
        }

        return updated;
      }
      return product;
    });

    onProductsChange(updatedProducts);
  };

  const addProduct = () => {
    const newProduct: ProductRow = {
      id: Date.now().toString(),
      productId: "",
      batchId: "",
      qty: 0,
      freeQty: 0,
      rate: 0,
      discount: 0,
      amount: 0,
    };
    onProductsChange([...products, newProduct]);
  };

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      onProductsChange(products.filter((product) => product.id !== id));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, productId: string) => {
    if (e.key === "Enter" && productId === products[products.length - 1].id) {
      addProduct();
    }
  };

  const columns = [
    {
      title: "Product *",
      dataIndex: "productId",
      key: "product",
      render: (value: string, record: ProductRow, index: number) => {
        const error = getProductError(errors, index, "productId");
        return (
          <div>
            <Select
              value={value || undefined}
              onChange={(val) => updateProduct(record.id, "productId", val)}
              style={{ width: "100%" }}
              placeholder="Select Product"
              status={error ? "error" : ""}
            >
              {products.map((product) => (
                <Option key={product.id} value={product.id}>
                  {product.name}
                </Option>
              ))}
            </Select>
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          </div>
        );
      },
    },
    {
      title: "Batch *",
      dataIndex: "batchId",
      key: "batch",
      render: (value: string, record: ProductRow, index: number) => {
        const error = getProductError(errors, index, "batchId");
        return (
          <div>
            <Select
              value={value || undefined}
              onChange={(val) => updateProduct(record.id, "batchId", val)}
              style={{ width: "100%" }}
              placeholder="Select Batch"
              disabled={!record.productId}
              status={error ? "error" : ""}
            >
              {batches
                .filter((batch) => batch.productId === record.productId)
                .map((batch) => (
                  <Option key={batch.id} value={batch.id}>
                    {batch.batchNumber}
                  </Option>
                ))}
            </Select>
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          </div>
        );
      },
    },
    {
      title: "Qty *",
      dataIndex: "qty",
      key: "qty",
      render: (value: number, record: ProductRow, index: number) => {
        const error = getProductError(errors, index, "qty");
        return (
          <div>
            <Input
              type="number"
              value={value || ""}
              onChange={(e) =>
                updateProduct(record.id, "qty", Number(e.target.value))
              }
              onKeyPress={(e) => handleKeyPress(e, record.id)}
              min={0}
              status={error ? "error" : ""}
            />
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          </div>
        );
      },
    },
    {
      title: "Free Qty",
      dataIndex: "freeQty",
      key: "freeQty",
      render: (value: number, record: ProductRow, index: number) => {
        const error = getProductError(errors, index, "freeQty");
        return (
          <div>
            <Input
              type="number"
              value={value || ""}
              onChange={(e) =>
                updateProduct(record.id, "freeQty", Number(e.target.value))
              }
              onKeyPress={(e) => handleKeyPress(e, record.id)}
              min={0}
              status={error ? "error" : ""}
            />
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          </div>
        );
      },
    },
    {
      title: "Rate *",
      dataIndex: "rate",
      key: "rate",
      render: (value: number, record: ProductRow, index: number) => {
        const error = getProductError(errors, index, "rate");
        return (
          <div>
            <Input
              type="number"
              value={value || ""}
              onChange={(e) =>
                updateProduct(record.id, "rate", Number(e.target.value))
              }
              onKeyPress={(e) => handleKeyPress(e, record.id)}
              min={0}
              step="0.01"
              status={error ? "error" : ""}
            />
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          </div>
        );
      },
    },
    {
      title: "Disc %",
      dataIndex: "discount",
      key: "discount",
      render: (value: number, record: ProductRow, index: number) => {
        const error = getProductError(errors, index, "discount");
        return (
          <div>
            <Input
              type="number"
              value={value || ""}
              onChange={(e) =>
                updateProduct(record.id, "discount", Number(e.target.value))
              }
              onKeyPress={(e) => handleKeyPress(e, record.id)}
              min={0}
              max={100}
              step="0.01"
              status={error ? "error" : ""}
            />
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          </div>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `₹${amount.toFixed(2)}`,
    },
    {
      title: "Action",
      key: "action",
      render: (record: ProductRow) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeProduct(record.id)}
          disabled={products.length === 1}
        />
      ),
    },
  ];

  const productsArrayError = getProductsArrayError(errors);

  return (
    <div className="mb-6">
      <Table
        columns={columns}
        dataSource={products}
        pagination={false}
        rowKey="id"
        footer={() => (
          <div className="flex justify-between items-center">
            <span className="text-red-500">
              {productsArrayError && <span>{productsArrayError}</span>}
            </span>
            <Button type="dashed" onClick={addProduct}>
              Add Product Row
            </Button>
          </div>
        )}
      />
      <div className="py-4 text-right">
        <strong>
          Total Amount: ₹
          {products
            .reduce((sum, product) => sum + product.amount, 0)
            .toFixed(2)}
        </strong>
      </div>
    </div>
  );
};

export default ProductTable;
