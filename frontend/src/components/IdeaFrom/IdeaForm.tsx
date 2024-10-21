import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPostedContent, selectUser } from '../../components/Auth/userSlice';
import { selectCategories } from '../../Redux-slices/categories/categorySlices';
import axios from 'axios';
import Select from 'react-select';
import './IdeaForm.scss';

const IdeaForm: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const user = useSelector(selectUser);
    const [category, setCategory] = useState<string>('');  // Store category as a string
    const [tags, setTags] = useState<string[]>([]);  // Store tags as an array of strings
    const [tagInput, setTagInput] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    const categories = useSelector(selectCategories);
    
    const dispatch = useDispatch();

    const handleCategoryChange = (selectedCategory: any) => {
        setCategory(selectedCategory?.value || '');  // Extract string from selected value
    };

    const handleTagChange = (selectedTags: any) => {
        if (selectedTags.length <= 5) {
            setTags(selectedTags.map((tag: any) => tag.value));  // Extract values from selected tags
        } else {
            alert('You can only select up to 5 tags.');
        }
    };

    const validateForm = () => {
        if (!title.trim() || !description.trim() || !category) {
            alert('All fields are required.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post('http://localhost:5000/idea/add', {
                title, 
                description, 
                creator: user.username, 
                category,  // Send category as a string
                tags,  // Send tags as an array of strings
            }, { withCredentials: true });

            const ideaId = response.data._id;
            await axios.put(`http://localhost:5000/user/${user.username}/add-posted-idea`, { ideaId }, { withCredentials: true });

            if (response.status === 201) {
                alert('Idea submitted successfully!');
                dispatch(addPostedContent(ideaId));
            } else {
                alert('Error submitting idea');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="idea-form-cont">
            <form className="idea-form" onSubmit={handleSubmit}>
                <h2>Submit Your Idea</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    required
                />
                
                <div className="category-select">
                    <label>Category</label>
                    <Select
                        options={categories.map(cat => ({ value: cat, label: cat }))}  // Categories still as options with value as string
                        onChange={handleCategoryChange}
                        value={category ? { value: category, label: category } : null}  // Display as selected category
                        placeholder="Select a category"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.75rem',
                                boxShadow: 'none',
                                '&:hover': { borderColor: '#3b82f6' },
                            }),
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                            }),
                            menuList: (provided) => ({
                              ...provided,
                              maxHeight: '150px', // Set max height for the dropdown
                              overflowY: 'auto', // Enable vertical scrolling
                            }),
                        }}
                        isClearable
                    />
                </div>


                <div className="tag-input-container">
                    <label>Tags:</label>
                    <Select
                        options={categories.map(cat => ({ value: cat, label: cat }))}  // Use categories as options for tags too
                        isMulti
                        onChange={handleTagChange}
                        value={tags.map(tag => ({ value: tag, label: tag }))}  // Convert tags to the format expected by react-select
                        placeholder="Add tags..."
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.75rem',
                                boxShadow: 'none',
                                '&:hover': { borderColor: '#3b82f6' },
                            }),
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                            }),
                            menuList: (provided) => ({
                              ...provided,
                              maxHeight: '100px', // Set max height for the dropdown
                              overflowY: 'auto', // Enable vertical scrolling
                            }),
                            multiValue: (provided) => ({
                                ...provided,
                                backgroundColor: 'transparent',
                            }),
                            multiValueLabel: (provided) => ({
                                ...provided,
                                color: '#2563eb',
                            }),
                            multiValueRemove: (provided) => ({
                                ...provided,
                                color: '#f87171',
                                cursor: 'pointer',
                                '&:hover': { color: '#ef4444' },
                            }),
                        }}
                    />
                </div>

                <div className="submit-button">
                    <button type="submit">Submit Idea</button>
                </div>
            </form>
        </div>
    );
};

export default IdeaForm;
