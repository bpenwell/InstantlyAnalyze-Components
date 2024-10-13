import { IRentalCalculatorData, setRentalCalculatorFormState } from '@bpenwell/rei-module';
import React, { useEffect, useState } from 'react';
import './ImageUploadContainer.css';

export interface IImageUploadContainerProps {
    image: string | undefined; //base64 image
    setState: Function;
};

export const ImageUploadContainer = (props: IImageUploadContainerProps) => {
    const { image, setState } = props;
    
    const handleImageChange = (event: any) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result;
                setRentalCalculatorFormState(setState, 'propertyInformation', 'image', base64Image as string);
            };
            reader.readAsDataURL(file); // Convert image to base64 string
        }
    };

    return (
        <div
        className={`image-upload-container${image ? '' : ' bordered'}`}
        onClick={() => document.getElementById('image-upload')?.click()}
        >
            {image ? (
                <img className="uploaded-image" src={image} alt="Uploaded"/>
            ) : (
                <h4>Click to add property image</h4>
            )}
            <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }} // Hide the input field
            />
        </div>
    );
}
