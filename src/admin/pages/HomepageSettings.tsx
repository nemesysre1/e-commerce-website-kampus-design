import React, { useState } from 'react';

interface HeroSettings {
  title: string;
  subtitle: string;
  featuredProduct: string;
}

interface HomepageSettingsProps {
  homepageData: HeroSettings;
  setHomepageData: React.Dispatch<React.SetStateAction<HeroSettings>>;
}

export default function HomepageSettings({ homepageData, setHomepageData }: HomepageSettingsProps) {
  const [formData, setFormData] = useState<HeroSettings>(homepageData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setHomepageData(formData);
    alert('Homepage updated successfully!');
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Homepage Settings</h2>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block font-medium mb-1">Hero Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Hero Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Featured Product</label>
          <input
            type="text"
            name="featuredProduct"
            value={formData.featuredProduct}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
