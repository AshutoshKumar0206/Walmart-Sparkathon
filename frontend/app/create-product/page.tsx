'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import axiosClient from '@/lib/axios';
import { toast } from 'sonner';

export default function CreateProductPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    quantity: '',
    price: '',
    description: '',
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('product_name', formData.product_name);
      data.append('category', formData.category);
      data.append('quantity', formData.quantity);
      data.append('price', formData.price);
      data.append('description', formData.description);
      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await axiosClient.post('/products/createProduct', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Product created successfully');
      console.log(res.data);
      setFormData({
        product_name: '',
        category: '',
        quantity: '',
        price: '',
        description: '',
      });
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to create product');
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">🛒 Create New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drag & Drop Uploader */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
            isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          {previewUrl ? (
            <div className="flex justify-center">
              <Image
                src={previewUrl}
                alt="Preview"
                width={180}
                height={180}
                className="object-contain rounded-md"
              />
            </div>
          ) : (
            <p className="text-gray-500">Drag & drop an image here, or click to select</p>
          )}
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <Input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Wireless Headphones"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <Input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Electronics / Grocery"
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <Input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="10"
            min={1}
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (in ₹)</label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="2999"
            min={1}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product details..."
            required
          />
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          Create Product
        </Button>
      </form>
    </section>
  );
}
