import React from 'react';
import { useSelector } from 'react-redux';
import Select, { OnChangeValue } from 'react-select';
import { selectCategories } from '../../Redux-slices/categories/categorySlices';
import { useIdeaForm } from '../../hooks/useIdeaForm';
import './IdeaForm.scss';

interface SelectOption {
  value: string;
  label: string;
}

const IdeaForm: React.FC = () => {
  const { formData, isLoading, error, handleInputChange, handleSubmit } = useIdeaForm();
  const categories = useSelector(selectCategories);

  const categoryOptions: SelectOption[] = categories.map(cat => ({ value: cat, label: cat }));

  const handleCategoryChange = (option: OnChangeValue<SelectOption, false>) => {
    handleInputChange('category', option?.value || '');
  };

  const handleTagChange = (options: OnChangeValue<SelectOption, true>) => {
    if (options.length <= 5) {
      const tagValues = options.map(tag => tag.value);
      handleInputChange('tags', tagValues);
    } else {
      alert('You can only select up to 5 tags.');
    }
  };

  return (
    <div className="idea-form-cont">
      <form className="idea-form" onSubmit={handleSubmit}>
        <h2>Submit Your Idea</h2>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter title"
          required
        />
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter description"
          required
        />
        
        <div className="category-select">
          <label>Category</label>
          <Select
            options={categoryOptions}
            onChange={handleCategoryChange}
            value={categoryOptions.find(opt => opt.value === formData.category) || null}
            placeholder="Select a category"
            isClearable
          />
        </div>

        <div className="tag-input-container">
          <label>Tags (up to 5):</label>
          <Select
            options={categoryOptions}
            isMulti
            onChange={handleTagChange}
            value={categoryOptions.filter(opt => formData.tags.includes(opt.value))}
            placeholder="Add tags..."
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="submit-button">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Idea'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IdeaForm;
