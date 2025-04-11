import React from 'react';
import { Upload, X } from 'lucide-react';

const ImageUploader = ({ images, handleImageChange, removeImage, disabled }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Product Images</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 mb-2">
        {[1, 2, 3, 4, 5].map((num) => {
          const imageKey = `image${num}`;
          const currentImage = images[imageKey];
          return (
            <div
              key={imageKey}
              className={`relative aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center overflow-hidden ${
                currentImage ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {currentImage ? (
                <>
                  <img
                    src={
                      typeof currentImage === 'string'
                        ? currentImage
                        : currentImage instanceof File
                        ? URL.createObjectURL(currentImage)
                        : '/placeholder-product.jpg'
                    }
                    alt="Product preview"
                    className="object-cover w-full h-full absolute inset-0"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(imageKey)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition-colors"
                    disabled={disabled}
                  >
                    <X size={16} className="text-red-500" />
                  </button>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Upload image</p>
                  <label htmlFor={imageKey} className="absolute inset-0 cursor-pointer">
                    <input
                      type="file"
                      id={imageKey}
                      hidden
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, imageKey)}
                      disabled={disabled}
                    />
                  </label>
                </>
              )}
              {num === 1 && !currentImage && (
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg">
                  Main
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">Upload up to 5 images. First image will be the main product image.</p>
    </div>
  );
};

export default ImageUploader;